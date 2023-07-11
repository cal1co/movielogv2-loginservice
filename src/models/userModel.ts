import { Pool, QueryResult } from 'pg';
import dotenv from 'dotenv';
import { User, UserInfoResponse, UserData, FollowData } from '../utils/userTypes';

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

  getUserByIdVerbose: async (id: number) => {
    const query = {
      text: 'SELECT username, display_name, profile_image, active_account FROM users where id = $1',
      values: [id]
    }
    const result = await pool.query<QueryResult<{username: string; display_name: string; proflie_image: string; active_account: boolean}>>(query);
    return result.rows[0]
  },

  getUserByUsername: async (username: string):Promise<UserInfoResponse | undefined> => {
    const query = {
      text: 'SELECT id, username FROM users WHERE username = $1',
      values: [username]
    };
    const result = await pool.query<UserInfoResponse>(query);
    return result.rows[0];
  },

  getUserByUsernameVerbose: async (username: string) => {
    const query = {
      text: 'SELECT id, display_name, profile_image, active_account FROM users where username = $1',
      values: [username]
    }
    const result = await pool.query<UserData>(query);
    return result.rows[0]
  },

  getUserFollows: async(id:number) => {
    const query = {
      text: 'SELECT (SELECT COUNT(*) FROM followers WHERE follower_id = $1) AS following_count, (SELECT COUNT(*) FROM followers WHERE following_id = $1) AS follower_count',
      values: [id]
    }
    const result = await pool.query<FollowData>(query);
    return result.rows[0]
  },

  getUserByUsernameOrEmail: async (usernameOrEmail: string):Promise<User | undefined> => {
    const query = {
      text: 'SELECT id, username, email, password FROM users WHERE username = $1 OR email = $1',
      values: [usernameOrEmail]
    };
    const result = await pool.query<User>(query);
    return result.rows[0];
  },

  isFollowing: async(userid: number, targetid:number):Promise<boolean> => {
    const query = {
      text: 'SELECT EXISTS(SELECT 1 FROM followers WHERE follower_id = $1 AND following_id = $2) AS following',
      values: [userid, targetid]
    };
    const result = await pool.query(query);
    return result.rows[0]?.following ?? false;
  }

};

export default userModel;
