import { Router } from "express";
import { StorageController } from "../controllers/storage";
import multer from "multer";

const router = Router();
const upload = multer();

const storageController = new StorageController();

router.get("/", async (req, res) => {
    await storageController.getFiles(req, res);
});


router.post("/upload", upload.single("file"), async (req, res) => {
    await storageController.uploadFile(req, res);
});

router.delete("/:key", async (req, res) => {
    await storageController.deleteFile(req, res);
});

router.get("/:key", async (req, res) => {
    await storageController.downloadFile(req, res);
});


export { router as storageRouter };