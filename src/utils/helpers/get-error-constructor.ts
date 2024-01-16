import { ErrorName } from '../enums/error-names';
import {
	ValidationError,
	NotFoundError,
	CastError,
	DuplicateKeyError,
	AuthenticationError,
	AuthorizationError,
	ForbiddenError,
	InternalServerError,
	ConflictError,
	type AppCustomErrorConstructor,
} from '../classes/error-classes';
import assertUnreachable from './assert-unreachable';

function getErrorConstructor(errorName: ErrorName): AppCustomErrorConstructor {
	switch (errorName) {
		case ErrorName.validation: {
			return ValidationError;
		}

		case ErrorName.notFound: {
			return NotFoundError;
		}

		case ErrorName.cast: {
			return CastError;
		}

		case ErrorName.duplicateKey: {
			return DuplicateKeyError;
		}

		case ErrorName.authentication: {
			return AuthenticationError;
		}

		case ErrorName.authorization: {
			return AuthorizationError;
		}

		case ErrorName.forbidden: {
			return ForbiddenError;
		}

		case ErrorName.conflict: {
			return ConflictError;
		}

		case ErrorName.badRequest:

		case ErrorName.internalServerError: {
			return InternalServerError;
		}

		default: {
			return assertUnreachable(errorName, `Unknown error name provided`);
		}
	}
}

export default getErrorConstructor;
