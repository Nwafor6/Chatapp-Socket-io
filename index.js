const express = require("express")
const app = express ()
const http = require ("http")
const cors = require ("cors")
const  {Server}= require("socket.io")

app.use(cors());
const server = http.createServer(app)
// app.get('/', (req, res) => {
//     res.send('Hello world');
//   });


//   Create an io server and allow CORS 

const io = new Server(server,{
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
      },
});
const activeUsers = {};
const users = {};
// listen for when client connects
io.on("connection", (socket)=>{
    console.log(`User connected ${socket.id}`)
    activeUsers[socket.id] = true;
    console.log(activeUsers, "Heloo world")
    console.log(users, "connected users who are logged in")

    socket.on("authenticate", (userId) => {
        users[userId] = socket.id;
        console.log(users, "connected users who are logged in")
        // You can also send the list of online users to the client here
    });

    // send message to the user
    // Listen for private messages
    socket.on("private message", ({ friendId, data }) => {
        const friendIdSocketId = users[friendId];
        if (friendIdSocketId) {
            console.log(friendIdSocketId, "receiver socket id")
            // Send the private message to the friendId
            console.log(data, "message")
            io.to(friendIdSocketId).emit("private message", {data});
            console.log("sent data", data)
        } else {
            // Handle the case when the recipient is not online
            // You can send an error message back to the sender
        }
    });
    // Disconnect users
    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
        // Remove the user from the activeUsers object
        delete activeUsers[socket.id];
        console.log(activeUsers, "Heloo world")
    });
});
server.listen(4000, ()=>{console.log("server is listening on port 4000")})