const enum ErrorName {
	validation = 'ValidationError',
	notFound = 'DocumentNotFoundError',
	cast = 'CastError',
	duplicateKey = 'DuplicateKeyError',
	authentication = 'AuthenticationError',
	authorization = 'AuthorizationError',
	internalServerError = 'InternalServerError',
	forbidden = 'ForbiddenError',
	conflict = 'ConflictError',
	badRequest = 'BadRequestError',
}

export { ErrorName };
