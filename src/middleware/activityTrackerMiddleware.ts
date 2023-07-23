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
            const now = Date.now();
            const lastActiveKey = `user:${userId}:lastActive`;
            client.set(lastActiveKey, now.toString());
        }
    } catch (err) {
        console.log(err)
        return
    }
    // await client.disconnect();
    next();
}

