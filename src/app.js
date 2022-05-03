import connect from './config/dbConnect.js';
import { userSignUpSchema, userLoginSchema } from './models/userSchema.js';

import express, { json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
dotenv.config();

const app = express();
app.use(json());
app.use(cors());

/* Conection with mongoDB */
let db;
connect().then((res) => (db = res));

app.post('/sing-up', async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;
    const { value, error } = userSignUpSchema.validate(
        { name, email, password, confirmPassword },
        { abortEarly: false }
    );
    if (error) {
        return res.status(400).send(error.details.map((err) => err.message));
    }
    if (password !== confirmPassword) {
        return res.status(400).send('Passwords do not match');
    }
    try {
        const user = await db.collection('users').findOne({ email });
        if (user) {
            return res.status(400).send('User already exists');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await db
            .collection('users')
            .insertOne({ name, email, password: hashedPassword });
        return res.status(200).send('User created');
    } catch (error) {
        return res.status(500).send(error);
    }
});

export default app;
