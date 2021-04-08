import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { technicianModel as technician } from "../models/Technician";
import httpStatus from "../../utils/httpStatus";
import appConfig from "../../config/env";

const technicianController = {};

technicianController.findAll = async (req, res) => {
    try {
        let technicians = await technician.find();
        return res.json(technicians);
    } catch (error) {
        return res
            .status(httpStatus.INTERNAL_SERVER_ERROR)
            .json({ error: error.toString() });
    }
};

technicianController.search = async (req, res) => {
    try {
        const technicians = await technician.find({ "title": { "$regex": req.params.search, "$options": "i" }})
        return res.json(technicians)
    }catch (err) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({error:err.toString()})
    }
}

technicianController.findById = async (req, res) => {
    try {
        const technician = await technician.findById(req.params.id)
        return res.json(technician)
    }catch (err) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({error:err.toString()})
    }
}

// technicianController.create = async (req, res) => {
//     try {
//         return new technician({
//             title: "techniciantitel",
//             excerpt: 'kortebeschrijving',
//             description: "langebeschrijving",
//             specs: 'specsdatastring',
//             price: 600,
//             stock: 548,
//             category: "mobileac"
//         }).save()
//     } catch (error) {
//         return res
//             .status(httpStatus.INTERNAL_SERVER_ERROR)
//             .json({ error: error.toString() });
//     }
// }

export default technicianController;
