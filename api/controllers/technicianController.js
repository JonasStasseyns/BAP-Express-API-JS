import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { technicianModel as Technician } from "../models/Technician";
import httpStatus from "../../utils/httpStatus";
import appConfig from "../../config/env";

const technicianController = {};

technicianController.findAll = async (req, res) => {
    try {
        let technicians = await Technician.find();
        return res.json(technicians);
    } catch (error) {
        return res
            .status(httpStatus.INTERNAL_SERVER_ERROR)
            .json({ error: error.toString() });
    }
};

technicianController.search = async (req, res) => {
    try {
        const technicians = await Technician.find({ "title": { "$regex": req.params.search, "$options": "i" }})
        return res.json(technicians)
    }catch (err) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({error:err.toString()})
    }
}

technicianController.findById = async (req, res) => {
    try {
        const technician = await Technician.findById(req.params.id)
        return res.json(technician)
    }catch (err) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({error:err.toString()})
    }
}

technicianController.create = async (req, res) => {
    try {
        console.log(req.body)
        const tech = await new Technician(req.body).save()
        res.status(httpStatus.OK).json(tech)
    } catch (error) {
        return res
            .status(httpStatus.INTERNAL_SERVER_ERROR)
            .json({ error: error.toString() });
    }
}

export default technicianController;
