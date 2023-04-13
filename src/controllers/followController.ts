import { Request, Response } from 'express';
import followModel from '../models/followModel'
import { UserInfoResponse } from '../utils/userTypes'
import { AuthenticatedRequest } from '../utils/requestTypes'

const followController = {
    
  async follow (req: AuthenticatedRequest, res: Response) {
    const followerId = req.user.id;
    const followingId = parseInt(req.params.followingId);
    try {
        const follow = await followModel.follow({ followerId: followerId, followingId: followingId});
        res.status(200).json({ message: "Successfully followed user" });
    } catch (error) {
        res.status(500).json({ message: "Error following user", error });
    }
  },

  async unfollow (req: AuthenticatedRequest, res: Response) {
    const followerId = req.user.id;
    const followingId = parseInt(req.params.followingId);
    try {
        const unfollow = await followModel.unfollow({ followerId: followerId, followingId: followingId});
        res.status(200).json({ message: "Successfully unfollowed user" });
    } catch (error) {
        res.status(500).json({ message: "Error unfollowing user", error });
    }
  },
  
}



export default followController;