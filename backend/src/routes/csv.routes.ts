import { Router } from "express";
import multer from "multer";
import { uploadCSV, getData } from "../controllers/csv.controller";

const router = Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("file"), uploadCSV);
router.get("/data", getData);

export const csvRouter = router;
