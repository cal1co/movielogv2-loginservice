import { Request, Response } from 'express';
import userModel from '../models/userModel';
import { UserData } from '../utils/userTypes';
import { Post } from '../utils/postTypes';
import axios, { AxiosResponse } from 'axios';
import { fetchImage } from '../controllers/s3Controllers';

type GetUserResponse = {
    user: UserData
    posts: Post[]
}

const userPageController = { 

    async getUser (req: Request, res: Response)  {
        const username = req.params.id;
        try {
            const user:UserData | undefined = await userModel.getUserByUsernameVerbose(username)
            if (!user) {
                return res.status(401).json({ message: `User with username ${username} not found` });
            }
            if (!user.profile_image) {
                user.profile_image = "profile_default.jpg"
            } 
            user.profile_image = await populateImages(user.profile_image)


            user.follow_data = await userModel.getUserFollows(user.id)

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

async function populateImages(image:string):Promise<string> {
    const imageData:string | undefined = await fetchImage(image);
    if (imageData === undefined) {
        return ''
    }
    return imageData
}

export default userPageController