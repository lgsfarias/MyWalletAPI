import express, { json } from 'express';
import cors from 'cors';

import init from './routes/index.js';

const app = express();
app.use(json());
app.use(cors());
init(app);

export default app;
