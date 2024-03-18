import {config} from 'dotenv';
import express from 'express';
import authRoutes from './users/users.routes';
import cors from 'cors';

config();


const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
