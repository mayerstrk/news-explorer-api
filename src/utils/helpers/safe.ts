import { CastError, ValidationError } from '../classes/error-classes';
import { type ErrorName } from '../enums/error-names';
import getErrorConstructor from './get-error-constructor';

interface NeitherOption {
	test?: never;
	typeguard?: never;
	testErrorMessage?: never;
	testErrorName?: never;
}

type SafeConfig<V, R extends V = V> = {
	value: V | Promise<V>;
} & (
	| {
			errorHandler?: never;
			errorMessage: string;
			errorName: ErrorName;
	  }
	| {
			errorHandler: (error: unknown) => {
				errorName: ErrorName;
				errorMessage: string;
			};
			errorMessage?: never;
			errorName?: never;
	  }
) &
	(
		| {
				typeguard: (value: NonNullable<V>) => value is NonNullable<R>;
				test?: never;
				testErrorMessage?: never;
				testErrorName?: never;
		  }
		| {
				test: (value: NonNullable<V>) => boolean;
				testErrorMessage?: string | undefined;
				testErrorName?: ErrorName | undefined;
				typeguard?: never;
		  }
		| NeitherOption
	);

/**
 * Safely handles and resolves the provided value, which can be either a regular value or a promise.
 * This function aids in validation, type checking, and error handling.
 *
 * @remarks
 * - The { errorHandler } and { errorMessage, errorName } options are mutually exclusive, the same is true for the { test }  and { typeguard } options. Only one of them should be provided at a time.
 *   If both are provided, the behavior is undefined.
 *
 * @template V - The type of the value or promise.
 * @template R - The type the value is expected to be (if using a typeguard). Defaults to V.
 *
 * @param {SafeOptions<V, R>} options - Configuration object for the function.
 * @param {V | Promise<V>} options.value - The value or promise to be resolved and validated.
 * @param {(error: unknown) => { errorName: ErrorName, errorMessage: string}} [options.errorHandler] - An optional error handler function to be used when throwing an error.
 * @param {string} options.errorMessage - The custom error message to be used when throwing an error.
 * @param {ErrorName} options.errorName - The name of the error to be thrown.
 * @param {(value: V) => boolean} [options.test] - An optional test function to validate the value.
 * @param {(value: V) => value is R} [options.typeguard] - An optional type guard function to validate the type of the value.
 *
 * @returns {Promise<NonNullable<R>> | Promise<NonNullable<V>>} - The resolved and validated value.
 * If the value passes the test or typeguard, it is returned.
 * If neither test nor typeguard is provided, the original value is returned as long as it's not null or undefined.
 * If the value is null or undefined, or if it fails the test or typeguard, a custom error is thrown.
 *
 * @throws {CustomError} - Throws a custom error based on the provided errorName if:
 * - The value is null or undefined.
 * - The value fails the test or typeguard.
 *
 *
 * @example
 * const data = await safe({
 *     value: Promise.resolve(42),
 *     errorMessage: 'Value not found',
 *     errorName: ErrorName.notFound,
 *     test: value => value > 40
 * });
 * // data = 42
 */
async function safe<V, R extends V>(
	options: SafeConfig<V, R> & { typeguard: (value: V) => value is R },
): Promise<NonNullable<R>>;

async function safe<V>(configuration: SafeConfig<V>): Promise<NonNullable<V>>;

function safe<V>(configuration: SafeConfig<V>): NonNullable<V>;

async function safe<V, R extends V>(configuration: SafeConfig<V, R>) {
	const {
		value,
		errorMessage,
		errorName,
		errorHandler,
		test,
		testErrorMessage,
		testErrorName,
		typeguard,
	} = configuration;

	let resolvedValue: Awaited<V>;
	try {
		resolvedValue = await value;
	} catch (error) {
		if (errorHandler) {
			const { errorName: _errorName, errorMessage: _errorMessage } =
				errorHandler(error);
			throw new (getErrorConstructor(_errorName))(
				_errorMessage,
				error as Error,
			);
		}
		throw new (getErrorConstructor(errorName))(errorMessage, error as Error);
	}

	if (
		resolvedValue === null ||
		resolvedValue === undefined ||
		resolvedValue === false
	) {
		throw new CastError(`${errorMessage} - Value is null or undefined`);
	}

	if (test) {
		if (test(resolvedValue)) {
			return resolvedValue;
		}

		const _errorMessage = `Validation failed (${
			testErrorMessage ?? 'reason unspecified'
		}) for value: ${JSON.stringify(resolvedValue)}`;

		if (testErrorName) {
			const selectedError = getErrorConstructor(testErrorName);
			throw new selectedError(_errorMessage);
		}

		throw new ValidationError(_errorMessage);
	}

	if (typeguard) {
		if (typeguard(resolvedValue)) {
			return resolvedValue;
		}

		throw new CastError(
			`Type guard failed for value: ${JSON.stringify(resolvedValue)}`,
		);
	}

	return resolvedValue as NonNullable<V>;
}

export default safe;
