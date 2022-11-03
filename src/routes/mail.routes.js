import { Router } from "express";
//Controller
import { methods as mailController } from "../controllers/mail.controller";

const router = Router();

router.post("/",mailController.sendMail);

export default router;