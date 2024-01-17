import publicRoutes from './public-routes';
import protectedRoutes from './protected-routes';
import validateToken from '../middleware/validate-token';
import { type Express } from 'express';
import { NotFoundError } from '../utils/classes/error-classes';

export default function (app: Express) {
	app.use('/', publicRoutes);
	app.use('/', validateToken);
	app.use('/', protectedRoutes);
	app.use('/', (_request, _response, next) => {
		next(new NotFoundError('Not found'));
	});
}
