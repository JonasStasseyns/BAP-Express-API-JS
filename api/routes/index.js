import express from "express";
import technicianRoutes from "./technicianRoutes";
import productRoutes from "./productRoutes";
import authRoutes from "./authRoutes";

const apiRouter = express.Router();

apiRouter.use("/products", productRoutes);
apiRouter.use("/techs", technicianRoutes);
apiRouter.use("/auth", authRoutes)

export default apiRouter;
