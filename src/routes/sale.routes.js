import { Router } from "express";
//controller 
import { methods as saleController } from "../controllers/sale.controller";

const router = Router();

router.post("/",saleController.createSale)
router.get("/",saleController.getSalesMonth)
router.post("/query",saleController.getSalesQuery)
router.get("/:id/:prod",saleController.getNS)
router.get("/:id",saleController.getDetails)
router.delete("/:id",saleController.deleteSale)

export default router;