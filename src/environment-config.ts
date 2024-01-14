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

function getEnvVariable(name: EnvironmentVariables, defaultValue: any) {
	const value = process.env[name];
	if (value === undefined) {
		console.warn(
			`Environment variable ${name} is not set. Using default: ${defaultValue}`,
		);
		return defaultValue;
	}
	return value;
}

const environmentVariables = {
	[EnvironmentVariables.PORT]: getEnvVariable(EnvironmentVariables.PORT, 3000),
	[EnvironmentVariables.NODE_ENV]: getEnvVariable(
		EnvironmentVariables.NODE_ENV,
		'development',
	),
	[EnvironmentVariables.APP_DOMAIN]: getEnvVariable(
		EnvironmentVariables.APP_DOMAIN,
		'127.0.0.1',
	),
	[EnvironmentVariables.APP_URL]: getEnvVariable(
		EnvironmentVariables.APP_URL,
		'http://127.0.0.1:5173',
	),
	[EnvironmentVariables.API_DOMAIN]: getEnvVariable(
		EnvironmentVariables.API_DOMAIN,
		'127.0.0.1:3000',
	),
	[EnvironmentVariables.API_URL]: getEnvVariable(
		EnvironmentVariables.API_URL,
		'http://127.0.0.1:3000',
	),
	[EnvironmentVariables.DATABASE_URL]: getEnvVariable(
		EnvironmentVariables.DATABASE_URL,
		'not set',
	),
	[EnvironmentVariables.COOKIE_SECRET]: getEnvVariable(
		EnvironmentVariables.COOKIE_SECRET,
		'753516098931c6b45a1dd45a6c09bc215835623666f70aadbb658f947582b1c6',
	),
	[EnvironmentVariables.JWT_SECRET]: getEnvVariable(
		EnvironmentVariables.JWT_SECRET,
		'753516098931c6b45a1dd45a6c09bc215835623666f70aadbb658f947582b1c6',
	),
};

export { EnvironmentVariables, environmentVariables as env };
