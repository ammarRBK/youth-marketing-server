var express= require('express');
var app= express();
var router= express.Router();
var db= require('../database/productionsModel').Productions;
var uploadFile= require('./../multer/multer_helper');
var cors= require('./users').cors;
var corsOptions= {
  "Access-Control-Allow-Origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "optionsSuccessStatus": 200,
  "Content-Type": "multipart/form-data"
};

var cliSession= require('./users').userSession;
var session= require('express-session');
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));

router.options('/addProduct',uploadFile.single('productImage'),cors(corsOptions))
router.post('/addProduct',uploadFile.single('productImage'),cors(corsOptions),(req,res)=>{
  let Production= {
    productTitle: req.body.productTitle,
    productDisciption: req.body.productDescription,
    productQuantity: parseFloat(req.body.productQuantity),
    availableUnits: req.body.availableUnits || 0,
    productDate: new Date(req.body.productDate) || null,
    expirationDate: new Date(req.body.expirationDate) || null,
    image: req.file,
    productPrice: parseFloat(req.body.productPrice),
    userId: cliSession[req.body.deviceId].userId
  };

  db.create(Production).then(()=>{
    res.send({message:"production added successfully"});
  }).catch(err=>{
    console.log("Error adding the product \n",err+"\n")
    res.send({Error:err,message:"cannot add the product"});
  })
});


router.options('/deleteproduct',cors(corsOptions))
router.post('/deleteproduct',cors(corsOptions),(req,res)=>{
  let proId= req.body.productId;
  db.destroy({
    where:{
      id: proId
    }
  }).then(success=>{
    console.log('------->deleted \n',success);
    res.send({message: "Product deleted"});
  }).catch(err=>{
    console.log("cannot delete '\n'",err);
    res.send({message: "cannot delete Product"})
  })
});

router.options('/editProduct',cors(corsOptions))
router.post('/editProduct',cors(corsOptions),(req,res)=>{
  let proId= req.body.productId;
  let editedProduct= {
    productTitle: req.body.productTitle,
    productDisciption: req.body.productDisciption,
    productQuantity: parseFloat(req.body.productQuantity),
    availableUnits: req.body.availableUnits || 0,
    productDate: new Date(req.body.productDate) || null,
    expirationDate: new Date(req.body.expirationDate) || null,
    image: req.body.image,
    productPrice: req.body.productPrice,
    userId: cliSession.userId
  }

  db.update(editedProduct,{
    where:{
      id: proId
    }
  }).then(success=>{
    console.log("----->Edited '\n'",success)
    res.send({message: "Product Edited successfully"});
  }).catch(err=>{
    console.log("-----> cannot Edit '\n'",err)
    res.send({message: "cannot Edit"})
  })

});

router.options('/getproducts',cors(corsOptions))
router.get('/getproducts',cors(corsOptions),(req,res)=>{
  db.findAll().then(pro=>{
    res.send(JSON.stringify(pro));
  })
})

router.options('/getUserProducts',cors(corsOptions))
router.post('/getUserProducts',cors(corsOptions),(req,res)=>{
  let deviceId= req.body.deviceId
  if(Object.keys(cliSession).length > 0){
    for(let key in cliSession){
      if(key === deviceId){
        db.findAll({
          where:{
            userId: cliSession[key].userId
          }
        }).then(pros=>{
          
          pros.length === 0 ? res.send({userName: cliSession[key].userName,message:"you dont have products yet"}) : res.send({userName: cliSession[key].userName, prods:JSON.stringify(pros)});
        })
      }
    }
  }else{
    res.send({message:"you dont have products yet"})
  }
 
})



module.exports= {router};