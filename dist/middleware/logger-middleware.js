"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorLogger = exports.requestLogger = void 0;
const node_path_1 = __importDefault(require("node:path"));
const winston_1 = __importDefault(require("winston"));
const express_winston_1 = __importDefault(require("express-winston"));
// Request logger middleware
exports.requestLogger = express_winston_1.default.logger({
    transports: [
        new winston_1.default.transports.File({
            // eslint-disable-next-line unicorn/prefer-module
            filename: node_path_1.default.join(__dirname, '../../logs/request.log'),
        }),
    ],
    format: winston_1.default.format.combine(winston_1.default.format.json()),
    meta: true,
    msg: 'HTTP {{req.method}} {{req.url}}',
    expressFormat: true,
    colorize: true,
});
// Error logger middleware
exports.errorLogger = express_winston_1.default.errorLogger({
    transports: [
        new winston_1.default.transports.File({
            // eslint-disable-next-line unicorn/prefer-module
            filename: node_path_1.default.join(__dirname, '../../logs/error.log'),
        }),
    ],
    format: winston_1.default.format.combine(winston_1.default.format.json()),
    meta: true,
    msg: 'ERROR: {{err.message}}',
});
//# sourceMappingURL=logger-middleware.js.map