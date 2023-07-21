import { GetObjectCommand, S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { Request, Response } from 'express';
import type { Readable } from 'stream';
import userModel from '../models/userModel';
import { UserData } from '../utils/userTypes'
import { populateImages } from '../controllers/userPageController'

const client = new S3Client({
    region: 'ap-southeast-2', 
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || ""
    }
})
type User = {
    id: number,
    username: string
}

const s3Controller = {

    async getImage (req: Request, res: Response) {
        const image:string | undefined = await fetchImage(req.params.image)
        if (!image) {
            res.status(500).json("Couldn't fetch the requested image")
            return
        }
        res.send(image)
    },
    async getImagesById (req: Request, res: Response) {
        const users: User[] = req.body.users
        try {
            const userImages:UserData[] = []
            for (const user of users) {
                const userData: UserData = await userModel.getUserByIdVerbose(user.id);
                if (!user) {
                    // return res.status(401).json({ message: `User with username ${username} not found` });
                }
                if (!userData.profile_image) {
                    userData.profile_image = "profile_default.jpg"
                } 

                userData.profile_image = await populateImages(userData.profile_image)

                userImages.push(userData);

            }

            res.json(userImages)
        } catch {
            res.status(500).json("Couldn't fetch images for users")
        }
    },

    async uploadImage(req:Request, res: Response) {
        if (!req.file) {
            return
        }
        const command = new PutObjectCommand({
            Bucket: "yuzu-profile-images",
            Key: req.file.originalname,
            Body: req.file.buffer
        });
        try {
            const uploadImage = await client.send(command)
            
          } catch (err) {
            console.error(err);
            res.status(500).send("Error sending image");
          }
    },

    async uploadVideo(req:Request, res: Response) {
        if (!req.file) {
            res.status(500).send("Error: No video file provided");
            return
        }
        const command = new PutObjectCommand({
            Bucket: "yuzu-post-media",
            Key: req.file.originalname,
            Body: req.file.buffer
        });
        try {
            const uploadImage = await client.send(command)
            
          } catch (err) {
            console.error(err);
            res.status(500).send("Error sending image");
          }
    },

    async handleMultiple (req: Request, res: Response) {
        const posts = req.body.fetchReq
        const tempCachedImages:{[key: number]: string} = {}
        for (let i = 0; i < posts.length; i++ ) {
            if (tempCachedImages[posts[i].user_id]) {
                posts[i].profile_image = tempCachedImages[posts[i].user_id]
            } else {
                const image_data:string | undefined = await fetchImage(posts[i].profile_image_data)
                if (image_data === undefined) {
                    return 
                } 
                posts[i].profile_image_data = image_data
                tempCachedImages[posts[i].user_id] = image_data
            }
        }
        res.json(tempCachedImages)
    },

    async updateProfileImage (req: Request, res: Response) {
        if (!req.file) {
            return
        }
        const fileName:string = req.user.id + "-" + req.file.originalname 
        const command = new PutObjectCommand({
            Bucket: "yuzu-profile-images",
            Key: fileName,
            Body: req.file.buffer
        });
        try {
            const uploadImage = await client.send(command)
          } catch (err) {
            console.error(err);
            res.status(500).send("Error sending image");
          }

        try {
            const success = await userModel.updateProfileImage(req.user.id, fileName)
            if (!success) {
                return res.status(500).json({ message: 'Internal server error' });
            }
            res.json(success)
        } catch (error) {
            console.error(error)
            res.status(500).json({message: 'Internal server error'})
        }
    }


}

export const fetchImage = async (key: string): Promise<string | undefined> => {
    const command: GetObjectCommand = createGetObjectCommand(key);
    const response = await client.send(command);
    const stream = response.Body as Readable;
    return new Promise<string>((resolve, reject) => {
      const chunks: Buffer[] = [];
      stream.on('data', chunk => chunks.push(chunk));
      stream.once('end', () => {
        const imageData = Buffer.concat(chunks);
        const base64 = imageData.toString('base64');
        resolve("data:image/jpeg;base64," + base64);
      });
      stream.once('error', reject);
    });
};
  
const createGetObjectCommand = (key:string):GetObjectCommand => {
    return new GetObjectCommand({
        Bucket: "yuzu-profile-images",
        Key: key
    });
}

export default s3Controller;