import { Pool } from 'pg';
import { env as environment } from './environment-config';

const pool = new Pool({
	connectionString: environment.DATABASE_URL,
	ssl: {
		rejectUnauthorized: false,
	},
});

export default pool;
