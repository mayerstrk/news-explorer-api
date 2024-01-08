import express from 'express';
import { env } from './environment-config';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import validateTokenMiddleware from './middleware/validate-token';
import errorHandlerMiddleware from './middleware/error-handler-middleware';
import { errors as celebrateValidator } from 'celebrate';
import { requestLogger, errorLogger } from './middleware/logger-middleware';
import publicRoutes from './routes/public-routes';

const app = express();

// Configure express server and set up middleware
app.use(
	cors({
		origin: [env.APP_URL],
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
		credentials: true,
		optionsSuccessStatus: 204,
	}),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('trust proxy', true);
app.use(cookieParser(env.COOKIE_SECRET));

// request logger
app.use('/', requestLogger);

// route
app.use('/', publicRoutes);

// app.use('/', validateTokenMiddleware);

// app.use('/', protectedRoutes);

// app.use('/', errorLogger);

// app.use('/', celebrateValidator());

app.use('/', errorHandlerMiddleware);

const serverListeningMessage =
	env.NODE_ENV === 'production'
		? `http server is running on internal port ${env.PORT} behind a reverse proxy
		Public URL:${env.DATABASE_URL}`
		: `http server running on port ${env.PORT}. URL: ${env.DATABASE_URL}`;

// start lsitening
app.listen(env.PORT, () => console.log(serverListeningMessage));
