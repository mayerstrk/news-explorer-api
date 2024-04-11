import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../database';
import safe from '../utils/helpers/safe';
import { type ControllerHelperResponseData } from '../types/utility-types';
import { ErrorName } from '../utils/enums/error-names';
import { env as environment } from '../environment-config';
import controllerBuilder from '../builders/controller-builder';
import { AppRequest } from '../types/request';
import { type Response } from 'express';
import assert from '../utils/helpers/assert';
import type {
	CreateUserRequest,
	EmptyRequest,
	SigninRequest,
} from '../types/app-requests';

export interface User {
	user_id: number;
	email: string;
	name: string;
	password: string;
	created_at: Date;
	updated_at: Date;
}
import { type DatabaseError } from 'pg';
import assertWithTypeguard from '../utils/helpers/assert-with-typeguard';
import hasRowsInResult from '../utils/typeguards/has-rows-in-result';

// === Create User ===

const createUserControllerHelper = async (
	request: AppRequest<CreateUserRequest>,
	response: Response,
) => {
	const {
		body: { name, email, password },
	} = request;

	const hashedPassword = await safe(
		bcrypt.hash(password, 10),
		'Error hashing password',
		ErrorName.internalServerError,
	);

	const {
		rows: [{ user_id: userId }],
	} = await safe(
		pool.query<Pick<User, 'user_id'>>(
			'INSERT INTO protected.users (name, email, password) VALUES ($1, $2, $3) RETURNING user_id',
			[name, email, hashedPassword],
		),
		(error) => {
			if ((error as DatabaseError).code === '23505') {
				return ['Email already in use', ErrorName.conflict];
			}

			return ['Error creating user', ErrorName.internalServerError];
		},
	);

	const token = assert(
		jwt.sign({ _id: userId }, environment.JWT_SECRET, {
			expiresIn: '7d',
		}),
		'Error signing token',
		ErrorName.internalServerError,
	);

	response.cookie('token', token, {
		httpOnly: true,
		secure: true,
		domain: environment.API_DOMAIN,
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
	request: AppRequest<SigninRequest>,
	response: Response,
) => {
	const {
		body: { email, password },
	} = request;

	const {
		rows: [{ user_id: userId, password: hashedPassword, name }],
	} = assertWithTypeguard(
		await safe(
			pool.query<Pick<User, 'user_id' | 'password' | 'name'>>(
				'SELECT user_id, password, name FROM protected.users WHERE email = $1',
				[email],
			),
			'Error querying user',
			ErrorName.internalServerError,
		),
		hasRowsInResult,
		'Invalid email or password',
		ErrorName.authentication,
	);

	assert(
		await bcrypt.compare(password, hashedPassword),
		'Invalid email or password',
		ErrorName.authentication,
	);

	const token = assert(
		jwt.sign({ _id: userId }, environment.JWT_SECRET),
		'Error signing token',
		ErrorName.internalServerError,
	);

	console.log('IN SIGN IN', token);

	response.cookie('token', token, {
		httpOnly: true,
		secure: true,
		domain: environment.API_DOMAIN,
		sameSite: 'strict',
		signed: true,
	});

	console.log('IN SIGN IN', JSON.stringify(response.get('Cookie')));

	console.log(name);

	return {
		request,
		response,
		data: { message: 'User signed in successfully', username: name },
	};
};

const signinController = controllerBuilder(signInControllerHelper);

// === Sign out ===

const signoutControllerHelper = async (
	request: AppRequest<EmptyRequest>,
	response: Response,
) => {
	assert(
		response.clearCookie('token'),
		'Error signing out',
		ErrorName.internalServerError,
	);

	return {
		request,
		response,
		data: { message: 'User signed out successfully' },
	};
};

const signoutController = controllerBuilder(signoutControllerHelper);

// == Get current user ==

const getCurrentUserControllerHelper = async (
	request: AppRequest<EmptyRequest>,
	response: Response,
) => {
	const { _id: userId } = assert(
		request.user,
		'No user field found in request object',
		ErrorName.internalServerError,
	);

	const {
		rows: [{ name, email }],
	} = assertWithTypeguard(
		await safe(
			pool.query<Pick<User, 'name' | 'email'>>(
				'SELECT name, email FROM users WHERE user_id = $1',
				[userId],
			),
			'Error querying user',
			ErrorName.internalServerError,
		),
		hasRowsInResult,
		"Could not found user with the current user's id",
		ErrorName.internalServerError,
	);

	return {
		request,
		response,
		data: { name, email },
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

export type UserQueryResponse =
	ControllerHelperResponseData<UserControllerHelper>;
