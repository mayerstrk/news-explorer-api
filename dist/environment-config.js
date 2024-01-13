"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const node_process_1 = __importDefault(require("node:process"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function getEnvVariable(name, defaultValue) {
    const value = node_process_1.default.env[name];
    if (value === undefined) {
        console.warn(`Environment variable ${name} is not set. Using default: ${defaultValue}`);
        return defaultValue;
    }
    return value;
}
const environmentVariables = {
    ["PORT" /* EnvironmentVariables.PORT */]: getEnvVariable("PORT" /* EnvironmentVariables.PORT */, 3000),
    ["NODE_ENV" /* EnvironmentVariables.NODE_ENV */]: getEnvVariable("NODE_ENV" /* EnvironmentVariables.NODE_ENV */, 'development'),
    ["APP_DOMAIN" /* EnvironmentVariables.APP_DOMAIN */]: getEnvVariable("APP_DOMAIN" /* EnvironmentVariables.APP_DOMAIN */, '127.0.0.1'),
    ["APP_URL" /* EnvironmentVariables.APP_URL */]: getEnvVariable("APP_URL" /* EnvironmentVariables.APP_URL */, 'http://127.0.0.1:3000'),
    ["API_URL" /* EnvironmentVariables.API_URL */]: getEnvVariable("API_URL" /* EnvironmentVariables.API_URL */, 'http://127.0.0.1:5001'),
    ["DATABASE_URL" /* EnvironmentVariables.DATABASE_URL */]: getEnvVariable("DATABASE_URL" /* EnvironmentVariables.DATABASE_URL */, 'not set'),
    ["COOKIE_SECRET" /* EnvironmentVariables.COOKIE_SECRET */]: getEnvVariable("COOKIE_SECRET" /* EnvironmentVariables.COOKIE_SECRET */, '753516098931c6b45a1dd45a6c09bc215835623666f70aadbb658f947582b1c6'),
    ["JWT_SECRET" /* EnvironmentVariables.JWT_SECRET */]: getEnvVariable("JWT_SECRET" /* EnvironmentVariables.JWT_SECRET */, '753516098931c6b45a1dd45a6c09bc215835623666f70aadbb658f947582b1c6'),
};
exports.env = environmentVariables;
//# sourceMappingURL=environment-config.js.map