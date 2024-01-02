// multer library to deal with product image files
var multer= require('multer');
var fs= require('fs');
var path= require('path');

var temp_image_name= '';
var downloadLink= '';

// initiate multer settings by creating the dist path and file name
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
// google drive api connection settings
const {google}= require('googleapis');

const authKeyFilePath= 'helpers/static-factor-340820-0d1718039501.json';
const scopes= ['https://www.googleapis.com/auth/drive'];

const oauth2Client = new google.auth.GoogleAuth({
  keyFilename: authKeyFilePath,
  scopes: scopes
})

const drive = google.drive({
  version: 'v3',
  auth: oauth2Client,
});


const driveFunctions= {
  uploadFile: async function(fileName){
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
        }
      });
  
      fs.unlink(temp_image_name, err=>{
        if (err) throw err
      })
      return response.data;
    } catch (error) {
      console.log('-------------> ERROR',error.message)
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


var name= {tempName: temp_image_name, downloadLink: downloadLink};
var uploadFile= multer({storage:storage})
module.exports= {uploadFile:uploadFile, driveFunctions: driveFunctions, name};