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
    userId: cliSession.userId
  };

  db.create(Production).then(()=>{
    res.send({message:"production added successfully"});
  }).catch(err=>{
    res.send({message:"cannot add the product"});
  })
  console.log(Production);
});


router.options('/deleteproduct',cors(corsOptions))
router.post('/deleteproduct',cors(corsOptions),(req,res)=>{
  let proId= req.body.productId;
  console.log('----------------->boooooodyyyy',req.body)
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
router.get('/getUserProducts',cors(corsOptions),(req,res)=>{
  db.findAll({
    where:{
      userId: cliSession.userId
    }
  }).then(pros=>{
    !pros ? res.send({message:"you dont have products yet"}) : res.send({userName: cliSession.userName, prods:JSON.stringify(pros)});
  })
})



module.exports= {router};