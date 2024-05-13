const mongoose=require('mongoose');
const userSchema=new mongoose.Schema({
    userName:{
        type:String,
        required:[true,'User name is required']
    },
    email:{
        type:String,
        required:[true,'Email is required'],
        unique:true,
    },
    password:{
        type:String,
        required:[true,'Password is required']
       
    },
    resetPasswordToken:{type:String},
    resetPasswordExpires:{type:Date,},
    Role:{
        type:String,
        required:false,
        default:"Employee",
        enum:['Admin','Employee']
    },
    isVerified: {
        type: Boolean,
        default: false  
      },
    otp: {
        type: String,
        required: true
      },
    
},


{
    timestamps:true,
})
module.exports=mongoose.model('User',userSchema)
