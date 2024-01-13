import { type Response, type NextFunction } from 'express';
import { type AppRequest } from '../types/request';
import jwt from 'jsonwebtoken';
import { ErrorName } from '../utils/enums/error-names';
import safe from '../utils/helpers/safe';
import { isRequestUser } from '../utils/helpers/is-request-user';
// eslint-disable-next-line unicorn/prevent-abbreviations
import { env } from '../environment-config';
import assertWithTypeguard from '../utils/helpers/assert-with-typeguard';

const validateTokenMiddleware = async (
	request: AppRequest,
	_response: Response,
	next: NextFunction,
) => {
	try {
		const token = await safe({
			value: request.signedCookies?.token as string | undefined,
			errorMessage: 'No token provided',
			errorName: ErrorName.authentication,
		});

		const decoded = assertWithTypeguard(
			jwt.verify(token, env.JWT_SECRET),
			isRequestUser,
			'Invalid token format.',
			ErrorName.authentication,
		);

		request.user = decoded;
		next();
	} catch (error) {
		next(error);
	}
};

export default validateTokenMiddleware;
