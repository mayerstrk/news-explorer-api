import { type Request, type RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { ErrorName } from '../utils/enums/error-names';
import safe from '../utils/helpers/safe';
import { isRequestUser } from '../utils/helpers/is-request-user';
// eslint-disable-next-line unicorn/prevent-abbreviations
import { env } from '../environment-config';

const validateTokenMiddleware: RequestHandler = async (
	request,
	_response,
	next,
) => {
	try {
		const token = await safe({
			value: request.signedCookies?.token as string | undefined,
			errorMessage: 'No token provided',
			errorName: ErrorName.authentication,
		});

		const decoded = await safe({
			value: jwt.verify(token, env.JWT_SECRET),
			errorMessage: 'Invalid token format.',
			errorName: ErrorName.authentication,
			typeguard: isRequestUser,
		});

		(request as Request & { user: { _id: string } }).user = decoded;
		next();
	} catch (error) {
		next(error);
	}
};

export default validateTokenMiddleware;
