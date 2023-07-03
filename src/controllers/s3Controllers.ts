import { GetObjectCommand, S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { Request, Response } from 'express';
import type {Readable} from 'stream'

const client = new S3Client({
    region: 'ap-southeast-2', 
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || ""
    }
})


const s3Controller = {

    async getImage (req: Request, res: Response) {
        const command = new GetObjectCommand({
            Bucket: "yuzu-profile-images",
            Key: "garfield.jpg"
        });
        
        try {
            const response = await client.send(command);
            const body = response.Body as Readable;
      
            const chunks: Uint8Array[] = [];
            body.on("data", (chunk) => {
              chunks.push(chunk);
            });
      
            body.on("end", () => {
              const imageData = Buffer.concat(chunks);
              const base64 = imageData.toString("base64");
              const imageSrc = `data:image/jpeg;base64,${base64}`;
              res.send(imageSrc);
            });
          } catch (err) {
            console.error(err);
            res.status(500).send("Error retrieving image");
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
    }
}
function encode(data:any) {
    let buf = Buffer.from(data);
    let base64 = buf.toString("base64");
    return base64;
  }

export default s3Controller;