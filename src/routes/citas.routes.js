import { Router } from "express";
//Controller
import { methods as citasController } from "../controllers/citas.controller";

const router = Router();

router.get("/",citasController.getCitas);
router.post("/",citasController.addCitas);
router.delete("/:id",citasController.deleteCita);

export default router;