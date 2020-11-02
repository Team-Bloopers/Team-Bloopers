const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true
 },
    email : {
    type : String,
    required : true,
    unique : true,
    trim : true,
    lowercase : true,
    validate(value){
        if(!validator.isEmail(value)){
            throw new Error("INVALID EMAIL")
        }
    }
},
    password : { 
        type : String,
        required : true,
        validate(value){
            if(value.length < 7)
            throw new Error("Too small")
        },
        trim : true,
        validate(value){
            if(value.includes('password'))
            throw new Error("Invalid Choice")
        }

},
// isVerified : {
//     type : Boolean,
//     default : false
// },
ContactNumber : {
    type : Number,
    required : true
},
    CollegeName : {
    type : String,
    required : true,
    trim : true
    },
    no : {
        type: Number,
        default : 0
    },
Admin : {
    type : Boolean,
    default : false
}, 
abassador : {
    type : Boolean,
    default : false
},
request:{
    type : Boolean,
    default : false
},
DanceBattle : {
    type : Boolean,
    default : false
},
RapItUp : {
    type : Boolean,
    default : false
},
Pronite : {
    type : Boolean,
    default : false
},
KavitaAurSamvad : {
    type : Boolean,
    default : false
},
StuntShow : {
    type : Boolean,
    default : false
},
Canvas : {
    type : Boolean,
    default : false
},
registered : {
    type : Boolean,
    default : false
},
campus_referral : {
    type : String,
    default : "NULL"
},
referral : {
    type : String,
    default : "x"
},
count : {
    type : Number,
    default : 0
},
tokens: [{
    token: {
        type : String,
        required : true
    }
}]
}, {
    timestamps : true
})
// to  avoid token output
userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}




userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id : user._id.toString() },process.env.JWT)
    user.tokens = user.tokens.concat({token})
    console.log(token)
    await user.save()
    return token
}


// Logging in route
userSchema.statics.findByCredentials = async(email,password) =>{
    const user = await User.findOne({email})
    //this is a middleware function
    if(!user) {
        throw new Error('Unable to login')
    }
    const isMatch = await bcrypt.compare(password,user.password)

    if(!isMatch){
        throw new Error('Unable to Login')
    }

    return user
}

// userSchema.statics.findAdminData = async(college)=>{

//     const query = await User.find({CollegeName : college})
//     return (query.getFilter())

// }


// Hash the plain text password before saving
userSchema.pre('save',async function (next){
    const user = this
// a middleware
    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password,8)
    }
    console.log('Just before saving')
    next()
})


const User = mongoose.model('User',userSchema)
module.exports = User