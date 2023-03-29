import { Pool, QueryResult } from 'pg';
import dotenv from 'dotenv';
import { User, UserInfoResponse } from '../utils/userTypes';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

const userModel = {
  createUser: async ({ username, email, password }: { username: string; email: string; password: string }):Promise<User | undefined> => {
    const query = {
      text: 'INSERT INTO users(username, email, password) VALUES($1, $2, $3) RETURNING id, username, email',
      values: [username, email, password]
    };
    const result = await pool.query<User>(query);
    return result.rows[0];
  },

  getUserById: async (id: number) => {
    const query = {
      text: 'SELECT id, username, email FROM users WHERE id = $1',
      values: [id]
    };
    const result = await pool.query<QueryResult<{ id: number; username: string; email: string }>>(query);
    return result.rows[0];
  },
  getUserByUsername: async (username: string):Promise<UserInfoResponse | undefined> => {
    const query = {
      text: 'SELECT id, username FROM users WHERE username = $1',
      values: [username]
    };
    const result = await pool.query<UserInfoResponse>(query);
    return result.rows[0];
  },
  getUserByUsernameOrEmail: async (usernameOrEmail: string):Promise<User | undefined> => {
    const query = {
      text: 'SELECT id, username, email, password FROM users WHERE username = $1 OR email = $1',
      values: [usernameOrEmail]
    };
    const result = await pool.query<User>(query);
    return result.rows[0];
  }
};

export default userModel;
