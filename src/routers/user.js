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
//contact
router.get('/contact',auth,(req,res)=>{
    res.render('contact',{
        user : req.user
    })
})
// user
router.get('/user',auth2,(req,res)=>{
    console.log(req.user)
    res.render('user',{
        user : req.user
    })
})
router.post('/user',auth2,async(req,res)=>{
    console.log('REQ',req.user.request);
   try{
       const USER = req.user
       USER.request = true
       USER.save()
       res.redirect('/user')

   }catch(e){
       res.redirect('/user')
   }
})

// registration form
router.get('/register',auth2,(req,res)=>{
    res.render('register',{
        user : req.user
    })
})
router.post('/register',auth2,async(req,res)=>{
    
    try{
        const USER = req.user
        // if(USER.registered === false){
        // USER.registered = true;
            console.log('AAAAAA',req.body.DanceBattle)
        if(USER.registered === false){
            if(req.body.DanceBattle)
            USER.DanceBattle = true
            else
            USER.DanceBattle = false
            if(req.body.RapItUp)
            USER.RapItUp = true
            else
            USER.RapItUp = false
            if(req.body.Pronite)
            USER.Pronite = true
            else
            USER.Pronite = false
            if(req.body.KavitaAurSamvad)
            USER.KavitaAurSamvad = true
            else
            USER.KavitaAurSamvad = false
            if(req.body.StuntShow)
            USER.StuntShow = true
            else
            USER.StuntShow = false
            if(req.body.Canvas)
            USER.Canvas = true
            else
            USER.Canvas = false
            USER.registered = true
    }
            // USER.DanceBattle = true
        // }
        await USER.save()
        res.redirect('/register')
    }catch(e){
        console.log(e)
        res.redirect('/register')
    }
})

// signup
router.get('/signup',(req,res)=>{
    res.render('_signup')
})

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

// login
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

//updation

// router.patch('users/me',auth,async(req,res)=>{
//     const updates = Object.keys(req.body)
//     const allowedUpdates = ['name','email','password','CollegeName']
//     const isValidOperation = updates.every((update)=>{
//         return allowedUpdates.includes(update)
//     })
//     if(!isValidOperation){
//         return res.status(400).send({error: 'Invalid Try again'})
//     }
//     try{
//         updates.forEach((update)=>{
//             req.user[update] = req.body[update]
//         })
//         await req.user.save()
//         res.send(req.user)
//     }catch(e){

//         res.status(404).send()
//     }
// })


// ADMIN DATA
router.get('/admin',auth2,async(req,res)=>{
    try{
        if(req.user.Admin)
        {   
            var USER= {}
            var amb= {}
            var one = {}
            var two = {}
            var three = {}
            var four = {}
            var five = {}
            var six = {}
            await User.find({}, (error,users)=>{
                if(error)
                throw new Error

                else{
                    //  console.log('^*^*USERS*^*^',users)
                    // res.render('_admin',{
                    //     user : req.user,
                    //     users : users
                     USER = users
                    // })
                   
                }
            })
            await User.find({abassador : true},(error,ambassadors)=>{
                if(error)
                throw new Error
                else{
                    // console.log('AMB',ambassadors)
                    amb = ambassadors
                }
            })
            await User.find({DanceBattle : true},(error,dance)=>{
                if(error)
                throw new Error
                else{
                    // console.log('AMB',dance)
                    one = dance
                }
            })
            await User.find({RapItUp : true},(error,Rap)=>{
                if(error)
                throw new Error
                else{
                    // console.log('AMB',Rap)
                   two = Rap
                }
            })
            await User.find({Pronite : true},(error,pro)=>{
                if(error)
                throw new Error
                else{
                    // console.log('AMB',pro)
                    three = pro
                }
            })
            await User.find({KavitaAurSamvad : true},(error,kavita)=>{
                if(error)
                throw new Error
                else{
                    // console.log('AMB',kavita)
                    four = kavita
                }
            })
            await User.find({StuntShow : true},(error,stunt)=>{
                if(error)
                throw new Error
                else{
                    // console.log('AMB',stunt)
                    five = stunt
                }
            })
            await User.find({Canvas : true},(error,canvas)=>{
                if(error)
                throw new Error
                else{
                    // console.log('AMB',canvas)
                    six = canvas
                }
            })

            res.render('_admin',{
                user : req.user,
                users : USER,
                ambass : amb,
                one : one,
                two : two,
                three : three, 
                four : four,
                five : five,
                six : six
            })

        }
    }catch(e){
        console.log(e)
        res.redirect('/')
    }
})


// Requests for becoming ambassador
router.get('/requests',auth2,async(req,res)=>{
    try{
        if(req.user.Admin)
        {
            await User.find({request : true}, (error,users)=>{
                if(error)
                throw new Error

                else{
                    //  console.log('^*^*USERS*^*^',users)
                    res.render('requests',{
                        user : req.user,
                        users : users
                    })
                }
            })
        }
    }catch(e){
        console.log(e)
        res.redirect('')
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
        res.redirect('')
    }
})

// Delete

//INVALID REQUESTS

// router.get('*',auth,(req,res)=>{
//     res.render('404',{
//         errorMessage : 'Page Not Found',
//     })
// })
router.get('*',auth,(req,res)=>{
    res.render('404',{
        errorMessage : 'Page Not Found',
    })
})

router.get('/admin/*',auth,(req,res)=>{
    res.render('404',{
        errorMessage : 'Page Not Found',
    })
})

router.get('/events/*',auth,(req,res)=>{
    res.render('404',{
        errorMessage : 'Page Not Found',
    })
})


router.get('/home/*',auth,(req,res)=>{
    res.render('404',{
        errorMessage : 'Page Not Found',
    })
})


router.get('/login/*',auth,(req,res)=>{
    res.render('404',{
        errorMessage : 'Page Not Found',
    })
})
router.get('/signup/*',auth,(req,res)=>{
    res.render('404',{
        errorMessage : 'Page Not Found',
    })
})
router.get('/campus/*',auth,(req,res)=>{
    res.render('404',{
        errorMessage : 'Page Not Found',
    })
})
router.get('/contact/*',auth,(req,res)=>{
    res.render('404',{
        errorMessage : 'Page Not Found',
    })
})
router.get('/register/*',auth,(req,res)=>{
    res.render('404',{
        errorMessage : 'Page Not Found',
    })
})
router.get('/requests/*',auth,(req,res)=>{
    res.render('404',{
        errorMessage : 'Page Not Found',
    })
})
router.get('/user/*',auth,(req,res)=>{
    res.render('404',{
        errorMessage : 'Page Not Found',
    })
})
// Reading self data
//router.get('/users/me',auth,async())

module.exports = router