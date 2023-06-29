import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../utils/requestTypes'

import elastic from '../utils/elasticQueries';

const searchController = {
    
  async searchUser (req: AuthenticatedRequest, res: Response) {
    const query = req.params.usernameQuery;
    try {
        const response = await elastic.userSearch(query)
        res.status(200).json({ response });
    } catch (error) {
        res.status(500).json({ message: "Error following user", error });
    }
  },
  
}



export default searchController;