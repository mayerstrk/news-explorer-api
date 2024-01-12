"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const environment_config_1 = require("./environment-config");
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const error_handler_middleware_1 = __importDefault(require("./middleware/error-handler-middleware"));
const logger_middleware_1 = require("./middleware/logger-middleware");
const public_routes_1 = __importDefault(require("./routes/public-routes"));
const app = (0, express_1.default)();
// Configure express server and set up middleware
app.use((0, cors_1.default)({
    origin: [environment_config_1.env.APP_URL],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.set('trust proxy', true);
app.use((0, cookie_parser_1.default)(environment_config_1.env.COOKIE_SECRET));
// request logger
app.use('/', logger_middleware_1.requestLogger);
// route
app.use('/', public_routes_1.default);
// app.use('/', validateTokenMiddleware);
// app.use('/', protectedRoutes);
// app.use('/', errorLogger);
// app.use('/', celebrateValidator());
app.use('/', error_handler_middleware_1.default);
const serverListeningMessage = environment_config_1.env.NODE_ENV === 'production'
    ? `http server is running on internal port ${environment_config_1.env.PORT} behind a reverse proxy
		Public URL:${environment_config_1.env.DATABASE_URL}`
    : `http server running on port ${environment_config_1.env.PORT}. URL: ${environment_config_1.env.API_URL}`;
// start lsitening
app.listen(environment_config_1.env.PORT, () => console.log(serverListeningMessage));
