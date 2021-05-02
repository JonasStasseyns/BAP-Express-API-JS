import httpStatus from "../../utils/httpStatus";
import nodemailer from 'nodemailer'
// import {OrderConfirmation} from "../../config/mails/html.html";
import handlebars from 'handlebars'
import fs from 'fs'
import path from 'path'
import {orderModel as Order} from "../models/Order";

const mailController = {};



mailController.mailer = async (req, res) => {
    try {

        const order = await Order.findOne({_id: "607ec837a6cfc70bfd01f599"})

        let result = []

        JSON.parse(order.products).forEach(product => result.push({price: product.price, title: product.title}))

        // readHTMLFile(path.join(__dirname, '..', '..', 'public', 'mails', 'OrderConfirmation.html'), function (err, html) {
        //     var template = handlebars.compile(html);
        //     var replacements = {
        //         product: req.body.product
        //     };
        //     var htmlToSend = template(replacements);
        //     const mailOptions = {
        //         from: '"AC Assistant bestelling #64301" <mailer@stasseynsjonas.be>', // sender address
        //         to: 'stasseynsjonas@gmail.com, jonastas@student.student.arteveldehs.be', // list of receivers
        //         subject: 'Hello ✔', // Subject line
        //         html: htmlToSend // html body
        //     };
        //     transporter.sendMail(mailOptions, function (error, response) {
        //         if (error) {
        //             console.log(error);
        //
        //         }
        //     });
        // })

        // const send = transporter.templateSender(new EmailTemplate('../../config/mails'));
        // setup e-mail data with unicode symbols
        // const mailOptions = {
        //     from: '"AC Assistant bestelling #64301" <mailer@stasseynsjonas.be>', // sender address
        //     to: 'stasseynsjonas@gmail.com, jonastas@student.student.arteveldehs.be', // list of receivers
        //     subject: 'Hello ✔', // Subject line
        //     text: 'Hello world 🐴', // plaintext body
        //     html: await OrderConfirmation("DeLonghi PACEX120 SILENT") // html body
        // };
        // console.log(req.body)

        // send({
        //     from: '"AC Assistant bestelling #64301" <mailer@stasseynsjonas.be>', // sender addresss
        //     to: 'stasseynsjonas@gmail.com, jonastas@student.student.arteveldehs.be, geert_stasseyns@hotmail.com', // list of receivers
        //     subject: 'Hello ✔', // Subject line
        // }, {
        //     username: 'Node Mailer',
        //     password: '!"\'<>&some-thing'
        // }, function(err, info){
        //     if(err){
        //         console.log('Error');
        //     }else{
        //         console.log('Password reminder sent');
        //     }
        // });

        // send mail with defined transport object
        // transporter.sendMail(mailOptions, function(error, info){
        //     if(error){
        //         return console.log(error);
        //     }
        //     console.log('Message sent: ' + info.response);
        // });
        return res.status(httpStatus.OK).json(result);

    } catch (error) {
        console.log(error);
        return res
            .status(httpStatus.INTERNAL_SERVER_ERROR)
            .json({error: error.toString()});
    }
};

export default mailController;
