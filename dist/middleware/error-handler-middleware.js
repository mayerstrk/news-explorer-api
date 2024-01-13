"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const error_classes_1 = require("../utils/classes/error-classes");
// eslint-disable-next-line unicorn/prevent-abbreviations
const environment_config_1 = require("../environment-config");
const errorHandlerMiddleware = (error, _request, response, _next) => {
    var _a;
    console.error(error.stack);
    // Check if the error is an instance of CustomError
    if (error instanceof error_classes_1.CustomError) {
        return response
            .setHeader('Content-Type', 'application/json')
            .status(error.status)
            .send({
            message: error.message,
            name: error.name,
            cause: { message: (_a = error.cause) === null || _a === void 0 ? void 0 : _a.message, error: error.cause },
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
            const badRequestError = new error_classes_1.BadRequestError(error.message || 'Bad request', error);
            return response.status(badRequestError.status).send(badRequestError);
        }
        default: {
            const message = error.message || 'An unexpected server error occurred.';
            const internalServerError = new error_classes_1.InternalServerError(environment_config_1.env.NODE_ENV === 'development'
                ? 'unhandled error - ' + message
                : message);
            return response.status(internalServerError.status).send({
                message: environment_config_1.env.NODE_ENV === 'development'
                    ? 'unhandled error - ' + internalServerError.message
                    : internalServerError.message,
                name: "InternalServerError" /* ErrorName.internalServerError */,
                originalError: error,
            });
        }
    }
};
exports.default = errorHandlerMiddleware;
//# sourceMappingURL=error-handler-middleware.js.map