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
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const safe_1 = __importDefault(require("../utils/helpers/safe"));
const db_1 = __importDefault(require("../db"));
const environment_config_1 = require("../environment-config");
const router = (0, express_1.Router)();
router.get('/', (request, response) => {
    response.send('Hello World');
});
router.post('/signup', (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { body: { username, email, password }, } = request;
        const hashedPassword = yield (0, safe_1.default)({
            value: bcrypt_1.default.hash(password, 10),
            async: true,
            errorMessage: 'Error hashing password',
            errorName: "InternalServerError" /* ErrorName.internalServerError */,
        });
        const userId = yield (0, safe_1.default)({
            value: yield db_1.default.query('INSERT INTO protected.users (username, email, password) VALUES ($1, $2, $3) RETURNING user_id', [username, email, hashedPassword]),
            async: true,
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
            async: true,
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
        response.status(200 /* Status.ok */).send({ message: 'User created successully' });
    }
    catch (error) {
        next(error);
    }
}));
exports.default = router;
