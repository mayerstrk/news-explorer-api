import { type Request } from 'express';
import { type ParamsDictionary } from 'express-serve-static-core';

interface RequestUser {
	_id: number;
	iat: number;
}

interface AppRequest<
	T extends { body: Record<string, unknown>; params?: ParamsDictionary } = {
		body: Record<string, unknown>;
	},
> extends Request {
	user?: RequestUser;
	body: T['body'];
	params: ParamsDictionary;
}

export type { RequestUser, AppRequest };
