import express from 'express';
import Transactions from '../controllers/transactionsController.js';
import transactionSchemaValidate from '../middlewares/transactionSchemaValidate.js';
import authValidate from '../middlewares/authValidate.js';
import transactionExistValidate from '../middlewares/transactionExistValidate.js';

const router = express.Router();

router
    .post(
        '/transactions',
        transactionSchemaValidate,
        authValidate,
        Transactions.create
    )
    .get('/transactions', authValidate, Transactions.getAll)
    .put(
        '/transactions/:id',
        transactionSchemaValidate,
        authValidate,
        transactionExistValidate,
        Transactions.update
    )
    .delete(
        '/transactions/:id',
        authValidate,
        transactionExistValidate,
        Transactions.delete
    );

export default router;
