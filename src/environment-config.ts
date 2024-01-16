import process from 'node:process';
import dotenv from 'dotenv';

dotenv.config();

const enum EnvironmentVariables {
	PORT = 'PORT',
	NODE_ENV = 'NODE_ENV',
	APP_DOMAIN = 'APP_DOMAIN',
	APP_URL = 'APP_URL',
	API_DOMAIN = 'API_DOMAIN',
	API_URL = 'API_URL',
	DATABASE_URL = 'DATABASE_URL',
	COOKIE_SECRET = 'COOKIE_SECRET',
	JWT_SECRET = 'JWT_SECRET',
}

function getEnvironmentVariable(name: EnvironmentVariables, defaultValue: any) {
	const value = process.env[name];
	if (value === undefined) {
		// eslint-disable-next-line no-restricted-syntax
		console.warn(
			`Environment variable ${name} is not set. Using default: ${defaultValue}`,
		);
		return defaultValue;
	}
	return value;
}

const environmentVariables = {
	[EnvironmentVariables.PORT]: getEnvironmentVariable(
		EnvironmentVariables.PORT,
		3000,
	),
	[EnvironmentVariables.NODE_ENV]: getEnvironmentVariable(
		EnvironmentVariables.NODE_ENV,
		'development',
	),
	[EnvironmentVariables.APP_DOMAIN]: getEnvironmentVariable(
		EnvironmentVariables.APP_DOMAIN,
		'127.0.0.1',
	),
	[EnvironmentVariables.APP_URL]: getEnvironmentVariable(
		EnvironmentVariables.APP_URL,
		'http://127.0.0.1:5173',
	),
	[EnvironmentVariables.API_DOMAIN]: getEnvironmentVariable(
		EnvironmentVariables.API_DOMAIN,
		'127.0.0.1',
	),
	[EnvironmentVariables.API_URL]: getEnvironmentVariable(
		EnvironmentVariables.API_URL,
		'http://127.0.0.1:3000',
	),
	[EnvironmentVariables.DATABASE_URL]: getEnvironmentVariable(
		EnvironmentVariables.DATABASE_URL,
		'not set',
	),
	[EnvironmentVariables.COOKIE_SECRET]: getEnvironmentVariable(
		EnvironmentVariables.COOKIE_SECRET,
		'753516098931c6b45a1dd45a6c09bc215835623666f70aadbb658f947582b1c6',
	),
	[EnvironmentVariables.JWT_SECRET]: getEnvironmentVariable(
		EnvironmentVariables.JWT_SECRET,
		'753516098931c6b45a1dd45a6c09bc215835623666f70aadbb658f947582b1c6',
	),
};

export { EnvironmentVariables, environmentVariables as env };
