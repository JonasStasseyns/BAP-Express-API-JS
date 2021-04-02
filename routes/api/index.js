import express from "express";
import { crudRoutes } from "../../module/crud/crud.routes";

const apiRoutes = express.Router();

apiRoutes.get("/", function(req, res, next) {
  res.json({ message: "May the cors be with you." });
});

apiRoutes.use("/auth", crudRoutes);

export default apiRoutes;
