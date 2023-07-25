import { Request, Response, NextFunction } from 'express';
import { createClient } from 'redis';


const client = createClient();
(async () => {
    client.on('error', err => console.log('Redis Client Error', err));
    await client.connect();
})()


export const activityTrackerMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user.id;
        
        if (userId) {
            const lastActiveKey = `user:${userId}:lastActive`;
            const now = Math.floor(Date.now() / 1000);
            client.set(lastActiveKey, now);
        }
    } catch (err) {
        console.log(err)
        return
    }
    next();
}

