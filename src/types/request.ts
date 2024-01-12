import { Request } from 'express';

interface RequestUser {
	_id: number;
}

interface AppRequest extends Request {
	user?: RequestUser;
}

export type { RequestUser, AppRequest };
