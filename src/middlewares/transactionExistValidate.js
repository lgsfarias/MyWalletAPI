import db from '../config/dbConnect.js';
import { ObjectId } from 'mongodb';

const transactionExistValidate = async (req, res, next) => {
    const { id } = req.params;

    try {
        const transaction = await db.collection('transactions').findOne({
            _id: new ObjectId(id),
            user: new ObjectId(res.locals.session.userId),
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
