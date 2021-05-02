import express from "express";
import morgan from "morgan";
import apiRouter from "./api/routes";
import connectMongo from "./config/mongoconnect";
import cors from 'cors'
import io from "socket.io"
import ejs from 'ejs'

const app = express();

let socketRegistry = []

// Production enviromentss
const isProduction = process.env.NODE_ENV === "production";
app.use(express.json());
app.use(express.urlencoded());
app.use(express.static('public'));


//https debug
app.use(morgan("dev"));



//Connect Mongo
connectMongo();
app.use(cors())
app.use("/api/v1", apiRouter);
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');
app.set('view engine', 'ejs');

const server = app.listen(5000)
let socketio = io.listen(server, {
    cors: {
        origin: ["https://bachelorproef-b2b80.web.app", "https://178.117.218.240", "https://ac-assistant.be"],
        methods: ["GET", "POST"]
    }
})


socketio.on('connection', socket => {
    console.log(`Client "${socket.id}" connected`)
    socket.on('register-chat', id => {
        console.log('registered')
        console.log(socketRegistry)
        socketRegistry.push({userId: id, socketId: socket.id})
    })
    socket.on('message-sorter', data => {
        console.log('message received')
        const socketTargets = socketRegistry.filter(obj => {
            return (obj.userId === data.id) ? obj : false
        })
        console.log(socketTargets)
        socketTargets.forEach(tunnel => {
            socketio.to(tunnel.socketId).emit('receive-message', data.message)
            console.log('####### DIS PROBABLY CULPRIT #######')
        })
        console.log('message sent')
    })
    socket.on('login-tether', (data) => {
        console.log('ani');
        console.log(data);
    });
    socket.on('disconnect', event => {
        console.log("Disconnected: " + socket.id)
        socketRegistry = socketRegistry.filter(obj => {
            return (obj.socketId !== socket.id) ? obj : false
        })
    })
});

export const sendToken = (data) => {
    console.log("I sent someone's JWT-token through their socket connection.")
    socketio.to(data.sid).emit('token-event', data);
}
