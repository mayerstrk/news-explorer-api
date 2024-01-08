import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { ErrorName } from '../utils/enums/error-names';
import safe from '../utils/helpers/safe';
import pool from '../db';
import { type DatabaseError } from 'pg';
import { env } from '../environment-config';
import { Status } from '../utils/enums/status';

const router = Router();

router.get('/', (request, response) => {
	response.send('Hello World');
});

router.post('/signup', async (request, response, next) => {
	try {
		const {
			body: { email, password },
		} = request;

		const hashedPassword = await safe({
			value: bcrypt.hash(password, 10),
			async: true,
			errorMessage: 'Error hashing password',
			errorName: ErrorName.internalServerError,
		});

		const userId = await safe({
			value: await pool.query(
				'INSERT INTO protected.users (email, password) VALUES ($1, $2) RETURNING user_id',
				[email, hashedPassword],
			),
			async: true,
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
			async: true,
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

		response.status(Status.ok).send({ message: 'User created successully' });
	} catch (error) {
		next(error);
	}
});

export default router;
