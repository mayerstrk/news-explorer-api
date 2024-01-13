"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalServerError = exports.BadRequestError = exports.ConflictError = exports.ForbiddenError = exports.AuthorizationError = exports.AuthenticationError = exports.DuplicateKeyError = exports.CastError = exports.NotFoundError = exports.ValidationError = exports.CustomError = void 0;
class CustomError extends Error {
    constructor(message, status, name, cause) {
        super(message);
        this.status = status;
        this.name = name;
        Error.captureStackTrace(this, this.constructor);
        if (cause) {
            this.cause = cause;
        }
    }
}
exports.CustomError = CustomError;
class ValidationError extends CustomError {
    constructor(message, originalError) {
        super(message || 'The input is not valid.', 400 /* Status.badRequest */, "ValidationError" /* ErrorName.validation */, originalError);
    }
}
exports.ValidationError = ValidationError;
class NotFoundError extends CustomError {
    constructor(message, originalError) {
        super(message || 'The requested resource was not found.', 404 /* Status.notFound */, "DocumentNotFoundError" /* ErrorName.notFound */, originalError);
    }
}
exports.NotFoundError = NotFoundError;
class CastError extends CustomError {
    constructor(message, originalError) {
        super(message || 'Type casting error. ', 400 /* Status.badRequest */, "CastError" /* ErrorName.cast */, originalError);
    }
}
exports.CastError = CastError;
class DuplicateKeyError extends CustomError {
    constructor(message, originalError) {
        super(message || 'A resource with that identifier already exists.', 400 /* Status.badRequest */, "DuplicateKeyError" /* ErrorName.duplicateKey */, originalError);
    }
}
exports.DuplicateKeyError = DuplicateKeyError;
class AuthenticationError extends CustomError {
    constructor(message, originalError) {
        super(message || 'Authentication failed.', 401 /* Status.unauthorized */, "AuthenticationError" /* ErrorName.authentication */, originalError);
    }
}
exports.AuthenticationError = AuthenticationError;
class AuthorizationError extends CustomError {
    constructor(message, originalError) {
        super(message || 'This action requires authorizaion.', 401 /* Status.unauthorized */, "AuthorizationError" /* ErrorName.authorization */, originalError);
    }
}
exports.AuthorizationError = AuthorizationError;
class ForbiddenError extends CustomError {
    constructor(message, originalError) {
        super(message ||
            "You don't have the neccesary permissions to perfom this action.", 403 /* Status.forbidden */, "ForbiddenError" /* ErrorName.forbidden */, originalError);
    }
}
exports.ForbiddenError = ForbiddenError;
class ConflictError extends CustomError {
    constructor(message, originalError) {
        super(message || 'A conflict occurred.', 409 /* Status.conflict */, "ConflictError" /* ErrorName.conflict */, originalError);
    }
}
exports.ConflictError = ConflictError;
class BadRequestError extends CustomError {
    constructor(message, originalError) {
        super(message || 'Bad request.', 400 /* Status.badRequest */, "BadRequestError" /* ErrorName.badRequest */, originalError);
    }
}
exports.BadRequestError = BadRequestError;
class InternalServerError extends CustomError {
    constructor(message, originalError) {
        super(message || 'An unexpected server error occurred.', 500 /* Status.internalServerError */, "InternalServerError" /* ErrorName.internalServerError */, originalError);
    }
}
exports.InternalServerError = InternalServerError;
//# sourceMappingURL=error-classes.js.map