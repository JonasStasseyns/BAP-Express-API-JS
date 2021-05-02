import express from "express";
import productController from "../controllers/productController";

const productRoutes = express.Router();

productRoutes.get("/", productController.findAll);
productRoutes.get("/get/:id", productController.findById);
productRoutes.post("/query", productController.query);
productRoutes.post("/create", productController.create);
productRoutes.post("/update", productController.update);

export default productRoutes;
