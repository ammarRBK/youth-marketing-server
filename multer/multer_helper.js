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
var hextobase64=function hexToBase64(str) {
  return btoa(String.fromCharCode.apply(null, str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" ")));
}
module.exports= {uploadfiltered:uploadfiltered,hexBobase64:hextobase64};