/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
import express, { Express } from 'express';
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { indexRouter } from './routes';
import { errorFunction, errorHandling } from './middlewares/errorFunction';
import log from './utils/logger';

dotenv.config();

const mongoUrl = process.env.MONGO_URL as string;
mongoose
  .connect(mongoUrl)
  .then(() => log.info('DB connected'))
  .catch(() => log.info('DB connection failed'));

export const app : Express = express();
app.use(cookieParser());
app.use(express.json());
app.use(morgan('tiny'));

app.use(errorHandling(indexRouter));
app.use(errorFunction);

const port = process.env.PORT;
app.listen(port, () => {
  log.info(`The server is running on port "${port}"`);
});
