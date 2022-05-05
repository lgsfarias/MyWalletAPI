import express from 'express';
import Transactions from '../controllers/transactionsController.js';

const router = express.Router();

router
    .post('/transactions', Transactions.create)
    .get('/transactions', Transactions.getAll)
    .put('/transactions/:id', Transactions.update)
    .delete('/transactions/:id', Transactions.delete);

export default router;
