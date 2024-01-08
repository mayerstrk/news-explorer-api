import { Pool } from 'pg';
import { env } from './environment-config';

const pool = new Pool({
	connectionString: env.DATABASE_URL,
	ssl: {
		rejectUnauthorized: false,
	},
});

export default pool;
