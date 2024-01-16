import { Status } from '../enums/status';
import { ErrorName } from '../enums/error-names';

abstract class CustomError extends Error {
	status: Status;

	name: ErrorName;

	cause?: Error;

	constructor(message: string, status: Status, name: ErrorName, cause?: Error) {
		super(message);
		this.status = status;
		this.name = name;
		Error.captureStackTrace(this, this.constructor);
		if (cause) {
			this.cause = cause;
		}
	}
}

class ValidationError extends CustomError {
	constructor(message: string, originalError?: Error) {
		super(
			message || 'The input is not valid.',
			Status.badRequest,
			ErrorName.validation,
			originalError,
		);
	}
}

class NotFoundError extends CustomError {
	constructor(message: string, originalError?: Error) {
		super(
			message || 'The requested resource was not found.',
			Status.notFound,
			ErrorName.notFound,
			originalError,
		);
	}
}

class CastError extends CustomError {
	constructor(message: string, originalError?: Error) {
		super(
			message || 'Type casting error. ',
			Status.badRequest,
			ErrorName.cast,
			originalError,
		);
	}
}

class DuplicateKeyError extends CustomError {
	constructor(message: string, originalError?: Error) {
		super(
			message || 'A resource with that identifier already exists.',
			Status.badRequest,
			ErrorName.duplicateKey,
			originalError,
		);
	}
}

class AuthenticationError extends CustomError {
	constructor(message: string, originalError?: Error) {
		super(
			message || 'Authentication failed.',
			Status.unauthorized,
			ErrorName.authentication,
			originalError,
		);
	}
}

class AuthorizationError extends CustomError {
	constructor(message: string, originalError?: Error) {
		super(
			message || 'This action requires authorizaion.',
			Status.unauthorized,
			ErrorName.authorization,
			originalError,
		);
	}
}

class ForbiddenError extends CustomError {
	constructor(message: string, originalError?: Error) {
		super(
			message ||
				"You don't have the neccesary permissions to perfom this action.",
			Status.forbidden,
			ErrorName.forbidden,
			originalError,
		);
	}
}

class ConflictError extends CustomError {
	constructor(message: string, originalError?: Error) {
		super(
			message || 'A conflict occurred.',
			Status.conflict,
			ErrorName.conflict,
			originalError,
		);
	}
}

class BadRequestError extends CustomError {
	constructor(message: string, originalError?: Error) {
		super(
			message || 'Bad request.',
			Status.badRequest,
			ErrorName.badRequest,
			originalError,
		);
	}
}

class InternalServerError extends CustomError {
	constructor(message: string, originalError?: Error) {
		super(
			message || 'An unexpected server error occurred.',
			Status.internalServerError,
			ErrorName.internalServerError,
			originalError,
		);
	}
}

type AppCustomErrorConstructor =
	| typeof ValidationError
	| typeof NotFoundError
	| typeof CastError
	| typeof DuplicateKeyError
	| typeof AuthenticationError
	| typeof AuthorizationError
	| typeof ForbiddenError
	| typeof ConflictError
	| typeof BadRequestError
	| typeof InternalServerError;

export type { AppCustomErrorConstructor };

export {
	CustomError,
	ValidationError,
	NotFoundError,
	CastError,
	DuplicateKeyError,
	AuthenticationError,
	AuthorizationError,
	ForbiddenError,
	ConflictError,
	BadRequestError,
	InternalServerError,
};
