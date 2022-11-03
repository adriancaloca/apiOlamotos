import { Router } from "express";
//Controller
import { methods as usersController } from "../controllers/users.controller";

const router = Router();

router.get("/",usersController.getUsers);
router.get("/:id",usersController.getUser);
router.post("/",usersController.addUser);
router.put("/:id",usersController.updateUser);
router.delete("/:id",usersController.deleteUser);

export default router;