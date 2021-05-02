import express from "express";
import messageController from "../controllers/messageController";

const messageRoutes = express.Router();

messageRoutes.get("/:user_id", messageController.findAll);
messageRoutes.post("/create", messageController.create);
messageRoutes.get("/conversation/:me/:them", messageController.findById);

export default messageRoutes;
