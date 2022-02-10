var multer= require('multer');
var fs= require('fs');

var storage= multer.diskStorage({
  destination: function (req,file,callback){
    callback(null, './temp_images');
  },
  filename: function (req,file,callback){
    const filename= Date.now() + '-' + Math.round(Math.random() * 1E9) + '-' + file.fieldname;
    callback(null, filename);
  }
});


const clientId= '93409857556-qm6lqqrl4g2hd1ddoife91dgd3dq1p4f.apps.googleusercontent.com';
const clientSecretId= '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';
const redirectUrl= 'https://developers.google.com/oauthplayground';
const refreshToken= '1//04NyFL_jlqhyQCgYIARAAGAQSNwF-L9Iru6RtOVLEmn_ilXS1f_sAx2ydt74o8bqddEbUeYVkvdZckJ9aSc_Wcx4taxFVtRRbQIw';

const oauth2Client = new google.auth.OAuth2(
  clientId,
  clientSecretId,
  redirectUrl
);

oauth2Client.setCredentials({ refresh_token: refreshToken });

const drive = google.drive({
  version: 'v3',
  auth: oauth2Client,
});

const driveFunctions= {
  uploadFile: async function(fileName, filePath){
    try {
      const response = await drive.files.create({
        requestBody: {
          name: fileName, //This can be name of your choice
          mimeType: 'image/jpeg',
        },
        media: {
          mimeType: 'image/jpeg',
          body: fs.createReadStream(filePath),
        },
      });
  
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error.message);
      return error.message
    }
  }
}

// const imageFilter= function(req, file, cb){
//   console.log(file.mimetype);
//     if (file.mimetype.startsWith("image")) {
//       cb(null, true);
//     } else {
//       cb("Please upload only images.", false);
//     }
// };
// {fileFilter:imageFilter}

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

var uploadFile= multer({storage:storage})
module.exports= {uploadFile:uploadFile, driveFunctions: driveFunctions};