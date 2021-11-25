var multer= require('multer');

const imageFilter= function(req, file, cb){
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb("Please upload only images.", false);
    }
};

var uploadfiltered= multer({fileFilter:imageFilter})
module.exports= uploadfiltered;