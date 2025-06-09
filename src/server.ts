import express, { type Application } from "express";
import { Logger } from "./common/utils/logger";
import { storageRouter } from "./routes/storage";

export class Server {
    private readonly logger = Logger.child({
        label: Server.name
    });
    private readonly app: Application

    public constructor() {
        this.app = express();
        this.configure();
    }

    private configure() {
        this.app.use(express.json());
        this.app.use("/storage", storageRouter);
        
    }

    public start() {
        this.app.listen(3000, () => {
            this.logger.info("Server is running on port 3000");
        });
    }
}