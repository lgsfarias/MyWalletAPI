import db from '../config/dbConnect.js';
import { userSignUpSchema, userLoginSchema } from '../schemas/userSchema.js';

import { ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';

export default class Auth {
    static signup = async (req, res) => {
        const { name, email, password, confirmPassword } = req.body;
        const { value, error } = userSignUpSchema.validate(
            { name, email, password, confirmPassword },
            { abortEarly: false }
        );
        if (error) {
            return res
                .status(400)
                .send(error.details.map((err) => err.message));
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
    };

    static login = async (req, res) => {
        const { email, password } = req.body;
        const { value, error } = userLoginSchema.validate(
            { email, password },
            { abortEarly: false }
        );
        if (error) {
            return res
                .status(400)
                .send(error.details.map((err) => err.message));
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
    };

    static logout = async (req, res) => {
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
    };
}
