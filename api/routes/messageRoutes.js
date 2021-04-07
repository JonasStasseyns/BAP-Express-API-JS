import express from "express";
import messageController from "../controllers/messageController";

const messageRoutes = express.Router();

messageRoutes.post("/create", messageController.create);

export default messageRoutes;
