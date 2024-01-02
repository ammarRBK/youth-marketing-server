var express= require('express');
var app= express();

var router= express.Router();
// require productions table schema 
var db= require('../database/productionsModel').Productions;
// multer settings constructor
var uploadFile= require('../helpers/multer_and_google-drive_helpers').uploadFile;
// drive functions (uplaod and delete files)
var drive= require('../helpers/multer_and_google-drive_helpers').driveFunctions;
var tempName= require('../helpers/multer_and_google-drive_helpers').name.tempName;

// cors settings for contacting with client 
var cors= require('./users').cors;
var corsOptions= {
  "Access-Control-Allow-Origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "optionsSuccessStatus": 200,
  "Content-Type": "multipart/form-data"
};
// get session to user details with new products details
var cliSession= require('./users').userSession;
var session= require('express-session');
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));

//using mukter to prepare a single file to uplaod image to google drive
router.options('/addProduct',uploadFile.single('productImage'),cors(corsOptions))
router.post('/addProduct',uploadFile.single('productImage'),cors(corsOptions),async (req,res)=>{
  var filename= tempName;
// this var runs uploadFile to Drive function and store the response came from the API 
  var uploadDriveResult= await drive.uploadFile(filename)
// gets downloadableLink
  const downloadableLink= await drive.getDownloadLink(uploadDriveResult.id)
// new product details
  let Production= {
    productTitle: req.body.productTitle,
    productDisciption: req.body.productDescription,
    productQuantity: parseFloat(req.body.productQuantity),
    availableUnits: req.body.availableUnits || 0,
    productDate: req.body.productDate != '' ? req.body.productDate : null,
    expirationDate: req.body.expirationDate != '' ? req.body.expirationDate: null,
    image: downloadableLink.webContentLink,
    imageId: uploadDriveResult.id,
    productPrice: parseFloat(req.body.productPrice),
    phoneNumber: cliSession[req.body.deviceId].phoneNumber,
    userId: cliSession[req.body.deviceId].userId,
    productOwner: cliSession[req.body.deviceId].userName,
    productCategory: req.body.productCategory
  };
// save product in the database
  db.create(Production).then(()=>{
    res.send({message:"production added successfully"});
  }).catch(err=>{
    console.log('----------->', Production.productDate);
    console.log("Error adding the product \n",err+"\n")
    res.send({Error:err,message:"cannot add the product"});
  })
});


router.options('/deleteproduct',cors(corsOptions))
router.post('/deleteproduct',cors(corsOptions),(req,res)=>{
// get product id and product’s image id from request body
  let imageId= req.body.imageId;
  let proId= req.body.productId;
// delete product record from the database 
  db.destroy({
    where:{
      id: proId
    }
  }).then(success=>{
    console.log('------->deleted \n',success);
// if deletion success delete image from google drive 
    drive.deleteFileFromDrive(imageId);
    res.send({message: "Product deleted"});
  }).catch(err=>{
    console.log("cannot delete '\n'",err);
    res.send({message: "cannot delete Product"})
  })
});

router.options('/editproduct', cors(corsOptions))
router.post('/editproduct', cors(corsOptions),(req,res)=>{
  let proId= req.body.productId;
// new details for the product
  let editedProduct= {
    productTitle: req.body.productTitle,
    productDisciption: req.body.productDisciption,
    productQuantity: parseFloat(req.body.productQuantity),
    availableUnits: req.body.availableUnits || 0,
    productDate: req.body.productDate !== null ? new Date(req.body.productDate) : null,
    expirationDate: req.body.expirationDate !== null ? new Date(req.body.expirationDate) : null,
    image: req.body.image,
    imageId: req.body.imageId,
    productPrice: parseFloat(req.body.productPrice),
    phoneNumber: req.body.phoneNumber,
    userId: req.body.userId,
    productOwner: req.body.productOwner,
    productCategory: req.body.productCategory
  }
// update product 
  db.update(editedProduct,{
    where:{
      id: proId
    }
  }).then(success=>{
    console.log("----->Edited '\n'",success)
// send the product after edition to the client
    db.findOne({where:{
      id: proId
    }}).then(product=>{
      res.send({message: "Product Edited successfully", product: product});
    }).catch(err=>{
      console.log('cannot find the product',err.message)
      res.send({message: "cannot Edit"})
    })
    
  }).catch(err=>{
    console.log("-----> cannot Edit '\n'",err)
    res.send({message: "cannot Edit"})
  })

});

router.options('/editimageproduct', uploadFile.single('productImage'), cors(corsOptions));
router.post('/editimageproduct',  uploadFile.single('productImage'), cors(corsOptions), async(req,res)=>{
  let productId= req.body.productId;
  var filename= tempName;
  
  var uploadDriveResult= await drive.uploadFile(filename)
  const downloadableLink= await drive.getDownloadLink(uploadDriveResult.id);

  let imageObject={
    image: downloadableLink.webContentLink,
    imageId: uploadDriveResult.id
  }
// delete old image from the drive using the id came from client
  drive.deleteFileFromDrive(req.body.oldImageId);
// update the image stored with it’s product
  db.update(imageObject, {
    where:{
      id: productId
    }
  }).then(success=>{
    console.log('upated product image successfully----->',success);
// send the updated product to the client
    db.findOne({where:{
      id: productId
    }}).then(product=>{
      res.send({message: 'upated product image successfully', product: product});
    }).catch(err=>{
      console.log('cannot find user',err.message)
      res.send({message: "cannot find user"})
    })
    
  }).catch(err=>{
    console.log('cannot update the image because---->',err.message);
    res.send({message: 'cannot update the image'});
  })
});
// sends all products to the client
router.options('/getproducts',cors(corsOptions))
router.get('/getproducts',cors(corsOptions),(req,res)=>{
  var prods=[];
  db.findAll().then(productsArr=>{
    if(productsArr.length > 0){
      productsArr.forEach((product)=>{
        let productObj={
          id: product.id,
          productTitle: product.productTitle,
          productDisciption: product.productDisciption,
          productQuantity: product.productQuantity,
          availableUnits: product.availableUnits,
          productDate: product.productDate,
          expirationDate: product.expirationDate,
          image: product.image,
          imageId: product.imageId,
          productPrice: product.productPrice,
          phoneNumber: product.phoneNumber,
          userId: product.userId,
          productOwner: product.productOwner,
          productCategory: product.productCategory
        };
        // productObj.image= typeof(product.image.data);
        // let imagedata= JSON.stringify(product.image)
          // let BetoA= btoa(imagedata.data.reduce((data, byte) => data + String.fromCharCode(byte), ''));

          // productObj.image= blobToImage(product.image)
          // 'data:image/jpeg;base64,' + hexToBase64(product.image.toString('binary'))
          // `data:image/jpeg;base64,${product.image.toString('base64')}`;
          // `data:image/jpeg;base64,${Buffer.from(JSON.parse(imagedata)).toString("base64")}`;
          prods.push(productObj);
      })
      res.send(prods);
    }else{
      res.send(prods);
    }
    });
  
})
// get only products belongs the user 
router.options('/getUserProducts',cors(corsOptions))
router.post('/getUserProducts',cors(corsOptions),(req,res)=>{
  let deviceId= req.body.deviceId
// check if there is a user session
  if(Object.keys(cliSession).length > 0){
// loop over session objects
    for(let key in cliSession){
// if client device id is stored in session 
      if(key === deviceId){
        db.findAll({
          where:{
            userId: cliSession[key].userId
          }
        }).then(pros=>{
// if no products found send a message to the client, if there is products send them
          pros.length === 0 ? res.send({userName: cliSession[key].userName,message:"you dont have products yet"}) : res.send({userName: cliSession[key].userName, prods:JSON.stringify(pros)});
        })
      }
    }
  }else{
    res.send({message:"you dont have products yet"})
  }
 
})



module.exports= {router};