import { Router } from "express";
//controller 
import { methods as categoriaController } from "../controllers/categoria.controller";

const router = Router();


router.get("/",categoriaController.getCategorias)
router.get("/:id",categoriaController.getCategoria)
router.put("/:id",categoriaController.updateCategoria)
router.delete("/:id",categoriaController.deleteCategoria)
router.post("/",categoriaController.createCategoria)

export default router;