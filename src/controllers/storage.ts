import { Request, Response } from "express";
import { StorageService } from "../services/storage";

export class StorageController {
    private readonly storageService: StorageService;

    public constructor() {
        this.storageService = new StorageService();
    }

    public async getFiles(req: Request, res: Response) {
        const result = await this.storageService.getFiles();
        res.status(200).json(result);
    }


    public async uploadFile(req: Request, res: Response) {
        try {
            const file = req.file;
            console.log(file);
            if (!file) {
                return res.status(400).json({ error: "No file provided" });
            }

            const result = await this.storageService.uploadFile(file);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: "Failed to upload file" });
        }
    }

    public async downloadFile(req: Request, res: Response) {
        const key = req.params.key;
        const result = await this.storageService.downloadFile(key);

        res.setHeader("Content-Type", result.ContentType ?? "application/octet-stream");
        //@ts-ignore
        res.setHeader("Content-Length", result.ContentLength?.toString() ?? "0");
        res.setHeader("Content-Disposition", `attachment; filename="${key}"`);
        //@ts-ignore
        (result.Body as NodeJS.ReadableStream).pipe(res);
        res.status(200).json(result);
    }

    public async deleteFile(req: Request, res: Response) {
        const key = req.params.key;
        const result = await this.storageService.deleteFile(key);
        res.status(200).json(result);
    }
}