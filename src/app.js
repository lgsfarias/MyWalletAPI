import connect from './config/dbConnect.js';
import { userSignUpSchema, userLoginSchema } from './models/userSchema.js';
import { transactionSchema } from './models/transactionSchema.js';

import { ObjectId } from 'mongodb';
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

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const { value, error } = userLoginSchema.validate({ email, password });
    if (error) {
        return res.status(400).send(error.details.map((err) => err.message));
    }
    try {
        const user = await db.collection('users').findOne({ email });
        if (user && bcrypt.compareSync(password, user.password)) {
            return res.sendStatus(200);
        } else {
            return res.status(401).send('Invalid email or password');
        }
    } catch (error) {
        return res.status(500).send(error);
    }
});

app.post('/transactions', async (req, res) => {
    const { amount, description, type } = req.body;
    const { userid } = req.headers;

    const { value, error } = transactionSchema.validate({
        amount,
        description,
        type,
    });
    if (error) {
        return res.status(400).send(error.details.map((err) => err.message));
    }
    try {
        const user = await db
            .collection('users')
            .findOne({ _id: new ObjectId(userid) });
        if (!user) {
            return res.status(400).send('User does not exist');
        }
        await db.collection('transactions').insertOne({
            amount,
            description,
            type,
            user: new ObjectId(userid),
            date: new Date().toLocaleDateString('pt-br', {
                month: '2-digit',
                day: '2-digit',
            }),
        });
        return res.status(200).send('Transaction created');
    } catch (error) {
        return res.status(500).send(error);
    }
});

app.get('/transactions', async (req, res) => {
    const { userid } = req.headers;
    try {
        const transactions = await db
            .collection('transactions')
            .find({ user: new ObjectId(userid) })
            .toArray();
        return res.status(200).send(transactions);
    } catch (error) {
        return res.status(500).send(error);
    }
});

export default app;
