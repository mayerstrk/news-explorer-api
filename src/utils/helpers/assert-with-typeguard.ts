import { ErrorName } from '../enums/error-names';
import getErrorConstructor from './get-error-constructor';

function assertWithTypeguard<T, V>(
	value: V,
	typeguard: (value: unknown) => value is T,
	errorMessage: string,
	errorName: ErrorName,
) {
	if (!typeguard(value)) {
		throw new (getErrorConstructor(errorName))(errorMessage);
	}

	return value;
}

export default assertWithTypeguard;
