import express from "express";
import messageController from "../controllers/messageController";
import mailController from "../controllers/mailController";

const mailRoutes = express.Router();

mailRoutes.post("/", mailController.mailer)

export default mailRoutes;
