import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";

const client = new S3Client({region: 'ap-southeast-2'})

const s3Controller = {

    async getImage () {
        const command = new GetObjectCommand({
            Bucket: "yuzu-profile-images",
            Key: "garfield.jpg"
        });
        
        try {
            const response = await client.send(command);
            // The Body object also has 'transformToByteArray' and 'transformToWebStream' methods.
            if (response.Body === undefined) {
                return
            } 
            const str = await response.Body.transformToString();
            console.log(str);
        } catch (err) {
            console.error(err);
        }
    }
}

export default s3Controller;