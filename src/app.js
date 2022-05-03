import connect from './config/dbConnect.js';

import express, { json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(json());
app.use(cors());

/* Conection with mongoDB */
let db;
connect().then((res) => (db = res));

export default app;
