import { DeleteObjectCommand, GetObjectCommand, ListObjectsV2Command, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Logger } from "../common/utils/logger";
import * as dotenv from "dotenv";

dotenv.config();

export class StorageService {
    private readonly logger = Logger.child({
        label: StorageService.name
    });
    private readonly client: S3Client;
    private readonly bucket: string;


    public constructor() {
        if (!process.env.S3_ACCESS_KEY_ID || !process.env.S3_SECRET_ACCESS_KEY || !process.env.S3_BUCKET) {
            throw new Error('Missing required S3 environment variables');
        }

        this.client = new S3Client({
            endpoint: process.env.S3_ENDPOINT,
            region: process.env.S3_REGION,
            credentials: {
                accessKeyId: process.env.S3_ACCESS_KEY_ID,
                secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
            }
        });
        this.bucket = process.env.S3_BUCKET;
    }

    public async downloadFile(key: string) {
        const command = new GetObjectCommand({
            Bucket: this.bucket,
            Key: key
        });
        const result = await this.client.send(command);
        return result;
    }

    public async getFiles() {
        const command = new ListObjectsV2Command({
            Bucket: this.bucket,
        });
        const result = await this.client.send(command);
        return result;
    }

    public async uploadFile(file: Express.Multer.File) {

        try {
            this.logger.info("Uploading file to S3", { file });

            const command = new PutObjectCommand({
                Bucket: this.bucket,
                Key: file.originalname,
                Body: file.buffer,
                ContentType: file.mimetype
            });
            const result = await this.client.send(command);
            this.logger.info("File uploaded to S3", { result });
            return result;
        } catch (error) {
            // this.logger.error("Failed to upload file to S3", { error });
            console.error(error);
            throw error;
        }
    }

    public async deleteFile(key: string) {
        const command = new DeleteObjectCommand({
            Bucket: this.bucket,
            Key: key
        });
        const result = await this.client.send(command);
        return result;
    }
}