const enum Status {
	ok = 200,
	badRequest = 400,
	unauthorized = 401,
	forbidden = 403,
	notFound = 404,
	conflict = 409,
	internalServerError = 500,
}

export { Status };
