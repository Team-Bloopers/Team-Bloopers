const validator = require('validator')
const mongoose = require('mongoose')

const connectionURL = 'mongodb://127.0.0.1:27017/Avishkar' // SPecifying table
mongoose.connect(connectionURL,{
    useNewUrlParser: true,
     useCreateIndex: true,
     useUnifiedTopology: true,
     useFindAndModify : false
    })

// const User = mongoose.model('User',{
//     name : {
//         type : String
//     },
//     age : {
//         type : Number
//     }
// })

// const me = new User({
//     name : 'Yash',
//     age : 20
// })

// me.save().then(()=>{
//     console.log(me)
// }).catch((error)=>{
//     console.log(error)
// })
// const tasks = mongoose.model('tasks',{
//     description :{
//         type : String
//     },
//     completed : {
//         type : Boolean
//     }
// })
 
// const work = new tasks({
//     description : "Website",
//     completed : false
// })

// work.save().then(()=>{
//     console.log(work)
// }).catch((error)=>{
//     console.log(error)
// })