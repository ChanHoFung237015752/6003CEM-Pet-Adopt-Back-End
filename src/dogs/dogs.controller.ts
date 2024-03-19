import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import * as path from 'path';
import * as Yup from 'yup';

const prisma = new PrismaClient();

const dogSchema = Yup.object().shape({
    name: Yup.string().required(),
    age: Yup.number().required().positive().integer(),
    gender: Yup.string().required(),
    breed: Yup.string().required(),
    color: Yup.string().required(),
    size: Yup.string().required(),
    isNeutered: Yup.boolean().required(),
    isVaccinated: Yup.boolean().required(),
    personality: Yup.string().required(),
});

class DogController {

    async uploadImage(req: Request, res: Response) {
        try {
            const request: any = req;
            if (!request.files || Object.keys(request.files).length === 0) {
                return res.status(400).json({ error: 'No files were uploaded.' });
            }

            const images = request.files.images;
            const fileUrls: string[] = [];

            for (let i = 0; i < images.length; i++) {
                const image = images[i];
                const fileName = `${Date.now()}-${image.name}`;

                await image.mv(path.join(__dirname, `../../public/${fileName}`));

                const fileUrl = `/${fileName}`;
                fileUrls.push(fileUrl);
            }

            res.json({ fileUrls });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }



    async add(req: Request, res: Response) {
        try {
            const validatedData = await dogSchema.validate(req.body, { abortEarly: false });
            const request: any = req;
            const user = request.user;

            const dog = await prisma.dog.create({
                data: {
                    ...validatedData,
                    ownerId: user.id,
                },
            });

            res.json(dog);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async update(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const validatedData = await dogSchema.validate(req.body, { abortEarly: false });

            const updatedDog = await prisma.dog.update({
                where: { id: Number(id) },
                data: validatedData,
            });

            res.json(updatedDog);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async remove(req: Request, res: Response) {
        const { id } = req.params;
        try {
            await prisma.dog.delete({
                where: { id: Number(id) },
            });

            res.json({ message: 'Dog removed successfully' });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}

export const dogController = new DogController();
