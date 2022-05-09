import { transactionSchema } from '../schemas/transactionSchema.js';

const transactionSchemaValidate = (req, res, next) => {
    const { amount, description, type } = req.body;

    const { value, error } = transactionSchema.validate(
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
    res.locals.transaction = value;
    next();
};

export default transactionSchemaValidate;
