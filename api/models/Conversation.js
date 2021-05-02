import mongoose from "mongoose";

const schema = mongoose.Schema;

const conversationSchema = new schema({
    userAlpha: {
        type: String,
        required: true
    },
    userAlphaName: {
        type: String,
        required: true
    },
    userBeta: {
        type: String,
        required: true
    },
    userBetaName: {
        type: String,
        required: true
    },
    lastMessage: {
        type: String,
        required: true
    }
}, {timestamps:true});

const conversationModel = mongoose.model("conversation", conversationSchema);
export { conversationModel };
