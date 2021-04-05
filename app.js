import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import apiRouter from "./api/routes";
import connectMongo from "./config/mongoconnect";
import cors from 'cors'
import http from "http";
import io from "socket.io"

const app = express();


// Production enviromentss
const isProduction = process.env.NODE_ENV === "production";
app.use(bodyParser.json());


//https debug
app.use(morgan("dev"));

//Connect Mongo
connectMongo();
app.use(cors())
app.use("/api/v1", apiRouter);


const server = app.listen(5000)
let socketio = io.listen(server, {
  cors: {
    origin: ["https://bachelorproef-b2b80.web.app", "http://178.117.218.240"],
    methods: ["GET", "POST"]
  }
});

socketio.on('connection', socket => {
  console.log(`Client "${socket.id}" connected`)
  socket.on('new-message', function(data) {
    console.log(data);
  });

});
