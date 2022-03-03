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
    let phoneNumber= req.body.phoneNumber;
    let address= req.body.address;
    let email= req.body.email || null;

    bcrypt.hash(password,15)
    .then((hashedPassword)=>{
        var newUser = {
            userName: userName,
            password: hashedPassword,
            phoneNumber: phoneNumber,
            address: address,
            email: email
        }

        console.log(newUser);
        db.create(newUser).then(()=>{
            console.log("-------->done")
            res.send({message:"User saved with hashed password"});
        }).catch(err=>{
            console.log('cannot add user to db--------->', err.message);
            res.send({message: 'cannot add user'})
        })
    })
    .catch(error =>{
        console.log('cannot add user from hash-------->',error)
        res.send({message: 'cannot add user'})
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
                    userSession[deviceId]= {
                    userName: user.userName,
                    address: user.address,
                    phoneNumber: user.phoneNumber, 
                    userId: user.userId,
                    password: user.password,
                    email: user.email
                    }
                    session[user.userId]= userSession[user.userId];
                    res.send({message: "user Authintecated",user: userSession[deviceId]});
                } else {
                    res.send({message: "wrong password"});
                }
            })
            .catch(err =>{
                res.send({message:"error in Comparing Password ", error: err});
            })
        }
    })
});

router.options('/editprofile',cors(corsOptions));
router.post('/editprofile',cors(corsOptions),(req,res)=>{
    let deviceId= req.body.deviceId;

    let newInfo={
        userName: req.body.newUserName,
        password: req.body.newPassword,
        phoneNumber: req.body.newPhoneNumber,
        email: req.body.newEmail
    }

    if(newInfo.password === ""){
        newInfo.password= userSession[deviceId].password;
        newInfo['address']= userSession[deviceId].address;
        newInfo.userName= newInfo.userName === '' ? userSession[deviceId].userName : newInfo.userName;
        newInfo.phoneNumber= newInfo.phoneNumber === '' ? userSession[deviceId].phoneNumber : newInfo.phoneNumber;
        newInfo.email= newInfo.email === null ? userSession[deviceId].email : newInfo.email;

        res.send(JSON.stringify(updateUser(newInfo, deviceId)));
    }
    
    bcrypt.hash(newInfo.password, 15).then(hashedPassword=>{
        newInfo.password= hashedPassword;
        newInfo['address']= userSession[deviceId].address;
        newInfo.userName= newInfo.userName === '' ? userSession[deviceId].userName : newInfo.userName;
        newInfo.phoneNumber= newInfo.phoneNumber === '' ? userSession[deviceId].phoneNumber : newInfo.phoneNumber;
        newInfo.email= newInfo.email === null ? userSession[deviceId].email : newInfo.email;

        res.send(JSON.stringify(updateUser(newInfo, deviceId)));
    })

});

function updateUser(newInfo, deviceId){
    db.update(newInfo, {where:{userId: userSession[deviceId].userId}}).then(success=>{
        console.log('updated the user info------->',success);
        return {message: 'updated user info'};
    }).catch(err=>{
        console.log('couldnt update the user--------->', err);
        return {message: 'couldnt update the user'};
    })
}

router.options('/checkloggedin',cors(corsOptions));
router.post('/checkloggedin',cors(corsOptions),(req,res)=>{
    let deviceId= req.body.deviceId;
    let keys= Object.keys(userSession).length;
    if(keys > 0){
        for(const device in userSession){
            console.log("ديفايس ايديييييييي---------- \n", deviceId)
            if(device === deviceId){
                res.send({message: "loggedin"});
                return;
            }
        }
        res.send({message: "not loggedin"});
    }else{
        res.send({message: "not loggedin"});
    }
    
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

router.options("/checkoldpassword", cors(corsOptions));
router.post('/checkoldpassword',cors(corsOptions),(req,res)=>{
    let keys= Object.keys(userSession).length;
    if(keys > 0){
        for(let key in userSession){
            if(key === req.body.deviceId){
                bcrypt.compare(req.body.password,userSession[key].password).then(result=>{
                    if (result) {
                        res.send({message: "authintecated"});
                        return; 
                    } else {
                        res.send({message: "wrong password"});
                    }
                })
                .catch(err =>{
                    res.send({message:"error in Comparing Password ", error: err});
                })
                
            }else{
                res.send({message: "not authintecated"});
            }
        }
    }else{
        res.send({message: "not authintecated"});
    }
})

module.exports= {router,userSession,cors,corsOptions};