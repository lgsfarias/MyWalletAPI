import db from './config/dbConnect.js';
import { userSignUpSchema, userLoginSchema } from './models/userSchema.js';
import { transactionSchema } from './models/transactionSchema.js';

import { ObjectId } from 'mongodb';
import express, { json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';

dotenv.config();

const app = express();
app.use(json());
app.use(cors());

app.post('/signup', async (req, res) => {
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
            const session = await db
                .collection('sessions')
                .findOne({ userId: user._id });
            if (session) {
                await db.collection('sessions').deleteMany({
                    userId: new ObjectId(user._id),
                });
            }

            const token = uuid();
            await db.collection('sessions').insertOne({
                userId: user._id,
                token,
            });
            return res.status(200).send({ token, name: user.name });
        } else {
            return res.status(401).send('Invalid email or password');
        }
    } catch (error) {
        return res.status(500).send(error);
    }
});

app.post('/logout', async (req, res) => {
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).send('Unauthorized');
    }

    try {
        await db.collection('sessions').deleteOne({ token });
        return res.status(200).send('Logged out');
    } catch (error) {
        return res.status(500).send(error);
    }
});

async function activeSession(token) {
    const session = await db.collection('sessions').findOne({ token });
    if (!session) {
        return false;
    }
    const user = await db.collection('users').findOne({ _id: session.userId });
    if (!user) {
        return false;
    }
    return session;
}

app.post('/transactions', async (req, res) => {
    const { amount, description, type } = req.body;
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).send('Unauthorized');
    }

    const { value, error } = transactionSchema.validate({
        amount,
        description,
        type,
    });
    if (error) {
        return res.status(400).send(error.details.map((err) => err.message));
    }

    try {
        const session = await activeSession(token);
        if (!session) {
            return res.status(401).send('Unauthorized');
        }

        await db.collection('transactions').insertOne({
            ...value,
            user: new ObjectId(session.userId),
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
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).send('Unauthorized');
    }

    try {
        const session = await activeSession(token);
        if (!session) {
            return res.status(401).send('Unauthorized');
        }

        const transactions = await db
            .collection('transactions')
            .find({ user: new ObjectId(session.userId) })
            .toArray();
        return res.status(200).send(transactions);
    } catch (error) {
        return res.status(500).send(error);
    }
});

app.put('/transactions/:id', async (req, res) => {
    const { id } = req.params;
    const { amount, description, type } = req.body;
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).send('Unauthorized');
    }

    const { value, error } = transactionSchema.validate({
        amount,
        description,
        type,
    });
    if (error) {
        return res.status(400).send(error.details.map((err) => err.message));
    }

    try {
        const session = await activeSession(token);
        if (!session) {
            return res.status(401).send('Unauthorized');
        }

        const transaction = await db.collection('transactions').findOne({
            _id: new ObjectId(id),
            user: new ObjectId(session.userId),
        });
        if (!transaction) {
            return res.status(400).send('Transaction does not exist');
        }

        await db.collection('transactions').updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    ...value,
                },
            }
        );
        return res.status(200).send('Transaction updated');
    } catch (error) {
        return res.status(500).send(error);
    }
});

app.delete('/transactions/:id', async (req, res) => {
    const { id } = req.params;
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).send('Unauthorized');
    }

    try {
        const session = await activeSession(token);
        if (!session) {
            return res.status(401).send('Unauthorized');
        }

        const transaction = await db.collection('transactions').findOne({
            _id: new ObjectId(id),
            user: new ObjectId(session.userId),
        });
        if (!transaction) {
            return res.status(400).send('Transaction does not exist');
        }

        await db
            .collection('transactions')
            .deleteOne({ _id: new ObjectId(id) });
        return res.status(200).send('Transaction deleted');
    } catch (error) {
        return res.status(500).send(error);
    }
});

export default app;
