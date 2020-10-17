const express = require('express')
const User = require('../models/user')
//const session = require('express-session')
const cookieParser = require('cookie-parser')
var session = require('express-session')
const cookie = require('cookie')
const auth = require('../middlewares/auth')
const auth2 = require('../middlewares/auth2')
//const sessionChecker = require('../middlewares/sessionChecker')
const router = new express.Router()

const {sendWelcomeEmail , delemail} = require('../emails/account')


// Home
router.get('',auth,(req,res)=>{
   // console.log('ABCD',req.cookies.Token)
    res.render('_home',{
        user : req.user
    })
})

// /events
router.get('/events',auth,(req,res)=>{
    res.render('_event',{
        user : req.user
    })
})



router.get('/signup',(req,res)=>{
    res.render('_signup')
})

// Signing UP
router.post('/signup' ,async(req,res)=>{
    console.log(req.body)
    const user = new User(req.body)
    try{
        await user.save()
        sendWelcomeEmail(user.email,user.name,user.CollegeName)
        const token = await user.generateAuthToken()
        
       res.redirect('/')
     //  res.status(201).send({user,token})
       
    }catch(e){
        console.log(e)
        
        res.redirect("/signup")
        res.status(400).send(e)
    }
})


// for logging in
// function checkSignIn(req, res){
//     if(req.session.user){
//        next();     //If session exists, proceed to page
//     } else {
//        var err = new Error("Not logged in!");
//        console.log(req.session.user);
//        next(err);  //Error, trying to access unauthorized page!
//     }
//  }


router.get('/login',(req,res)=>{
    res.render('_login')
})


router.post('/login', async(req,res)=>{
    try{
        const user = await User.findByCredentials(req.body.email,req.body.password)
        const token = await user.generateAuthToken()
        // console.log('HELLO' , token)
         res.cookie('Token',token, {maxAge: 5000000})
         
         //req.session.user = user
       
       // req.session.user = user

            res.redirect('/')
        
        
        res.send({user,token})
    }catch(e){
        res.status(400).send()
    }
})
// logging out


router.post('/logout',auth, async (req, res) => {
    try {
        console.log('LOGOUT',req.cookies.Token)
        req.user.tokens = req.user.tokens.filter((token) => {
            res.clearCookie('Token')
            return token.token !== req.token
        })
        
        await req.user.save()
        res.redirect('/')
        res.send()
    } catch (e) {
        res.redirect('/')
        res.status(500).send()
    }
})
router.get('/me' ,auth, async(req,res)=>{
    res.send(req.user)
})
//updation

router.patch('users/me',auth,async(req,res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name','email','password','CollegeName']
    const isValidOperation = updates.every((update)=>{
        return allowedUpdates.includes(update)
    })
    if(!isValidOperation){
        return res.status(400).send({error: 'Invalid Try again'})
    }
    try{
        updates.forEach((update)=>{
            req.user[update] = req.body[update]
        })
        await req.user.save()
        res.send(req.user)
    }catch(e){

        res.status(404).send()
    }
})
router.get('/admin',auth2,async(req,res)=>{
    try{
        if(req.user.Admin)
        {
            await User.find({}, (error,users)=>{
                if(error)
                throw new Error

                else{
                     console.log('^*^*USERS*^*^',users)
                    res.render('admin',{
                        user : req.user,
                        users : users
                    })
                }
            })
        }
    }catch(e){
        console.log(e)
        res.redirect('/')
    }
})


router.get('/campus',auth2,async(req,res)=>{
    try{
        if(req.user.abassador)
        {
            await User.find({CollegeName: req.user.CollegeName}, (error,users)=>{
                if(error)
                throw new Error

                else{
                    // console.log('^*^*USERS*^*^',users[1])
                    res.render('campus',{
                        user : req.user,
                        users : users
                    })
                }
            })
        }
    }catch(e){
        console.log(e)
        res.redirect('/')
    }
})

// router.get('/admin',auth,async(req,res)=>{
//     try{
//         if(req.user.Admin)
//         {
//             await User.find({CollegeName: req.user.CollegeName}, (error,docs)=>{
//                 if(error)
//                 {   console.log(error)
//                     res.status(404).send()
//                 }
//                 else{
//                     console.log(docs)
//                     res.status(201).send(docs)
//                 }
//             })
//         }
//     }catch(e){
//         res.status(404).send(e)
//         }
// })





// Delete

router.delete('/users/me',auth,async(req,res)=>{
    try{
        await req.user.remove()
        delemail(user.email,user.name)
        res.send(req.user)
    }catch(e){
        res.status(500).send()
    }
})



//INVALID REQUESTS

router.get('*',(req,res)=>{
    res.render('404',{
        errorMessage : 'Page Not Found',
    })
})

router.get('/home/*',(req,res)=>{
    res.render('404',{
        errorMessage : 'Page Not Found',
    })
})

router.get('/events/*',(req,res)=>{
    res.render('404',{
        errorMessage : 'Page Not Found',
    })
})


router.get('/admin/*',(req,res)=>{
    res.render('404',{
        errorMessage : 'Page Not Found',
    })
})


router.get('/campus/*',(req,res)=>{
    res.render('404',{
        errorMessage : 'Page Not Found',
    })
})










// Reading self data
//router.get('/users/me',auth,async())

module.exports = router