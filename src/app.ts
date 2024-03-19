import {config} from 'dotenv';
import express from 'express';
import authRoutes from './users/users.routes';

config();


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
