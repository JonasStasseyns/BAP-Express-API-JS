import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { productModel as Product } from "../models/Product";
import httpStatus from "../../utils/httpStatus";
import appConfig from "../../config/env";

const productController = {};

productController.findAll = async (req, res) => {
    try {
        let products = await Product.find();
        return res.json(products);
    } catch (error) {
        return res
            .status(httpStatus.INTERNAL_SERVER_ERROR)
            .json({ error: error.toString() });
    }
};

productController.create = async (req, res) => {
    try {
        return new Product({
            title: "producttitel",
            excerpt: 'kortebeschrijving',
            description: "langebeschrijving",
            specs: 'specsdatastring',
            price: 600,
            stock: 548,
            category: "mobileac"
        }).save()
    } catch (error) {
        return res
            .status(httpStatus.INTERNAL_SERVER_ERROR)
            .json({ error: error.toString() });
    }
}

export default productController;
