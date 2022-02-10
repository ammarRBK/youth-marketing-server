var multer= require('multer');

var storage= multer.diskStorage({
  destination: function (req,file,callback){
    callback(null, './temp_images');
  },
  filename: function (req,file,callback){
    const filename= Date.now() + '-' + Math.round(Math.random() * 1E9) + '-' + file.fieldname;
  }
})
// const imageFilter= function(req, file, cb){
//   console.log(file.mimetype);
//     if (file.mimetype.startsWith("image")) {
//       cb(null, true);
//     } else {
//       cb("Please upload only images.", false);
//     }
// };
// {fileFilter:imageFilter}
var uploadFile= multer({storage:storage})
// const blobtoimage = (blob) => {
//   return new Promise(resolve => {
//     const url = URL.createObjectURL(Buffer.from(blob, 'binary'))
//     let img = new Image()
//     img.onload = () => {
//       URL.revokeObjectURL(url)
//       resolve(img)
//     }
//     img.src = url
//   })
// }
module.exports= {uploadFile:uploadFile};