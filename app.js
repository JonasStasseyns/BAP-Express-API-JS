import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import apiRouter from "./api/routes";
import connectMongo from "./config/mongoconnect";
import cors from 'cors'
import http from "http";
import io from "socket.io"

const app = express();
const server = http.createServer(app)
let socketio = new io(server, {
  cors: {
    origin: "https://bachelorproef-b2b80.web.app",
    methods: ["GET", "POST"]
  }
});

// const corsOptions = {
//   origin: 'https://bachelorproef-b2b80.web.app',
//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// }

// Production enviromentss
const isProduction = process.env.NODE_ENV === "production";
app.use(bodyParser.json());

socketio.on('connection', client => {
  console.log(client.id)
})

//https debug
app.use(morgan("dev"));

//Connect Mongo
connectMongo();
app.use(cors())
app.use("/api/v1", apiRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});

