import { type Request } from 'express';
import { AppRequestVariant } from './app-requests';

interface RequestUser {
	_id: number;
	iat: number;
}

interface AppRequest<T extends AppRequestVariant> extends Request {
	user?: RequestUser;
	body: T['body'];
	params: T['params'];
}

export type { RequestUser, AppRequest };
