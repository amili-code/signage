const socketIo = require('socket.io');
require('dotenv').config();




function setupSocket(server) {
    const io = socketIo(server);
    io.on("connection", (socket) => {
        console.log("user connected")



        socket.on('example', (e) => {
           
        })

        socket.on("disconnect", () => { console.log('user disconnected') });
    });




    return io;
}

module.exports = setupSocket;