const express=require('express')
const path=require('path')
const http=require('http')
const socketio=require('socket.io')
const Filter=require('bad-words')
const { generateMessage, generateLocationMessage } = require('./utils/messages')
const {addUser,removeUser,getUser,getUsersInRoom}=require('./utils/users')


const app=express()
const server=http.createServer(app)
const io=socketio(server)

const port=process.env.PORT||3000
const publicDirectoryPath=path.join(__dirname,'../public')

app.use(express.static(publicDirectoryPath))


io.on('connection',(socket)=>{
    console.log('New Web Socket Connection')

    socket.on('join',({username,room},callback)=>{

        const {error,user}=addUser({id:socket.id,username,room})

        if(error){
            return callback(error)
        }
        //join the room
        socket.join(user.room)

        //welcoming user to the room
        socket.emit('message',generateMessage("Admin","Welcome!"))
      
        // Rendering event to every one in the room
    socket.broadcast.to(user.room).emit('message',generateMessage("Admin",`${user.username} has Joined!`))
    io.to(user.room).emit('roomData',{
        room:user.room,
        users:getUsersInRoom(user.room)
    })
    })

       socket.on('sendingmessage',(text,callback)=>{
           const user=getUser(socket.id)
           const filter=new Filter()

           if(filter.isProfane(text)){
               return callback('profanity is not allowed!')
           }
        io.to(user.room).emit('message',generateMessage(user.username,text))
           callback()
       })


       //if user disconnects from server
       socket.on('disconnect',()=>{
           const user=removeUser(socket.id)

           if(user){
               io.to(user.room).emit('message',generateMessage("Admin",`${user.username} has left!`))
               io.to(user.room).emit('roomData',{
                room:user.room,
                users:getUsersInRoom(user.room)
            })
           }
          
       })

       //recieving location coords
       socket.on('sendLocation',(object)=>{
        const user=getUser(socket.id)
          io.to(user.room).emit('Locationmessage',generateLocationMessage(user.username,`https://google.com/maps?q=${object.latitude},${object.longitude}`))
          
          socket.to(user.room).emit('Locationsharedmessage','Location Shared! ')
       })

 })

server.listen(port,()=>{
    console.log('server is up on port '+port)
})