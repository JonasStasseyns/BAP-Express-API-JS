import mongoose from "mongoose";

const schema = mongoose.Schema;

const orderSchema = new schema({
    uid: {
        type: String,
        required: true
    },
    products: {
        type: String,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    paymentId: {
        type: String,
        required: true
    }
});

const orderModel = mongoose.model("order", orderSchema);
export { orderModel };
