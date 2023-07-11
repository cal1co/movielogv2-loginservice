import { Request, Response } from 'express';
import userModel from '../models/userModel';
import { UserVerbose } from '../utils/userTypes';
import { Post } from '../utils/postTypes'
import axios, { AxiosResponse } from 'axios';

type GetUserResponse = {
    user: UserVerbose
    posts: Post[]
}

const userPageController = { 

    async getUser (req: Request, res: Response)  {
        const username = req.params.id;
        try {
            const user:UserVerbose | undefined = await userModel.getUserByUsernameVerbose(username)
            if (!user) {
                return res.status(401).json({ message: `User with username ${username} not found` });
            }

            const posts: Post[] | null = await getPost(user.id)

            if (!posts) {
                return res.status(401).json({ message: `Could not fetch posts from ${username}`})
            }

            const userData: GetUserResponse = { user, posts }
      
            res.json(userData)
          } 
          catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
          }
    },

}

async function getPost(uid: number):  Promise<Post[] | null> {
    try {
        const res: AxiosResponse<Post[]> = await axios.get<Post[]>(`http://localhost:8082/posts/user/${uid}`);
        return res.data;
    } catch (error) {
        console.error(error);
        return null
    } 
}

export default userPageController