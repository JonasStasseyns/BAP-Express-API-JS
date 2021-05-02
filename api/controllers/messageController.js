import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { messageModel as Message } from "../models/Message";
import { conversationModel as Conversation } from "../models/Conversation";
import httpStatus from "../../utils/httpStatus";
import appConfig from "../../config/env";
import {technicianModel as Technician} from "../models/Technician";

const messageController = {};

messageController.findAll = async (req, res) => {
    const user_id = req.params.user_id
    try {
        let conversations = await Conversation.find({$or:[{userAlpha: user_id}, {userBeta:user_id}]});

        return res.json(conversations);
    } catch (error) {
        return res
            .status(httpStatus.INTERNAL_SERVER_ERROR)
            .json({ error: error.toString() });
    }
};


messageController.findById = async (req, res) => {
    try {
        const messages = await Message.find({$or:[{sender_id: req.params.me, receiver_id: req.params.them}, {sender_id: req.params.them, receiver_id: req.params.me}]}).sort({$natural:-1}).limit(10);
        return res.json(messages.reverse())
    }catch (err) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({error:err.toString()})
    }
}

messageController.create = async (req, res) => {
    try {
        let {sender_id, receiver_id} = req.body
        const conversation = await Conversation.find({$or:[{userAlpha: sender_id, userBeta:receiver_id}, {userAlpha: receiver_id, userBeta:sender_id}]})

        console.log(conversation)
        if(conversation.length === 0){
            console.log('none exist')
            const newCon = new Conversation({userAlpha:sender_id, userBeta:receiver_id, lastMessage: req.body.message, userAlphaName: req.body.userAlphaName, userBetaName: req.body.userBetaName}).save()
        }else{
            console.log('one does exist')
            conversation[0].lastMessage = req.body.message
            conversation[0].save()
        }

        const message = new Message(req.body).save()
        return res.status(httpStatus.OK).json('Message sent')
    } catch (error) {
        return res
            .status(httpStatus.INTERNAL_SERVER_ERROR)
            .json({ error: error.toString() });
    }
}

export default messageController;
