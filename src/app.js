const path = require('path')
const express = require('express')
const hbs = require('hbs')
hbs.registerHelper("inc", function(value, options)
{
    return parseInt(value) + 1;
});
const bodyParser = require('body-parser')
const mongoose = require('./db/mongoose')
const User = require('./models/user')

var cookieSession = require('cookie-session')
var cookieParser = require('cookie-parser');
var expressValidator = require('express-validator')
var session = require('express-session')
const cookie = require('cookie')
//const task = require('./models/task')
const app = express()
const port = process.env.PORT 
const userRouter = require('./routers/user')

//const taskRouter = require('./routers/task')
//const multer = require('multer')
const publicDirectory = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname,'../templates/views')
const partialPath = path.join(__dirname,'../templates/partials')
// setting handlebars Template Engine
app.set('view engine','hbs')
app.use(bodyParser.urlencoded({ extended: false }))
app.set('views',viewsPath)
hbs.registerPartials(partialPath)
app.use(cookieParser())
app.use(express.json({extended: false}))

app.use(express.static(publicDirectory))
app.use('/',userRouter)



// sesssions

// app.use(session({
//     secret : 'yash',
//     saveUninitialized : false,
//     resave : false,
//     cookie: {
//         expires: 600000,
//         sameSite : true
//     }
    
// }))


// app.use(cookieSession({
//     name: 'session',
//     keys: ['yash'],
  
//     // Cookie Options
//     maxAge:   10 //24 * 60 * 60 * 1000 // 24 hours
//   }))

//app.use(bodyParser.json())

app.listen(port,()=>{
    console.log('Server is up on '+ port)
})