import process from 'node:process';
import dotenv from 'dotenv';

dotenv.config();

const enum EnvironmentVariables {
	PORT = 'PORT',
	NODE_ENV = 'NODE_ENV',
	APP_DOMAIN = 'APP_DOMAIN',
	APP_URL = 'APP_URL',
	DATABASE_URL = 'DATABASE_URL',
	COOKIE_SECRET = 'COOKIE_SECRET',
	JWT_SECRET = 'JWT_SECRET',
}

const environmentVariables = {
	[EnvironmentVariables.PORT]: process.env.PORT || 3000,
	[EnvironmentVariables.NODE_ENV]: process.env.NODE_ENV || 'development',
	[EnvironmentVariables.APP_DOMAIN]: process.env.APP_DOMAIN || '127.0.0.1',
	[EnvironmentVariables.APP_URL]:
		process.env.APP_URL || 'http://127.0.0.1: 3000',
	[EnvironmentVariables.DATABASE_URL]:
		process.env.DATABASE_URL || 'http://127.0.0.1:3000',
	[EnvironmentVariables.COOKIE_SECRET]:
		process.env.COOKIE_SECRET ||
		'753516098931c6b45a1dd45a6c09bc215835623666f70aadbb658f947582b1c6',
	[EnvironmentVariables.JWT_SECRET]:
		process.env.JWT_SECRET ||
		'753516098931c6b45a1dd45a6c09bc215835623666f70aadbb658f947582b1c6',
};

export { EnvironmentVariables, environmentVariables as env };
