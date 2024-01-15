import getErrorConstructor from './get-error-constructor';
import { type ErrorName } from '../enums/error-names';

function assert<T>(value: T, errorMessage: string, errorName: ErrorName) {
	if (value === null || value === undefined || value === false) {
		throw new (getErrorConstructor(errorName))(errorMessage);
	}

	return value as NonNullable<T>;
}

export default assert;
