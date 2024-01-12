"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const environment_config_1 = require("./environment-config");
const pool = new pg_1.Pool({
    connectionString: environment_config_1.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});
exports.default = pool;
