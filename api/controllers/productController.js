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

productController.search = async (req, res) => {
    try {
        const products = await Product.find({ "title": { "$regex": req.params.search, "$options": "i" }})
        return res.json(products)
    }catch (err) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({error:err.toString()})
    }
}

productController.findById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        return res.json(product)
    }catch (err) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({error:err.toString()})
    }
}

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
