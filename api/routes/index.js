import express from "express";
import productRoutes from "./productRoutes";

const apiRouter = express.Router();

apiRouter.use("/products", productRoutes);

export default apiRouter;
