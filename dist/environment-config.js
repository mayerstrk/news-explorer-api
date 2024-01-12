"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const node_process_1 = __importDefault(require("node:process"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const environmentVariables = {
    ["PORT" /* EnvironmentVariables.PORT */]: node_process_1.default.env.PORT || 3000,
    ["NODE_ENV" /* EnvironmentVariables.NODE_ENV */]: node_process_1.default.env.NODE_ENV || 'development',
    ["APP_DOMAIN" /* EnvironmentVariables.APP_DOMAIN */]: node_process_1.default.env.APP_DOMAIN || '127.0.0.1',
    ["APP_URL" /* EnvironmentVariables.APP_URL */]: node_process_1.default.env.APP_URL || 'http://127.0.0.1: 3000',
    ["API_URL" /* EnvironmentVariables.API_URL */]: node_process_1.default.env.API_URL || 'http://127.0.0.1:5001',
    ["DATABASE_URL" /* EnvironmentVariables.DATABASE_URL */]: node_process_1.default.env.DATABASE_URL || 'not set',
    ["COOKIE_SECRET" /* EnvironmentVariables.COOKIE_SECRET */]: node_process_1.default.env.COOKIE_SECRET ||
        '753516098931c6b45a1dd45a6c09bc215835623666f70aadbb658f947582b1c6',
    ["JWT_SECRET" /* EnvironmentVariables.JWT_SECRET */]: node_process_1.default.env.JWT_SECRET ||
        '753516098931c6b45a1dd45a6c09bc215835623666f70aadbb658f947582b1c6',
};
exports.env = environmentVariables;
