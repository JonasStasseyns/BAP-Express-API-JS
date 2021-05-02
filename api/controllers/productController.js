import {productModel as Product} from "../models/Product";
import httpStatus from "../../utils/httpStatus";

const productController = {};

productController.findAll = async (req, res) => {
    try {
        let products = await Product.find();
        return res.json(products);
    } catch (error) {
        return res
            .status(httpStatus.INTERNAL_SERVER_ERROR)
            .json({error: error.toString()});
    }
};

productController.query = async (req, res) => {
    try {
        console.log(req.body)
        console.log(req.body.sort)
        let sorting;
        let finalQuery = {
            $and: []
        }

        if (req.body.search) {
            finalQuery.$and.push({
                "title": {"$regex": req.body.search, "$options": "i"}
            })
        }
        if (req.body.filter && req.body.filter !== 'false') {
            finalQuery.$and.push({
                "category": req.body.filter
            })
        }
        if (req.body.sort && req.body.sort !== 'false') {
            sorting = req.body.sort
        }

        if(finalQuery.$and.length === 0){
            finalQuery = {}
        }

        console.log(finalQuery)

        const products = await Product.find(finalQuery).sort(sorting)
        // const products = await Product.find({ "title": { "$regex": req.params.search, "$options": "i" }})
        return res.json(products)
    } catch (err) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({error: err.toString()})
    }
}

productController.findById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        return res.json(product)
    } catch (err) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({error: err.toString()})
    }
}

productController.create = async (req, res) => {
    try {
        const product = await new Product(req.body).save()
        return res.status(httpStatus.OK).json(product)
    } catch (error) {
        return res
            .status(httpStatus.INTERNAL_SERVER_ERROR)
            .json({error: error.toString()});
    }
}

productController.update = async (req, res) => {
    try {
        console.log(req.body)
        await Product.findByIdAndUpdate(req.body.id, req.body)
        // const product = await new Product(req.body).save()
        return res.status(httpStatus.OK).json('Done')
    } catch (error) {
        return res
            .status(httpStatus.INTERNAL_SERVER_ERROR)
            .json({error: error.toString()});
    }
}

export default productController;
