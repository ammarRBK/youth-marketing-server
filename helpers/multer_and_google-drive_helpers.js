var multer= require('multer');
var fs= require('fs');
var path= require('path');

var temp_image_name= '';
var downloadLink= '';
// function deletefiles(){
//   fs.readdir(directory, (err, files) => {
//     if (err) throw err;
  
//     for (const file of files) {
//       fs.unlink(path.join(directory, file), err => {
//         if (err) throw err;
//       });
//     }
//   });
// }

// deletefiles();


var storage= multer.diskStorage({
  destination: function (req,file,callback){
    callback(null, '.');
  },
  filename: function (req,file,callback){
    const filename= Date.now() + '-' + Math.round(Math.random() * 1E9) + '-' + file.originalname;
    temp_image_name= filename
    callback(null, filename);
  }
});

const {google}= require('googleapis');
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
  uploadFile: async function(fileName){
    // var filePath= path.join('.','/tempimages','/'+fileName)
    try {
      const response = await drive.files.create({
        requestBody: {
          name: temp_image_name, //This can be name of your choice
          mimeType: 'image/jpeg',
        },
        media: {
          mimeType: 'image/jpeg',
          body: fs.createReadStream(temp_image_name, (err, data)=>{
            if(err) throw err
          }),
        },
      });
  
      fs.unlink(temp_image_name, err=>{
        if (err) throw err
      })
      // drivefileId= response.data.id
      // console.log(response.data)
      return response.data;
    } catch (error) {
      console.log(error.message);
      return error.message
    }
  },
  getDownloadLink: async function(uploadedfileId){
    try{
      const fileId = uploadedfileId;
      await drive.permissions.create({
        fileId: fileId,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      });
  
      /* 
      webViewLink: View the file in browser
      webContentLink: Direct download link 
      */
      const result=await drive.files.get({
        fileId: fileId,
        fields: 'webViewLink, webContentLink',
      })
      return result.data
    }catch(error){
      if (error) throw error
    }
  },
  deleteFileFromDrive: async function(fileId) {
    try {
      const response = await drive.files.delete({
        fileId: fileId,
      });
      return  response.status;
    } catch (error) {
      console.log(error.message);
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
var name= {tempName: temp_image_name, downloadLink: downloadLink};
var uploadFile= multer({storage:storage})
module.exports= {uploadFile:uploadFile, driveFunctions: driveFunctions, name};