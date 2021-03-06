import mongoose from "mongoose";

const schema = mongoose.Schema;

const messageSchema = new schema({
    sender_id: {
        type: String,
        required: true
    },
    receiver_id: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
}, {timestamps: true});

const messageModel = mongoose.model("message", messageSchema);
export {messageModel};
