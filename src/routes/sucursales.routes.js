import { Router } from "express";
//controller 
import { methods as sucursalesController } from "../controllers/sucursales.controller";

const router = Router();


router.get("/",sucursalesController.getSucursales)
router.get("/:id",sucursalesController.getSucursal)
router.put("/:id",sucursalesController.updateSucursal)
router.delete("/:id",sucursalesController.deleteSucursal)
router.post("/",sucursalesController.createSucursal)

export default router;