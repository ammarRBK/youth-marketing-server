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
const blobtoimage = (blob) => {
  return new Promise(resolve => {
    const url = URL.createObjectURL(Buffer.from(blob, 'binary'))
    let img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.src = url
  })
}
module.exports= {uploadfiltered:uploadfiltered,blobToImage:blobtoimage};