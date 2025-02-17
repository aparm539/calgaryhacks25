import * as dotenv from 'dotenv';

dotenv.config();

export default {
	schema: './src/lib/server/db/schema.js',
	driver: 'better-sqlite',
	dbCredentials: {
		url: process.env.SQLITE_DB_PATH || 'src/lib/server/db/data.sqlite'
	},
	out: './src/lib/server/db/migrations'
};