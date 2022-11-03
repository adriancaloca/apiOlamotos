import { Router } from "express";
//controller 
import { methods as saleController } from "../controllers/sale.controller";

const router = Router();

router.post("/",saleController.createSale)

export default router;