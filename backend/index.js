import express from "express"
import {createServer} from "http"
import {Server} from "socket.io"

const app = express()
const server=createServer(app)
const io = new Server(server,{
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"] 
      }
})

io.on("connection",(socket)=>{
    console.log("connect is running",socket.id)

    socket.on("first",(message)=>{
        console.log("here is your ",message)
    })

    socket.on("disconnect",()=>{
        console.log("user disconnected")
    })
})

server.listen(3000, () => {
    console.log('Server running on port 3000');
});