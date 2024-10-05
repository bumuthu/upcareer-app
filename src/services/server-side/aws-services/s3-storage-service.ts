import * as aws from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { FsReadStream } from "openai/_shims/node-types.mjs";

const PROMPT_BUCKET_NAME = `upcareer-${process.env.ENV_NAME}-prompts-${process.env.S3_REGION}`
const IMAGES_BUCKET_NAME = `upcareer-${process.env.ENV_NAME}-images-${process.env.S3_REGION}`


export class S3StorageService {
    private s3: aws.S3;

    constructor() {
        this.s3 = new aws.S3({
            region: process.env.S3_REGION!,
            credentials: {
                accessKeyId: process.env.S3_ACCESS_KEY!,
                secretAccessKey: process.env.S3_SECRET_KEY!,
            }
        })
    }

    async downloadPrompt(promptId: string, path: string): Promise<void> {
        console.log("Downloaded prompt to ", path)
    }

    async getPromptStream(promptId: string): Promise<FsReadStream>  {
        return this.getReadStream(PROMPT_BUCKET_NAME, promptId)
    }

    async getReadStream(bucket: string, key: string): Promise<FsReadStream> {
        try {
            const response = await this.s3.send(
                new aws.GetObjectCommand({
                    Bucket: bucket,
                    Key: key,
                })
            );
            const fileStream = response.Body;
            return fileStream as unknown as FsReadStream;
        } catch (err) {
            console.error('Error fetching file from S3:', err);
            throw err;
        }
    }

    getImageReadUrl(path: string) {
        return this.getReadUrl(IMAGES_BUCKET_NAME, path);
    }

    getReadUrl(bucket: string, path: string) {
        return `https://${bucket}.s3.${process.env.S3_REGION!}.amazonaws.com/${path}`;
    }

    getKeyFromUrl(url: string) {
        const splits = url.split(".amazonaws.com/")
        return splits[splits.length - 1]
    }

    async getSourceDownloadUrl(path: string) {
        return await getSignedUrl(this.s3, new aws.GetObjectCommand({
            Bucket: PROMPT_BUCKET_NAME,
            Key: path
        }));
    }

    async getSourcePutSignedUrl(path: string) {
        return await getSignedUrl(this.s3, new aws.PutObjectCommand({
            Bucket: PROMPT_BUCKET_NAME,
            ContentType: "", // TODO 
            Key: path
        }));
    }

    async uploadKnowledgeImage(id: string, data: string) {
        const base64Data = data.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');
        return await this.uploadImageData({
            Bucket: IMAGES_BUCKET_NAME,
            Key: `knowledges/${id}.TYPE}`,
            Body: buffer,
            ContentType: ""
        })
    }

    async uploadUserImage(id: string, data: string) {
        const base64Data = data.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');
        return await this.uploadImageData({
            Bucket: IMAGES_BUCKET_NAME,
            Key: `users/${id}.TYPE`,
            Body: buffer,
            ContentType: ""
        })
    }

    private async uploadImageData(params: aws.PutObjectCommandInput) {
        await this.s3.putObject(params);
        return this.getImageReadUrl(params.Key!);
    }

    async removeSource(sourceUrl: string) {
        return this.removeObject({
            Bucket: PROMPT_BUCKET_NAME,
            Key: this.getKeyFromUrl(sourceUrl)
        })
    }

    private async removeObject(params: aws.DeleteObjectCommandInput) {
        await this.s3.deleteObject(params)
    }
}