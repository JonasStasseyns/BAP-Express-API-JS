import express from "express";
import { authRoutes } from "./authRoutes";
import technicianController from "../controllers/technicianController";

const technicianRoutes = express.Router();

technicianRoutes.get("/", technicianController.findAll);
technicianRoutes.get("/get/:id", technicianController.findById);
technicianRoutes.get("/search/:search", technicianController.search);
technicianRoutes.get("/create", technicianController.create);

export default technicianRoutes;
