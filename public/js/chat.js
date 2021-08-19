const socket=io()

// socket.on('countupdated',(count)=>{
//     console.log('the count has been updated',count)
// })

// document.querySelector('#increment').addEventListener('click',()=>{
//     socket.emit('increment')
// })

// socket.on('message',(welcome)=>{
//    console.log(welcome)
// })

//Elements
const $messageForm=document.querySelector('#message-form')
const  $messageFormInput= $messageForm.querySelector('input')
const  $messageFormButton= $messageForm.querySelector('button')
const $sendLocation=document.querySelector('#send-location')
const $messages=document.querySelector('#messages')

//templates
const messageTemplate=document.querySelector('#message-template').innerHTML
const LocationMessageTemplate=document.querySelector('#location-message-template').innerHTML
const sidebarTemplate=document.querySelector('#sidebar-template').innerHTML

//options
const {username,room}=Qs.parse(location.search,{ignoreQueryPrefix:true})
console.log(username,room)

const autoscroll=()=>{
    //new message element
    const $newMessage=$messages.lastElementChild

    //height of the new message
    const newMessageStyles=getComputedStyle($newMessage)
    const newMessageMargin=parseInt(newMessageStyles.marginBottom)
    const newMessageHeight=$newMessage.offsetHeight+newMessageMargin
    
    //visible height
    const visibleHeight=$messages.offsetHeight

    //height of messages container
    const containerHeight=$messages.scrollHeight

    //how far have i scrolled
    const scrollOffset=$messages.scrollTop+visibleHeight

    if(containerHeight-newMessageHeight<=scrollOffset){
        $messages.scrollTop=$messages.scrollHeight
    }

}

$messageForm.addEventListener('submit',(e)=>{
    console.log(e)
    e.preventDefault()

    //disable button after clicking once
    $messageFormButton.setAttribute('disabled','disabled')

    const text=e.target.elements.message.value
    socket.emit('sendingmessage',text,(error)=>{
    //enabling the button click 
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value=''
        $messageFormInput.focus()


        if(error){
            return console.log(error)
        }
        console.log('Message Delivered!')
    })
})

    socket.on('message',(msg)=>{
        //Rendering the template with message
        const html=Mustache.render(messageTemplate,{
            username:msg.username,
            message:msg.text,
            createdAt:moment(msg.createdAt).format('h:mm a')
        })
        //Inserting reieved template to DOM
        $messages.insertAdjacentHTML('beforeend',html)
      
       
    })

    //consoling location message
    socket.on('Locationmessage',(msg)=>{
         console.log(msg)
          //Rendering the template with message
        const html=Mustache.render(LocationMessageTemplate,{
            username:msg.username,
            url:msg.url,
            createdAt:moment(msg.createdAt).format('h:mm a')
        })
        //Inserting reieved template to DOM
        $messages.insertAdjacentHTML('beforeend',html)

         //enable button
       $sendLocation.removeAttribute('disabled')
    
      
    })

    socket.on('roomData',({room,users})=>{
        const html=Mustache.render(sidebarTemplate,{
            room,
            users
        })
        document.querySelector('#sidebar').innerHTML=html
    })

    socket.on('Locationsharedmessage',(message)=>{
            
        console.log(message)
        //enable button
       $sendLocation.removeAttribute('disabled')
    })

    $sendLocation.addEventListener('click',(e)=>{
        console.log(e)
    if(!navigator.geolocation){
        return alert('Geolocation is not supported in your browser')
    }
     //disable button just before getting current loc
     $sendLocation.setAttribute('disabled','disabled')

    navigator.geolocation.getCurrentPosition((position)=>{
        socket.emit('sendLocation',{
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
        })
    })
})

socket.emit('join', {username,room},(error)=>{
    if(error){
        alert(error)
        location.href='/'
    }
})