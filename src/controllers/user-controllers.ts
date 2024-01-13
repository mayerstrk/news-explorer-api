import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../db';
import safe from '../utils/helpers/safe';
import { type ControllerHelperResponseData } from '../types/utility-types';
import { ErrorName } from '../utils/enums/error-names';
import { env } from '../environment-config';
import { QueryResult, type DatabaseError } from 'pg';
import controllerBuilder from '../builders/controller-builder';
import { AppRequest } from '../types/request';
import { type Response } from 'express';
import assert from '../utils/helpers/assert';

interface User {
	user_id: number;
	email: string;
	username: string;
	password: string;
	created_at: Date;
	updated_at: Date;
}

// === Create User ===

const createUserControllerHelper = async (
	request: AppRequest,
	response: Response,
) => {
	const {
		body: { username, email, password },
	} = request;

	const hashedPassword = await safe({
		value: bcrypt.hash(password, 10),
		errorMessage: 'Error hashing password',
		errorName: ErrorName.internalServerError,
	});
	console.log('				1');

	const {
		rows: [{ user_id: userId }],
	} = await safe<QueryResult<User>>({
		value: pool.query(
			'INSERT INTO protected.users (username, email, password) VALUES ($1, $2, $3) RETURNING user_id',
			[username, email, hashedPassword],
		),
		errorHandler: (error) => {
			if ((error as DatabaseError).code === '23505') {
				return {
					errorName: ErrorName.conflict,
					errorMessage: 'Email already in use',
				};
			}

			return {
				errorName: ErrorName.internalServerError,
				errorMessage: 'Error creating user',
			};
		},
	});

	const token = await safe({
		value: jwt.sign({ _id: userId }, env.JWT_SECRET, {
			expiresIn: '7d',
		}),
		errorMessage: 'Error signing token',
		errorName: ErrorName.internalServerError,
	});

	response.cookie('token', token, {
		httpOnly: true,
		secure: true,
		domain: env.APP_DOMAIN,
		sameSite: 'strict',
		signed: true,
	});

	return {
		request,
		response,
		data: { message: 'User created successfully' },
	};
};

const createUserController = controllerBuilder(createUserControllerHelper);

// === Sign in ===

const signInControllerHelper = async (
	request: AppRequest,
	response: Response,
) => {
	const {
		body: { email, password },
	} = request;

	const {
		rows: [{ user_id: userId, password: hashedPassword }],
	} = await safe<QueryResult<User>>({
		value: pool.query(
			'SELECT user_id, password FROM protected.users WHERE email = ($1)',
			[email],
		),
		errorMessage: 'Invalid email or password',
		errorName: ErrorName.authentication,
	});

	await safe({
		value: bcrypt.compare(password, hashedPassword),
		errorMessage: 'Invalid email or password',
		errorName: ErrorName.authentication,
	});

	const token = await safe({
		value: jwt.sign({ _id: userId }, env.JWT_SECRET),
		errorMessage: 'Error signing token',
		errorName: ErrorName.internalServerError,
	});

	response.cookie('token', token, {
		httpOnly: true,
		secure: true,
		domain: env.APP_DOMAIN,
		sameSite: 'strict',
		signed: true,
	});

	return {
		request,
		response,
		data: { message: 'User signed in successfully' },
	};
};

const signinController = controllerBuilder(signInControllerHelper);

// === Sign out ===

const signoutControllerHelper = async (
	request: AppRequest,
	response: Response,
) => {
	response.clearCookie('token');

	return {
		request,
		response,
		data: { message: 'User signed out successfully' },
	};
};

const signoutController = controllerBuilder(signoutControllerHelper);

// == Get current user ==

const getCurrentUserControllerHelper = async (
	request: AppRequest,
	response: Response,
) => {
	const { _id: userId } = assert(
		request.user,
		'No user field foun in request object',
		ErrorName.internalServerError,
	);

	const {
		rows: [{ username, email }],
	} = await safe<QueryResult<User>>({
		value: pool.query('SELECT username, email FROM users WHERE user_id = $1', [
			userId,
		]),
		errorMessage: 'Error querying user with provided id',
		errorName: ErrorName.internalServerError,
	});

	return {
		request,
		response,
		data: { username, email },
	};
};

const getCurrentUserController = controllerBuilder(
	getCurrentUserControllerHelper,
);

export {
	createUserController,
	signinController,
	signoutController,
	getCurrentUserController,
};

export type UserController =
	| typeof createUserController
	| typeof signinController
	| typeof signoutController
	| typeof getCurrentUserController;

export type UserControllerHelper =
	| typeof createUserControllerHelper
	| typeof signInControllerHelper
	| typeof signoutControllerHelper
	| typeof getCurrentUserControllerHelper;

export type UserQueryrResponse =
	ControllerHelperResponseData<UserControllerHelper>;
