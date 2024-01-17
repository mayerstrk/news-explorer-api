import { QueryResultRow, type QueryResult } from 'pg';

const hasRowsInResult = <T extends QueryResultRow>(
	value: unknown,
): value is QueryResult<T> & { rowCount: number } => {
	const result = value as QueryResult<T>;
	return result.rowCount !== null && result.rowCount > 0;
};

export default hasRowsInResult;
