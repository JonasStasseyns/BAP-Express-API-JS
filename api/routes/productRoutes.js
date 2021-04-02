import express from "express";
import { authRoutes } from "./authRoutes";

const productRoutes = express.Router();

productRoutes.get("/", function(req, res, next) {
    res.json({ message: "May the cors be with you." });
});

productRoutes.use("/auth", authRoutes);

export default productRoutes;
