import express from "express";
import userController from "../controllers/authController";
import { asyncWrapper } from "../../utils/asyncWrapper";

const authRoutes = express.Router();

// authRoutes.get("/", function(req, res, next) {
//     res.json({ message: "from index api" });
// });

// Create
authRoutes.post("/register", asyncWrapper(userController.register));

// Login
authRoutes.post("/login", asyncWrapper(userController.login));
authRoutes.post("/login/check", asyncWrapper(userController.authenticatedLogin));

//GetAll Data
authRoutes.get("/users", asyncWrapper(userController.findAll));

// PW reset
authRoutes.get("/password-reset/start/:email", asyncWrapper(userController.startPasswordReset));
authRoutes.post("/password-reset/finish", asyncWrapper(userController.finishPasswordReset));

//GetBy ID
authRoutes.get("/users/:userId", asyncWrapper(userController.findOne));

//update by ID
authRoutes.put("/users/:userId", asyncWrapper(userController.update));

//Delete
authRoutes.delete("/users/:userId", asyncWrapper(userController.delete));

export default authRoutes
