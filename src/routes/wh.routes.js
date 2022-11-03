import { Router } from "express";
//Controller
import { methods as whController } from "../controllers/wh.controller";

const router = Router();

router.get("/",whController.getWHs);
router.get("/stadistics",whController.stadistics);
router.get("/:id",whController.getWH);
router.post("/",whController.createWH);
router.put("/:id",whController.updateWH);
router.delete("/:id",whController.deleteWH);

export default router;