import { type Response, type NextFunction } from 'express';
import { type AppRequest } from '../types/request';
import jwt from 'jsonwebtoken';
import { ErrorName } from '../utils/enums/error-names';
import { isRequestUser } from '../utils/typeguards/is-request-user';
import { env } from '../environment-config';
import assertWithTypeguard from '../utils/helpers/assert-with-typeguard';
import { AppRequestVariant } from '../types/app-requests';
import assert from '../utils/helpers/assert';

const validateTokenMiddleware = async <T extends AppRequestVariant>(
	request: AppRequest<T>,
	_response: Response,
	next: NextFunction,
) => {
	console.log('============================');
	console.log('origin', request.originalUrl);
	console.log('cookies:', request.cookies);
	console.log('signedCookies:', request.signedCookies);
	try {
		const token = await assert(
			request.signedCookies?.token,
			'No token provided',
			ErrorName.authentication,
		);

		console.log('IN VALIDATE TOKEN:', token);

		const decoded = assertWithTypeguard(
			jwt.verify(token, env.JWT_SECRET),
			isRequestUser,
			'Invalid token format.',
			ErrorName.authentication,
		);

		console.log('decoded', decoded);
		console.log('=============================');

		request.user = decoded;
		next();
	} catch (error) {
		next(error);
	}
};

export default validateTokenMiddleware;
