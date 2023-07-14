import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../utils/requestTypes';
import axios from 'axios';
import elastic from '../utils/elasticQueries';
import { Post } from '../utils/postTypes'


type PostSearchResult = {
  id:string
}

const searchController = {
  
  async searchUser (req: AuthenticatedRequest, res: Response) {
    const query = req.params.usernameQuery;
    try {
        const response = await elastic.userSearch(query)
        res.status(200).json({ response });
    } catch (error) {
        res.status(500).json({ message: "Error searching user", error });
    }
  },

  async searchPost (req: AuthenticatedRequest, res: Response) {
    const query = req.params.postContentQuery;
    try {
        const response:PostSearchResult[] = await elastic.postSearch(query)
        const postIds:string[] = []
        response.forEach((post) => {
          postIds.push(post.id)
        })
        const posts: Post[] | null = await getPost(req.user.id, postIds, req.headers)
        if (!posts) {
          res.status(500).json({ message: "Error searching post" });
          return
        }
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: "Error searching post", error });
    }
  },
  
}

export async function getPost(uid: number, postList: string[], headersData: any):  Promise<Post[] | null> {
  const headers = {
    'Authorization': `${headersData.authorization}`,
    'Content-Type': 'application/json'
  }

  try {
      const res = await axios.post(`http://localhost:8082/posts/feed/${uid}`, postList, { headers });
      return res.data;
  } catch (error) {
      console.error(error);
      return null
  } 
}


export default searchController;