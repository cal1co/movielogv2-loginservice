import { Pool, QueryResult } from 'pg';
import dotenv from 'dotenv';
import { User, UserInfoResponse } from '../utils/userTypes';
import { Follow } from '../utils/followTypes'

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

const followModel = {
  follow: async ({ followerId, followingId }: { followerId: number; followingId: number }) => {
    const query = {
      text: 'INSERT INTO followers(follower_id, following_id) VALUES($1, $2) RETURNING follower_id, following_id',
      values: [followerId, followingId]
    };
    const result = await pool.query<Follow>(query);
    return result.rows[0];
  },
  unfollow: async ({ followerId, followingId }: {followerId: number, followingId: number }) => {
    const query = {
      text: 'DELETE FROM followers WHERE follower_id = $1 AND following_id = $2',
      values: [ followerId, followingId ]
    };
    const result = await pool.query<Follow>(query);
    return result.rows[0]
  }
};

export default followModel;
