import httpStatus from "../../utils/httpStatus";
// import {OrderConfirmation} from "../../config/mails/html.html";
import {adviceModel as Advice} from "../models/Advice";
import {productModel as Product} from "../models/Product";
import {technicianModel as Tech} from "../models/Technician";

const adviceController = {};


adviceController.create = async (req, res) => {
    try {
        console.log(req.body)
        const advice = await new Advice(req.body).save()
        return res.status(httpStatus.OK).json(advice)
    } catch (error) {
        console.log(error)
        return res
            .status(httpStatus.INTERNAL_SERVER_ERROR)
            .json({error: error.toString()});
    }
};

adviceController.findLatest = async (req, res) => {
    try {
        const priceReference = {
            "mobile": [350, 650],
            "monosplit": [1000, 3000],
            "multisplit": [1000, 3000],
            "monoblock": [1200, 1700],
            "heatpump": [1300, 3500]
        }

        console.log(priceReference["monoblock"][0])

        // {$or:[{sender_id: req.params.me, receiver_id: req.params.them}, {sender_id: req.params.them, receiver_id: req.params.me}]}

        const latestAdvice = await Advice.findOne({uid: req.params.uid}).sort({createdAt: -1})

        console.log(latestAdvice)

        const query = {
            $and: [
                {
                    category: latestAdvice.filter
                }
            ]
        }

        if(latestAdvice.budget === "low"){
            query.$and.push({price: {$lt: priceReference[latestAdvice.filter][0]}})
        }
        if(latestAdvice.budget === "medium"){
            query.$and.push({price: {$gt: priceReference[latestAdvice.filter][0], $lt: priceReference[latestAdvice.filter][1]}})
        }
        if(latestAdvice.budget === "high"){
            query.$and.push({price: {$gt: priceReference[latestAdvice.filter][1]}})
        }

        const products = await Product.find(query).sort({created_at: -1})


        return res.status(httpStatus.OK).json(products);
    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({error: error.toString()});
    }
};

adviceController.findTechLatest = async (req, res) => {
    try {
        const latestAdvice = await Advice.findOne({uid: req.params.uid}).sort({createdAt: -1})

        console.log(latestAdvice)

        const jobMapper = {
            "manual": "start",
            "semi": "install",
            "auto": "all"
        }

        console.log('')
        console.log('')
        console.log(latestAdvice.install)
        console.log(jobMapper[latestAdvice.install])
        console.log('')
        console.log('')

        // const tech = await Tech.find().sort({created_at: -1})
        const techs = await Tech.find()

        const filteredTechs = []

        techs.forEach(t => {
            if(t.allowedJobs[jobMapper[latestAdvice]] == true) {
                console.log('match')
                filteredTechs.push(t)
            }else{
                console.log('--')
            }
        })



        return res.status(httpStatus.OK).json('dd');
    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({error: error.toString()});
    }
};

adviceController.manualFilter = async (req, res) => {
    try {
        const priceReference = {
            "mobile": [350, 650],
            "monosplit": [1000, 3000],
            "multisplit": [1000, 3000],
            "monoblock": [1200, 1700],
            "heatpump": [1300, 3500]
        }

        const latestAdvice = req.body

        const query = {
            $and: [
                {
                    category: latestAdvice.filter
                }
            ]
        }

        if(latestAdvice.budget === "low"){
            query.$and.push({price: {$lt: priceReference[latestAdvice.filter][0]}})
        }
        if(latestAdvice.budget === "medium"){
            query.$and.push({price: {$gt: priceReference[latestAdvice.filter][0], $lt: priceReference[latestAdvice.filter][1]}})
        }
        if(latestAdvice.budget === "high"){
            query.$and.push({price: {$gt: priceReference[latestAdvice.filter][1]}})
        }

        const products = await Product.find(query).sort({created_at: -1})


        return res.status(httpStatus.OK).json(products);
    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({error: error.toString()});
    }
};

export default adviceController;
