import { Router } from "express";
//controller 
import { methods as authController } from "../controllers/auth.controller";

const router = Router();

router.post("/",authController.validateUser)

export default router;