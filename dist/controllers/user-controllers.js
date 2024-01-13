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
exports.getCurrentUserController = exports.signoutController = exports.signinController = exports.createUserController = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("../db"));
const safe_1 = __importDefault(require("../utils/helpers/safe"));
const environment_config_1 = require("../environment-config");
const controller_builder_1 = __importDefault(require("../builders/controller-builder"));
const assert_1 = __importDefault(require("../utils/helpers/assert"));
// === Create User ===
const createUserControllerHelper = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { body: { username, email, password }, } = request;
    const hashedPassword = yield (0, safe_1.default)({
        value: bcrypt_1.default.hash(password, 10),
        errorMessage: 'Error hashing password',
        errorName: "InternalServerError" /* ErrorName.internalServerError */,
    });
    console.log('				1');
    const { rows: [{ user_id: userId }], } = yield (0, safe_1.default)({
        value: db_1.default.query('INSERT INTO protected.users (username, email, password) VALUES ($1, $2, $3) RETURNING user_id', [username, email, hashedPassword]),
        errorHandler: (error) => {
            if (error.code === '23505') {
                return {
                    errorName: "ConflictError" /* ErrorName.conflict */,
                    errorMessage: 'Email already in use',
                };
            }
            return {
                errorName: "InternalServerError" /* ErrorName.internalServerError */,
                errorMessage: 'Error creating user',
            };
        },
    });
    const token = yield (0, safe_1.default)({
        value: jsonwebtoken_1.default.sign({ _id: userId }, environment_config_1.env.JWT_SECRET, {
            expiresIn: '7d',
        }),
        errorMessage: 'Error signing token',
        errorName: "InternalServerError" /* ErrorName.internalServerError */,
    });
    response.cookie('token', token, {
        httpOnly: true,
        secure: true,
        domain: environment_config_1.env.APP_DOMAIN,
        sameSite: 'strict',
        signed: true,
    });
    return {
        request,
        response,
        data: { message: 'User created successfully' },
    };
});
const createUserController = (0, controller_builder_1.default)(createUserControllerHelper);
exports.createUserController = createUserController;
// === Sign in ===
const signInControllerHelper = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { body: { email, password }, } = request;
    const { rows: [{ user_id: userId, password: hashedPassword }], } = yield (0, safe_1.default)({
        value: db_1.default.query('SELECT user_id, password FROM protected.users WHERE email = ($1)', [email]),
        errorMessage: 'Invalid email or password',
        errorName: "AuthenticationError" /* ErrorName.authentication */,
    });
    yield (0, safe_1.default)({
        value: bcrypt_1.default.compare(password, hashedPassword),
        errorMessage: 'Invalid email or password',
        errorName: "AuthenticationError" /* ErrorName.authentication */,
    });
    const token = yield (0, safe_1.default)({
        value: jsonwebtoken_1.default.sign({ _id: userId }, environment_config_1.env.JWT_SECRET),
        errorMessage: 'Error signing token',
        errorName: "InternalServerError" /* ErrorName.internalServerError */,
    });
    response.cookie('token', token, {
        httpOnly: true,
        secure: true,
        domain: environment_config_1.env.APP_DOMAIN,
        sameSite: 'strict',
        signed: true,
    });
    return {
        request,
        response,
        data: { message: 'User signed in successfully' },
    };
});
const signinController = (0, controller_builder_1.default)(signInControllerHelper);
exports.signinController = signinController;
// === Sign out ===
const signoutControllerHelper = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    response.clearCookie('token');
    return {
        request,
        response,
        data: { message: 'User signed out successfully' },
    };
});
const signoutController = (0, controller_builder_1.default)(signoutControllerHelper);
exports.signoutController = signoutController;
// == Get current user ==
const getCurrentUserControllerHelper = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id: userId } = (0, assert_1.default)(request.user, 'No user field foun in request object', "InternalServerError" /* ErrorName.internalServerError */);
    const { rows: [{ username, email }], } = yield (0, safe_1.default)({
        value: db_1.default.query('SELECT username, email FROM users WHERE user_id = $1', [
            userId,
        ]),
        errorMessage: 'Error querying user with provided id',
        errorName: "InternalServerError" /* ErrorName.internalServerError */,
    });
    return {
        request,
        response,
        data: { username, email },
    };
});
const getCurrentUserController = (0, controller_builder_1.default)(getCurrentUserControllerHelper);
exports.getCurrentUserController = getCurrentUserController;
//# sourceMappingURL=user-controllers.js.map