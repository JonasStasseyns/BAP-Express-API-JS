import express from "express";
import messageController from "../controllers/messageController";
import mailController from "../controllers/mailController";
import adviceController from "../controllers/adviceController";

const adviceRoutes = express.Router();

adviceRoutes.get("/:uid", adviceController.findLatest)
adviceRoutes.post("/", adviceController.create)
adviceRoutes.get("/techs/:uid", adviceController.findTechLatest)
adviceRoutes.post("/manual", adviceController.manualFilter)
adviceRoutes.post("/techs/manual", adviceController.manualFilter)

export default adviceRoutes;
