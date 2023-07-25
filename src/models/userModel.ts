import { Pool, QueryResult } from 'pg';
import dotenv from 'dotenv';
import { User, UserInfoResponse, UserData, FollowData } from '../utils/userTypes';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

const userModel = {
  createUser: async ({ username, email, password }: { username: string; email: string; password: string }):Promise<User | undefined> => {
    const client = await pool.connect()
    const query = {
      text: 'INSERT INTO users(username, email, password) VALUES($1, $2, $3) RETURNING id, username, email',
      values: [username, email, password]
    };
    const result = await client.query<User>(query);
    client.release()
    return result.rows[0];
  },

  getUserById: async (id: number) => {
    const client = await pool.connect()
    const query = {
      text: 'SELECT id, username, email FROM users WHERE id = $1',
      values: [id]
    };
    const result = await pool.query<QueryResult<{ id: number; username: string; email: string }>>(query);
    client.release()
    return result.rows[0];
  },

  getUserByIdVerbose: async (id: number) => {
    const client = await pool.connect()
    const query = {
      text: 'SELECT username, display_name, profile_image, active_account, bio FROM users where id = $1',
      values: [id]
    }
    const result = await client.query<UserData>(query);

    client.release()
    return result.rows[0]
  },

  getUserByUsername: async (username: string):Promise<UserInfoResponse | undefined> => {
    const client = await pool.connect()
    const query = {
      text: 'SELECT id, username FROM users WHERE username = $1',
      values: [username]
    };
    const result = await client.query<UserInfoResponse>(query);
    client.release()

    return result.rows[0];
  },

  getUserByUsernameVerbose: async (username: string) => {
    const client = await pool.connect()
    const query = {
      text: 'SELECT id, display_name, profile_image, active_account, bio FROM users where username = $1',
      values: [username]
    }
    const result = await client.query<UserData>(query);
    client.release()

    return result.rows[0]
  },

  getUserFollows: async(id:number) => {
    const client = await pool.connect()
    const query = {
      text: 'SELECT (SELECT COUNT(*) FROM followers WHERE follower_id = $1) AS following_count, (SELECT COUNT(*) FROM followers WHERE following_id = $1) AS follower_count',
      values: [id]
    }
    const result = await client.query<FollowData>(query);
    client.release()

    return result.rows[0]
  },

  getUserByUsernameOrEmail: async (usernameOrEmail: string):Promise<User | undefined> => {
    const client = await pool.connect()
    const query = {
      text: 'SELECT id, username, email, password FROM users WHERE username = $1 OR email = $1',
      values: [usernameOrEmail]
    };
    const result = await client.query<User>(query);
    client.release()

    return result.rows[0];
  },

  isFollowing: async(userid: number, targetid:number):Promise<boolean> => {
    const client = await pool.connect()
    const query = {
      text: 'SELECT EXISTS(SELECT 1 FROM followers WHERE follower_id = $1 AND following_id = $2) AS following',
      values: [userid, targetid]
    };
    const result = await client.query(query);
    client.release()

    return result.rows[0]?.following ?? false;
  },

  updateBio: async(userid: number, content: string):Promise<string> => {
    const client = await pool.connect()
    const query = { 
      text: 'UPDATE users SET bio = $1 WHERE id = $2 RETURNING bio',
      values: [content, userid]
    }
    const result = await client.query(query)
    client.release()

    return result.rows[0]
  },
  updateDisplayName: async(userid: number, displayName: string):Promise<string> => {
    const client = await pool.connect()
    const query = { 
      text: 'UPDATE users SET display_name = $1 WHERE id = $2 RETURNING display_name',
      values: [displayName, userid]
    }
    const result = await client.query(query)
    client.release()

    return result.rows[0]
  },
  updateUsername: async(userid: number, username: string):Promise<string> => {
    const client = await pool.connect()
    const query = { 
      text: 'UPDATE users SET username = $1 WHERE id = $2 RETURNING username',
      values: [username, userid]
    }
    const result = await client.query(query)
    client.release()

    return result.rows[0]
  },
  updatePassword: async(userid: number, password: string):Promise<string> => {
    const client = await pool.connect()
    const query = { 
      text: 'UPDATE users SET password = $1 WHERE id = $2 RETURNING id',
      values: [password, userid]
    }
    const result = await client.query(query)
    client.release()

    return result.rows[0]
  },
  fetchPassword: async(userid:number):Promise<string> => {
    const client = await pool.connect()
    const query = { 
      text: 'SELECT password FROM users WHERE id = $1',
      values: [userid]
    }
    const result = await client.query(query)
    client.release()

    return result.rows[0].password
  },


  updateProfileImage: async(userid: number, profileImage: string):Promise<string> => {
    const client = await pool.connect()
    const query = { 
      text: 'UPDATE users SET profile_image = $1 WHERE id = $2 RETURNING id',
      values: [profileImage, userid]
    }
    const result = await client.query(query)
    client.release()

    return result.rows[0]
  },
};

export default userModel;
