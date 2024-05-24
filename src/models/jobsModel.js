const mongoose = require('mongoose');
const jobSchema=new mongoose.Schema({
    JobName:{
        type:"String",
        required:true
    },
    Description:{
        type:"String",
        required:true
    },
    Picture:{
        type:"Object",
        required:true
    }

},
{timestamps:true})

module.exports = mongoose.model('Jobs', jobSchema);