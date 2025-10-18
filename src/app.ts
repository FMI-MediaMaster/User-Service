import cors from 'cors';
import helmet from 'helmet';
import routes from '@routes';
import express, { Express } from 'express';
import config from '@andrei137/load-dotenv';
import {
    unknownEndpoint,
    responseExtensions,
    errorHandler,
    requestLogger
} from '@andrei137/express-middleware';

const app: Express = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger(config));
app.use(responseExtensions);
app.use('/api', routes);
app.use(unknownEndpoint);
app.use(errorHandler);

export default app;

