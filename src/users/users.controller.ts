import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import {organizations} from "../data";
import {Organization} from "../types";



const prisma = new PrismaClient();

export class UserController {
    static async register(req: Request, res: Response) {
        const { username, email, password, userType, registrationCode } = req.body;
       
        if (await prisma.user.findFirst({ where: { email } })) {
            return res.status(400).send('Email already used.');
        }

        if (await prisma.user.findFirst({ where: { username } })) {
            return res.status(400).send('Username already in use.');
        }

        let originalOrg: Organization | undefined;
        if (userType === 'CHARITY_WORKER') {
            originalOrg = organizations.find(org => org.registrationCode === registrationCode);
            if (!originalOrg) {
                return res.status(400).send('Invalid registration code.');
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        try {
            const user = await prisma.user.create({
                data: {
                    username,
                    email,
                    password: hashedPassword,
                    userType,
                    orgName: userType === 'CHARITY_WORKER' ? originalOrg?.name : 'PUBLIC',
                },
            });

            res.status(201).json(user);
        } catch (error) {
            console.log(error);
            res.status(500).send(`Internal server error`);
        }
    }

    static async login(req: Request, res: Response) {
        const { email, password } = req.body;

        try {
            const user = await prisma.user.findUnique({ where: { email } });
            if (!user) {
                return res.status(404).send('User not found.');
            }

            const isValid = await bcrypt.compare(password, user.password);
            if (!isValid) {
                return res.status(401).send('Invalid password.');
            }

            const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET!, { expiresIn: '100y' });

            res.json({ 
                jwt: token,
                user:{
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    userType: user.userType,
                    orgName: user.orgName,
                }
             });
        } catch (error) {
            console.log(error);
            res.status(500).send(`Internal server error`);
        }
    }
}
