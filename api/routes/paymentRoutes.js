import express from "express";
import userController from "../controllers/authController";
import { asyncWrapper } from "../../utils/asyncWrapper";
import paymentController from "../controllers/paymentController";

const paymentRoutes = express.Router();

paymentRoutes.post("/create", asyncWrapper(paymentController.create));

paymentRoutes.post("/webhook", asyncWrapper(paymentController.hook));

paymentRoutes.get("/order-history/:uid", asyncWrapper(paymentController.findOrdersById));

export default paymentRoutes
