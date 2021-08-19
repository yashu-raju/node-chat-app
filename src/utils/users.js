const users=[]

const addUser=({id,username,room})=>{
    //clean the data
    username=username.trim().toLowerCase()
    room=room.trim().toLowerCase()

    //validate the data
    if(!username||!room){
        return {
            error:'username and room are required!'
        }
    }

    //check forexisting user
    const existingUser=users.find((user)=>{
        return user.room===room&&user.username===username
    })

    //validate uesrname
   if(existingUser){
       return {
           error:'username is in use!'
       }
   }

   //store user
   const user={id,username,room}
   users.push(user)
   return {user}
}

const removeUser=(id)=>{
    const index=users.findIndex((user)=>user.id===id)

    if(index!==-1)
    {
        return users.splice(index,1)[0]
    }
}

const getUser=(id)=>{
    return users.find((user)=>user.id===id)
      
}

const getUsersInRoom=(room)=>{
  room=room.trim().toLowerCase()
  return users.filter((user)=>user.room===room)
  }


  module.exports={
      addUser,
      removeUser,
      getUser,
      getUsersInRoom

  }

// //calling adduser()
// addUser({
//     id:22,
//     username:'Yashu',
//     room:'india south'
// })

// addUser({
//     id:24,
//     username:'Yashu raju',
//     room:'india south'
// })

// addUser({
//     id:25,
//     username:'Yashu praveen',
//     room:'india'
// })


// // const getusers=getUser(25)
// // console.log(getusers)
// //  console.log(users)

// const getRoom=getUsersInRoom('india south')
// console.log(getRoom)



// //calling removeuser()
// // const removedUser=removeUser(22)
// // console.log(removedUser)
// // console.log(users)