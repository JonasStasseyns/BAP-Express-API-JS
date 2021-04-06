import express from "express";
import productController from "../controllers/productController";

const productRoutes = express.Router();

productRoutes.get("/", productController.findAll);
productRoutes.get("/get/:id", productController.findById);
productRoutes.get("/search/:search", productController.search);
productRoutes.get("/create", productController.create);

export default productRoutes;
