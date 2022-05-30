const app = require('express')();
const PORT = 3090;
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer, { cors: { origin:"*" } })
// const io = require('socket.io')(httpServer)

httpServer.listen( PORT, async ()=>{
    console.log('SOCKET listening on port :', PORT)
} )

io.on('connection', (socket)=>{
    // query object is stored in socket.handshake.query
    console.log(socket.id, "Connected")

    socket.on('disconnect', async ()=>{
        console.log(socket.id, "Disconnected")
    });

    //when a socket emits a message
    socket.on( 'send-message', async ( msgData )=>{

        // socket.emit('get-message', {...msgData, route: 'emit'}) // to self
        // io.to(socket.id).emit('message', msgData) // to a particular socket id
        // socket.broadcast.emit('get-message', msgData) // to every socket except the sender
        io.emit('get-message', msgData) // to everyone including self
    } )

})