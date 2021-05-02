import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {userModel} from "../models/User";
import httpStatus from "../../utils/httpStatus";
import appConfig from "../../config/env";
import {sendToken} from '../../app'
import createMollieClient from "@mollie/api-client";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import handlebars from "handlebars";

const userController = {};

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

// Create User
userController.register = async (req, res, next) => {
    userModel
        .find({email: req.body.email})
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(httpStatus.CONFLICT).json({
                    message: "Mail exists"
                })
            } else {
                bcrypt.hash(req.body.password, 10, async (err, hash) => {
                    console.log(hash);
                    if (err) {
                        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                            error: err
                        })
                    } else {
                        const newUser = await userModel.create({
                            firstName: req.body.firstName,
                            lastName: req.body.lastName,
                            address: req.body.address,
                            email: req.body.email.toLowerCase(),
                            country: req.body.country,
                            phone: req.body.phone,
                            password: hash
                        });
                        let {password, __v, ...user} = newUser.toObject();
                        return res.status(httpStatus.CREATED).json({data: {user}});
                    }
                });
            }
        });
};

userController.authenticatedLogin = async (req, res) => {
    sendToken({
        message: "Auth successful",
        token: req.body.token,
        sid: req.body.sid
    })
    res.status(httpStatus.OK).json({message: 'oki'})
}

// Login user
userController.login = async (req, res, next) => {
    userModel
        .find({email: req.body.email})
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(httpStatus.UNAUTHORIZED).json({
                    message: "Auth failed"
                });
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(httpStatus.UNAUTHORIZED).json({
                        message: "Auth failed"
                    });
                }
                if (result) {
                    const token = jwt.sign(
                        {
                            email: user[0].email,
                            fullName: user[0].firstName + ' ' + user[0].lastName,
                            userId: user[0].id
                        },
                        appConfig.jwt_key,
                        {
                            expiresIn: appConfig.jwt_expiration
                        }
                    );
                    if (req.body.sid) {
                        const data = {
                            message: "Auth successful",
                            token: token,
                            sid: req.body.sid
                        }
                        sendToken(data)
                    }
                    return res.status(httpStatus.OK).json({
                        message: "Auth successful",
                        token: token,
                    });
                }
                res.status(httpStatus.UNAUTHORIZED).json({
                    message: "Auth failed"
                });
            });
        })
        .catch(err => {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                error: err
            });
        });
};

// Get All Users
userController.findAll = async (req, res) => {
    try {
        let users = await userModel.find();
        return res.json(users);
    } catch (error) {
        return res
            .status(httpStatus.INTERNAL_SERVER_ERROR)
            .json({error: error.toString()});
    }
};

// TODO MAKE SURE YOU DON4T MIX UP TECHID AND USERID

// Get User By ID
userController.findOne = async (req, res) => {
    console.log('GETONE')
    try {
        let user = await userModel.findById(req.params.userId);
        if (!user) {
            return res
                .status(httpStatus.BAD_REQUEST)
                .json({message: "User not found"});
        }
        return res.json(user);
    } catch (error) {
        return res
            .status(httpStatus.INTERNAL_SERVER_ERROR)
            .json({error: error.toString()});
    }
};

// Update User By ID
userController.update = async (req, res) => {
    try {
        let user = await userModel.findById(req.params.userId);
        if (!user) {
            return res
                .status(httpStatus.BAD_REQUEST)
                .json({message: "User not found"});
        }
        Object.assign(user, req.body);
        await user.save();
        return res.json(user);
    } catch (error) {
        return res.status(500).json({error: error.toString()});
    }
};

// Delete User By ID
userController.delete = async (req, res) => {
    try {
        let user = await userModel.findByIdAndRemove(req.params.userId);
        if (!user) {
            return res
                .status(httpStatus.BAD_REQUEST)
                .json({message: "User not found"});
        }
        return res.json({message: "User deleted successfully!"});
    } catch (error) {
        return res.status(500).json({error: error.toString()});
    }
};

userController.startPasswordReset = async (req, res) => {
    try {
        let user = await userModel.find({email: req.params.email});
        console.log(user)
        const token = await jwt.sign(
            {
                email: user[0].email,
                fullName: user[0].firstName + ' ' + user[0].lastName,
                userId: user[0].id
            },
            appConfig.jwt_key,
            {
                expiresIn: appConfig.jwt_expiration
            }
        );

        readHTMLFile(path.join(__dirname, '..', '..', 'public', 'mails', 'PasswordReset.html'), (err, html) => {
            const template = handlebars.compile(html);
            const replacements = {token};
            const htmlToSend = template(replacements);
            const mailOptions = {
                from: `"AC Assistant support" <no-reply@ac-assistant.be>`, // sender address
                // to: 'stasseynsjonas@gmail.com, ' + user.email, // list of receivers
                to: req.params.email, // list of receivers
                subject: 'Wachtwoord herstellen', // Subject line
                html: htmlToSend // html body
            };
            transporter.sendMail(mailOptions, function (error, response) {
                if (error) {
                    console.log(error);
                }else{
                    console.log(response)
                }
            });
        })

        res.status(httpStatus.OK).json(user)
    }catch(err){
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json('ai')
    }
}

userController.finishPasswordReset = async (req, res) => {
    try {
        console.log(req.body.token)
        let user = await userModel.findById(req.body.token);
        if (!user) {
            return res
                .status(httpStatus.BAD_REQUEST)
                .json({message: "User not found"});
        }
        bcrypt.hash(req.body.password, 10, async (err, hash) => {
            user.password = hash
            await user.save();
            return res.status(httpStatus.OK).json(user);
        })
        console.log('sometinhg')
    }catch (err){
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json('Something went terribly wrong')
    }
}

export default userController;
