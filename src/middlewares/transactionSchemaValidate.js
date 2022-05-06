import { transactionSchema } from '../models/transactionSchema.js';

const transactionSchemaValidate = (req, res, next) => {
    const { amount, description, type } = req.body;

    const { error } = transactionSchema.validate(
        {
            amount,
            description,
            type,
        },
        { abortEarly: false }
    );
    if (error) {
        return res.status(400).send(error.details.map((err) => err.message));
    }
    next();
};

export default transactionSchemaValidate;
