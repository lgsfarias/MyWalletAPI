// import Auth from './controllers/authController.js';
import Transactions from './controllers/transactionsController.js';
import auth from './routes/authRoutes.js';

import express, { json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(json());
app.use(cors());

// app.post('/signup', Auth.signup);
// app.post('/login', Auth.login);
// app.post('/logout', Auth.logout);

app.use(auth);

app.post('/transactions', Transactions.create);
app.get('/transactions', Transactions.getAll);
app.put('/transactions/:id', Transactions.update);
app.delete('/transactions/:id', Transactions.delete);

export default app;
