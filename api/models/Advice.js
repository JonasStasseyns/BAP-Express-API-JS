import mongoose from "mongoose";

const schema = mongoose.Schema;

const adviceSchema = new schema({
    uid: {
        type: String,
        required: true
    },
    budget: {
        type: String,
        required: true
    },
    install: {
        type: String,
        required: true
    },
    filter: {
        type: String,
        required: true
    }
}, {timestamps: true});

const adviceModel = mongoose.model("advice", adviceSchema);
export { adviceModel };
