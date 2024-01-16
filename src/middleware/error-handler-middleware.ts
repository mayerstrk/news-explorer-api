import { type Request, type Response } from 'express';
import {
	BadRequestError,
	CustomError,
	InternalServerError,
} from '../utils/classes/error-classes';
import { ErrorName } from '../utils/enums/error-names';
import { type NextFunction } from 'express-serve-static-core';
// eslint-disable-next-line unicorn/prevent-abbreviations
import { env } from '../environment-config';

const errorHandlerMiddleware = (
	error: Error,
	_request: Request,
	response: Response,
	_next: NextFunction,
) => {
	// eslint-disable-next-line no-restricted-syntax
	console.error(error.stack);
	// Check if the error is an instance of CustomError
	if (error instanceof CustomError) {
		return response
			.setHeader('Content-Type', 'application/json')
			.status(error.status)
			.send({
				message: error.message,
				name: error.name,
				cause: { message: error.cause?.message, error: error.cause },
			});
	}

	// If it's not one of the known errors, it's either a bad request or an
	// internal server error.
	// An internal server error should be caught by the safe funcion's
	// getErrorConstructor helper but this is a fallback in case an error is
	// thrown outside of the safe function(which shouldn't happen) or it
	// doesn't catch it for some reason.

	const status = 'status' in error ? error.status : 500;
	switch (status) {
		case 400: {
			const badRequestError = new BadRequestError(
				error.message || 'Bad request',
				error,
			);
			return response.status(badRequestError.status).send(badRequestError);
		}

		default: {
			const message = error.message || 'An unexpected server error occurred.';
			const internalServerError = new InternalServerError(
				env.NODE_ENV === 'development'
					? 'unhandled error - ' + message
					: message,
			);

			return response.status(internalServerError.status).send({
				message:
					env.NODE_ENV === 'development'
						? 'unhandled error - ' + internalServerError.message
						: internalServerError.message,
				name: ErrorName.internalServerError,
				originalError: error,
			});
		}
	}
};

export default errorHandlerMiddleware;
