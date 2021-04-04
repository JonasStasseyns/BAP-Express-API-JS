import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import apiRouter from "./api/routes";
import connectMongo from "./config/mongoconnect";
import cors from 'cors'
import http from "http";
import SocketIO from 'socket.io';


const app = express();
app.use(cors())
const server = http.createServer(app)
let io = new SocketIO(server);

// const corsOptions = {
//   origin: 'https://bachelorproef-b2b80.web.app',
//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// }

// Production environment
const isProduction = process.env.NODE_ENV === "production";
app.use(bodyParser.json());

io.on('connection', socket => {
  console.log(socket)
  socket.emit('test', 'hello')
})

//https debug
app.use(morgan("dev"));

//Connect Mongo
connectMongo();
app.use("/api/v1", apiRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});

