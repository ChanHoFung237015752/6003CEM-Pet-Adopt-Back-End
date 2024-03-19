import {config} from 'dotenv';
import express from 'express';
import authRoutes from './users/users.routes';
import dogRoutes from './dogs/dogs.routes';
import fileUpload from 'express-fileupload';
import cors from 'cors';

config();


const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());
app.use(fileUpload());


app.use('/auth', authRoutes);
app.use('', dogRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
