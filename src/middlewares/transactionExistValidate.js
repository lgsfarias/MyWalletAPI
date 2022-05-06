import db from '../config/dbConnect.js';
import { ObjectId } from 'mongodb';

const transactionExistValidate = async (req, res, next) => {
    const { id } = req.params;
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');

    try {
        const session = await db.collection('sessions').findOne({ token });

        const transaction = await db.collection('transactions').findOne({
            _id: new ObjectId(id),
            user: new ObjectId(session.userId),
        });
        if (!transaction) {
            return res.status(400).send('Transaction does not exist');
        }
    } catch (error) {
        return res.status(500).send(error);
    }
    next();
};

export default transactionExistValidate;
