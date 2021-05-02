import mongoose from "mongoose";

const schema = mongoose.Schema;

const productSchema = new schema({
        title: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        specs: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        orders: {
            type: Number,
            default: 0
        }
    })
;

const productModel = mongoose.model("product", productSchema);
export {productModel};
