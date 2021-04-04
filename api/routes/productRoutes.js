import express from "express";
import { authRoutes } from "./authRoutes";
import productController from "../controllers/productController";

const productRoutes = express.Router();

productRoutes.get("/", productController.findAll);
productRoutes.get("/create", productController.create);

export default productRoutes;
