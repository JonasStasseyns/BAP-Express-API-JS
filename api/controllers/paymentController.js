import httpStatus from "../../utils/httpStatus";
import createMollieClient from '@mollie/api-client';
import {orderModel as Order} from "../models/Order";
import {userModel as User} from "../models/User";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import handlebars from "handlebars";

const mollieClient = createMollieClient({apiKey: "test_CVpMbqHgvPEb4xxvcPBGhxWjhKhuyU"});

const paymentController = {};

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport('smtp://no-reply@ac-assistant.be:nodemailerpw@send.one.com');

const readHTMLFile = (path, callback) => {
    fs.readFile(path, {encoding: 'utf-8'}, (err, html) => {
        if (err) {
            throw err;
            callback(err);
        } else {
            callback(null, html);
        }
    });
};

paymentController.create = async (req, res) => {
    console.log(req.body.total.toFixed(2).toString())
    mollieClient.payments.create({
        amount: {
            "value": req.body.total.toFixed(2).toString(),
            "currency": "EUR"
        },
        description: 'AC Assistant bestelling',
        redirectUrl: 'https://ac-assistant.be/payment',
        webhookUrl: 'https://bap-express-api.glitch.me/api/v1/payments/webhook'
    })
        .then(payment => {
            const data = req.body
            data.paymentId = payment.id
            const product = new Order(data).save()
            console.log(payment.id)
            res.status(httpStatus.OK).json(payment)
        })
        .catch(error => {
            // Handle the error
            return res.json(error);
        });
};

paymentController.hook = async (req, res) => {
    mollieClient.payments.get(req.body.id)
        .then(async payment => {
            try {
                const order = await Order.find({paymentId: payment.id})
                // console.log(order)
                order[0].status = payment.status
                order[0].save()
                const user = await User.findById(order[0].uid)
                console.log(user)
                let result = []

                JSON.parse(order[0].products).forEach(product => result.push({
                    price: product.price,
                    title: product.title
                }))

                sendOrderConfirmation(result, user, order[0].total)
                res.status(httpStatus.OK).json('payment status changed')
            } catch (err) {
                res.status(httpStatus.INTERNAL_SERVER_ERROR).json({error: "No Order exists for this id (anymore)"})
            }
        })
        .catch(error => {
            console.log(error)
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json('nowkay')
        });
}

paymentController.findOrdersById = async (req, res) => {
    try {
        const orders = await Order.find({uid: req.params.uid})

        res.status(httpStatus.OK).json(orders)
    } catch (err) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({error: "No Order exists for this id (anymore)"})
    }
}

const sendOrderConfirmation = (order, user, total) => {
    readHTMLFile(path.join(__dirname, '..', '..', 'public', 'mails', 'OrderConfirmation.html'), (err, html) => {
        const template = handlebars.compile(html);
        const replacements = {
            products: order,
            total
        };
        const htmlToSend = template(replacements);
        const mailOptions = {
            from: `"AC Assistant bestelling #${order.id}" <no-reply@ac-assistant.be>`, // sender address
            to: user.email, // list of receivers
            subject: 'Uw bestelling bij AC-Assistant', // Subject line
            html: htmlToSend // html body
        };
        transporter.sendMail(mailOptions, function (error, response) {
            if (error) {
                console.log(error);
            }
        });
    })
}

export default paymentController
