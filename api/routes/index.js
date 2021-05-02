import express from "express";
import technicianRoutes from "./technicianRoutes";
import productRoutes from "./productRoutes";
import authRoutes from "./authRoutes";
import messageRoutes from "./messageRoutes";
import paymentRoutes from "./paymentRoutes";
import mailRoutes from "./mailRoutes";
import adviceRoutes from "./adviceRoutes";

const apiRouter = express.Router();

apiRouter.use("/products", productRoutes);
apiRouter.use("/techs", technicianRoutes);
apiRouter.use("/messages", messageRoutes);
apiRouter.use("/auth", authRoutes)
apiRouter.use("/payments", paymentRoutes)
apiRouter.use("/mailer", mailRoutes)
apiRouter.use("/advice", adviceRoutes)

export default apiRouter;
