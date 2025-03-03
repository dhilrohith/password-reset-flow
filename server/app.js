import express from 'express';

import bodyParser from 'body-parser';

import cors from 'cors';

import authRouter from './routes/auth.js';

import passwordRouter from './routes/password.js';

import { errorHandler } from 
'./middlewares/errorMiddleware.js';


const app = express()

app.use(cors());

app.use(bodyParser.json());

app.use(`/api/v1/password`, passwordRouter);

app.use(`/api/v1/auth`, authRouter);

app.use(errorHandler);

export default app