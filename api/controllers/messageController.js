import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { messageModel as Message } from "../models/Message";
import httpStatus from "../../utils/httpStatus";
import appConfig from "../../config/env";

const messageController = {};

messageController.findAll = async (req, res) => {
    try {
        let products = await Product.find();
        return res.json(products);
    } catch (error) {
        return res
            .status(httpStatus.INTERNAL_SERVER_ERROR)
            .json({ error: error.toString() });
    }
};


messageController.findById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        return res.json(product)
    }catch (err) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({error:err.toString()})
    }
}

messageController.create = async (req, res) => {
    try {
        let {sender_id, receiver_id, conversation_id, message} = req.body
        if(conversation_id === ''){
            const probe = await Message.findOne({ "conversation_id": { "$regex": sender_id, "$options": "i" }})
            probe.length ? conversation_id = `${sender_id}_${receiver_id}` : probe.conversation_id
        }
        console.log(req.body)
        return new Message({sender_id, receiver_id, conversation_id, message}).save()
    } catch (error) {
        return res
            .status(httpStatus.INTERNAL_SERVER_ERROR)
            .json({ error: error.toString() });
    }
}

export default messageController;
