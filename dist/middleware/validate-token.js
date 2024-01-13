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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const safe_1 = __importDefault(require("../utils/helpers/safe"));
const is_request_user_1 = require("../utils/helpers/is-request-user");
// eslint-disable-next-line unicorn/prevent-abbreviations
const environment_config_1 = require("../environment-config");
const validateTokenMiddleware = (request, _response, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = yield (0, safe_1.default)({
            value: (_a = request.signedCookies) === null || _a === void 0 ? void 0 : _a.token,
            errorMessage: 'No token provided',
            errorName: "AuthenticationError" /* ErrorName.authentication */,
        });
        const decoded = yield (0, safe_1.default)({
            value: jsonwebtoken_1.default.verify(token, environment_config_1.env.JWT_SECRET),
            errorMessage: 'Invalid token format.',
            errorName: "AuthenticationError" /* ErrorName.authentication */,
            typeguard: is_request_user_1.isRequestUser,
        });
        request.user = decoded;
        next();
    }
    catch (error) {
        next(error);
    }
});
exports.default = validateTokenMiddleware;
//# sourceMappingURL=validate-token.js.map