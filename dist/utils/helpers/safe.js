"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_classes_1 = require("../classes/error-classes");
const get_error_constructor_1 = __importDefault(require("./get-error-constructor"));
function safe(configuration) {
    return __awaiter(this, void 0, void 0, function* () {
        const { value, async = false, errorMessage, errorName, errorHandler, test, testErrorMessage, testErrorName, typeguard, } = configuration;
        let resolvedValue;
        if (async) {
            try {
                resolvedValue = yield value;
            }
            catch (error) {
                if (errorHandler) {
                    const { errorName, errorMessage } = errorHandler(error);
                    throw new ((0, get_error_constructor_1.default)(errorName))(errorMessage, error);
                }
                throw new ((0, get_error_constructor_1.default)(errorName))(errorMessage, error);
            }
        }
        else {
            resolvedValue = value;
        }
        if (resolvedValue === null || resolvedValue === undefined) {
            throw new error_classes_1.CastError(`${errorMessage} - Value is null or undefined`);
        }
        if (test) {
            if (test(resolvedValue)) {
                return resolvedValue;
            }
            const _errorMessage = `Validation failed (${testErrorMessage !== null && testErrorMessage !== void 0 ? testErrorMessage : 'reason unspecified'}) for value: ${JSON.stringify(resolvedValue)}`;
            if (testErrorName) {
                const SelectedError = (0, get_error_constructor_1.default)(testErrorName);
                throw new SelectedError(_errorMessage);
            }
            throw new error_classes_1.ValidationError(_errorMessage);
        }
        if (typeguard) {
            if (typeguard(resolvedValue)) {
                return resolvedValue;
            }
            throw new error_classes_1.CastError(`Type guard failed for value: ${JSON.stringify(resolvedValue)}`);
        }
        return resolvedValue;
    });
}
exports.default = safe;
