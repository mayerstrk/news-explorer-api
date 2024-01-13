"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_classes_1 = require("../classes/error-classes");
const assert_unreachable_1 = __importDefault(require("./assert-unreachable"));
function getErrorConstructor(errorName) {
    switch (errorName) {
        case "ValidationError" /* ErrorName.validation */: {
            return error_classes_1.ValidationError;
        }
        case "DocumentNotFoundError" /* ErrorName.notFound */: {
            return error_classes_1.NotFoundError;
        }
        case "CastError" /* ErrorName.cast */: {
            return error_classes_1.CastError;
        }
        case "DuplicateKeyError" /* ErrorName.duplicateKey */: {
            return error_classes_1.DuplicateKeyError;
        }
        case "AuthenticationError" /* ErrorName.authentication */: {
            return error_classes_1.AuthenticationError;
        }
        case "AuthorizationError" /* ErrorName.authorization */: {
            return error_classes_1.AuthorizationError;
        }
        case "ForbiddenError" /* ErrorName.forbidden */: {
            return error_classes_1.ForbiddenError;
        }
        case "ConflictError" /* ErrorName.conflict */: {
            return error_classes_1.ConflictError;
        }
        case "BadRequestError" /* ErrorName.badRequest */: {
        }
        case "InternalServerError" /* ErrorName.internalServerError */: {
            return error_classes_1.InternalServerError;
        }
        default: {
            return (0, assert_unreachable_1.default)(errorName, `Unknown error name provided`);
        }
    }
}
exports.default = getErrorConstructor;
//# sourceMappingURL=get-error-constructor.js.map