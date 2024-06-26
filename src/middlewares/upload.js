const path = require('path');
const multer =require('multer');

var storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./uploads')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
    // filename:function(req,file,cb){
    //     let ext = path.extname(file.originalname)
    //     cb(null,Date.now() + ext)
    // }
})

var upload = multer ({
    storage: storage,
    fileFilter:function(req, file, callback){
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            callback(null, true);
        } else {
            console.log('Only jpg & png file supported');
            callback(null, false);
        }
    },
    limits:{
        fileSize:1024 * 1024 * 2,
    },

    
});
module.exports = upload;