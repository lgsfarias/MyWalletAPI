import db from '../config/dbConnect.js';
import { ObjectId } from 'mongodb';

export default class Transactions {
    static create = async (req, res) => {
        // const { amount, description, type } = req.body;
        const { authorization } = req.headers;
        const token = authorization?.replace('Bearer ', '');

        try {
            const session = await db.collection('sessions').findOne({ token });

            await db.collection('transactions').insertOne({
                ...res.locals.value,
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
    };

    static getAll = async (req, res) => {
        const { authorization } = req.headers;
        const token = authorization?.replace('Bearer ', '');

        try {
            const session = await db.collection('sessions').findOne({ token });

            const transactions = await db
                .collection('transactions')
                .find({ user: new ObjectId(session.userId) })
                .toArray();
            return res.status(200).send(transactions);
        } catch (error) {
            return res.status(500).send(error);
        }
    };

    static update = async (req, res) => {
        const { id } = req.params;
        // const { amount, description, type } = req.body;

        try {
            await db.collection('transactions').updateOne(
                { _id: new ObjectId(id) },
                {
                    $set: {
                        ...res.locals.value,
                    },
                }
            );
            return res.status(200).send('Transaction updated');
        } catch (error) {
            return res.status(500).send(error);
        }
    };

    static delete = async (req, res) => {
        const { id } = req.params;

        try {
            await db
                .collection('transactions')
                .deleteOne({ _id: new ObjectId(id) });
            return res.status(200).send('Transaction deleted');
        } catch (error) {
            return res.status(500).send(error);
        }
    };
}
