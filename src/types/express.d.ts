import { type RequestUser } from './request';

declare module 'express' {
	export interface Request {
		user?: RequestUser;
	}
}
