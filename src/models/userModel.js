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
        match: [/^\S+@\S+\.\S+$/, 'Email is invalid']

    },
    password:{
        type:String,
        required:[true,'Password is required'],
        minlength: 8,
        maxlength: 1024
    },
    Role:{
        type:String,
        required:false,
        default:"Employee",
        enum:['Admin','Employee']
    }
    
},


{
    timestamps:true,
})
module.exports=mongoose.model('User',userSchema)
