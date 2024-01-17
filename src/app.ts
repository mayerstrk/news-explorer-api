import express from 'express';
import { env as environment } from './environment-config';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import validateTokenMiddleware from './middleware/validate-token';
import errorHandlerMiddleware from './middleware/error-handler-middleware';
import { errors as celebrateValidator } from 'celebrate';
import { requestLogger, errorLogger } from './middleware/logger-middleware';
import publicRoutes from './routes/public-routes';
import protectedRoutes from './routes/protected-routes';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { NotFoundError } from './utils/classes/error-classes';

const app = express();

// rate limiter
app.use(rateLimit());

// use helmet
app.use(helmet());

// Configure express server and set up middleware.
app.use(
	cors({
		origin: [environment.APP_DOMAIN],
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
		credentials: true,
		optionsSuccessStatus: 204,
	}),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('trust proxy', 1);
app.use(cookieParser(environment.COOKIE_SECRET));

// request logger
app.use('/', requestLogger);

// routes
app.use('/', publicRoutes);

app.use('/', validateTokenMiddleware);

app.use('/', protectedRoutes);

app.use('/', (_request, _response, next) => {
	next(new NotFoundError('Not found'));
});

app.use('/', errorLogger);

app.use('/', celebrateValidator());

app.use('/', errorHandlerMiddleware);

const serverListeningMessage =
	environment.NODE_ENV === 'production'
		? `http server is running on internal port ${environment.PORT}
			behind a reverse proxy Public URL:${environment.DATABASE_URL}`
		: `http server running on port ${environment.PORT}.
			URL: http://${environment.APP_DOMAIN}:${environment.PORT}`;

// start lsitening
app.listen(environment.PORT, () => console.log(serverListeningMessage));
