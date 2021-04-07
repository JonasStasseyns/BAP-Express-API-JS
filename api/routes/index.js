import express from "express";
import technicianRoutes from "./technicianRoutes";
import productRoutes from "./productRoutes";
import authRoutes from "./authRoutes";
import messageRoutes from "./messageRoutes";

const apiRouter = express.Router();

apiRouter.use("/products", productRoutes);
apiRouter.use("/techs", technicianRoutes);
apiRouter.use("/messages", messageRoutes);
apiRouter.use("/auth", authRoutes)

export default apiRouter;
