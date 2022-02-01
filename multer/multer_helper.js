var multer= require('multer');

const imageFilter= function(req, file, cb){
  console.log(file.mimetype);
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb("Please upload only images.", false);
    }
};
// {fileFilter:imageFilter}
var uploadfiltered= multer()
module.exports= uploadfiltered;