import mongoose from "mongoose";

const schema = mongoose.Schema;

const technicianSchema = new schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    hourlyRate: {
        type: Number,
        required: true
    },
    city: {
        type: String,
        required: true
    }
});

const technicianModel = mongoose.model("technician", technicianSchema);
export { technicianModel };
