var express= require('express');
var app= express();
var router= express.Router();
var bcrypt= require('bcrypt');
var db= require('../database/usersModel').Users;
var cors= require('cors');
var corsOptions= require('../server').corsOptions;

var userSession= {};
var session= require('express-session');
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));

var corsOptions={
    "Access-Control-Allow-Origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "optionsSuccessStatus": 200
}


router.options('/signup',cors(corsOptions));
router.post('/signup',cors(corsOptions),(req,res)=>{
    let userName= req.body.userName;
    let password= req.body.password;
    let phoneNumber= req.body.phoneNumber || null;
    let address= req.body.address;

    bcrypt.hash(password,15)
    .then((hashedPassword)=>{
        var newUser = {
            userName: userName,
            password: hashedPassword,
            phoneNumber: phoneNumber,
            address: address
        }

        console.log(newUser);
        db.create(newUser).then(()=>{
            console.log("-------->done")
            
        })
    })
    .then(()=>{
        res.send({successMessage:"User saved with hashed password"});
    })
    .catch(error =>{
        res.send(error);
    })
});

router.options('/signin',cors(corsOptions));
router.post('/signin',cors(corsOptions),(req,res)=>{
    let phoneNumber= req.body.phoneNumber;
    let password= req.body.password;
    let deviceId= req.body.deviceId;

    db.findOne({
        where:{phoneNumber: phoneNumber}
    }).then(user=>{
        
        if(!user){
            res.send({message: "user is not in database"})
        }else{
            bcrypt.compare(password,user.password).then(result=>{
                if (result) {
                    userSession[req.body.deviceId]= {
                    userName: user.userName,
                    address: user.address, 
                    userId: user.userId
                    }
                    session[user.userId]= userSession[user.userId];
                    res.send({message: "user Authintecated",user: userSession[req.body.deviceId]});
                } else {
                    res.send({message: "wrong password"});
                }
            })
            .catch(err =>{
                console.log({message:"error in Comparing Password ", error: err});
            })
        }
    })
});

router.options('/checkloggedin',cors(corsOptions));
router.post('/checkloggedin',cors(corsOptions),(req,res)=>{
    for(let key in userSession){
        if(key === req.body.deviceId){
            res.send({message: "loggedin"});
        }
    }

    res.send({message: "not loggedin"});
})

router.options("/logout", cors(corsOptions));
router.post('/logout',cors(corsOptions),(req,res)=>{
    for(let key in userSession){
        if(key === req.body.deviceId){
            delete userSession[key];
            res.send({message: "logged out"});
        }
    }
});

router.options("/getsession", cors(corsOptions));
router.post('/getsession',cors(corsOptions),(req,res)=>{
    for(let key in userSession){
        if(key === req.body.deviceId){
            
            res.send({message: "authintecated", user: userSession[key]});
        }
    }
    res.send({message: "not authintecated"});
})

module.exports= {router,userSession,cors,corsOptions};