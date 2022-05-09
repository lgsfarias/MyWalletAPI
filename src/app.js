import express, { json } from 'express';
import cors from 'cors';

import init from './routes/index.js';

const app = express();
app.use(cors());
app.use(json());
init(app);

export default app;
