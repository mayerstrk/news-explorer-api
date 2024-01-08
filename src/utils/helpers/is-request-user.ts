import { type RequestUser } from '../../types/request';

function isRequestUser(value: unknown): value is RequestUser {
	if (typeof value !== 'object' || value === null) return false;

	const keys = Object.keys(value);
	return (
		keys.length === 3 &&
		keys[0] === '_id' &&
		typeof (value as any)._id === 'string'
	);
}

export { isRequestUser };
