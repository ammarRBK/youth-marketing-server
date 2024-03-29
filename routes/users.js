var express= require('express');
var app= express();
var router= express.Router();
var bcrypt= require('bcrypt');
var db= require('../database/usersModel').Users;
var cors= require('cors');

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
// encode the client password
    bcrypt.hash(password,15)
    .then((hashedPassword)=>{
        var newUser = {
            userName: userName,
            password: hashedPassword,
            phoneNumber: phoneNumber,
            address: address,
            email: email
        }
// save new user in the database
        db.create(newUser).then(()=>{
            console.log("-------->done")
            res.send({message:"User saved with hashed password"});
        }).catch(err=>{
            console.log('cannot add user to db--------->', err.message);
            res.send({message: 'validation error'})
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
// get mobile device id from client request object
    let deviceId= req.body.deviceId;
// search for the user
    db.findOne({
        where:{phoneNumber: phoneNumber}
    }).then(user=>{
 
        if(!user){
// user not found
            res.send({message: "user is not in database"})
        }else{
// check the password came from client if it equals the user password
            bcrypt.compare(password,user.password).then(result=>{
                if (result) {
// create user session object with device id as key value
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
                console.log(`-----------------> Password Compare ERROR \n`,err);
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
// make sure the password is correct then update the user with data come from client
        bcrypt.hash(req.body.oldPassword,15).then(oldPasswordHashed=>{
            newInfo.password= oldPasswordHashed;
            newInfo['address']= userSession[deviceId].address;
            newInfo.userName= newInfo.userName === '' ? userSession[deviceId].userName : newInfo.userName;
            newInfo.phoneNumber= newInfo.phoneNumber === '' ? userSession[deviceId].phoneNumber : newInfo.phoneNumber;
            newInfo.email= newInfo.email === null ? userSession[deviceId].email : newInfo.email;

            db.update(newInfo, {where:{userId: userSession[deviceId].userId}}).then(success=>{
            console.log('updated the user info------->',success);
            
            res.send({message: 'updated user info'})
            }).catch(err=>{
                console.log('couldnt update the user--------->', err.message);
                res.send({message: 'couldnt update the user'});
            })
        }).catch(err=>{
            console.log(err.message)
            res.send({message: 'cannot hash the password'})
        })
    }else{
        bcrypt.hash(newInfo.password,15).then(hashedPassword=>{
            newInfo.password= hashedPassword;
            newInfo['address']= userSession[deviceId].address;
            newInfo.userName= newInfo.userName === '' ? userSession[deviceId].userName : newInfo.userName;
            newInfo.phoneNumber= newInfo.phoneNumber === '' ? userSession[deviceId].phoneNumber : newInfo.phoneNumber;
            newInfo.email= newInfo.email === null ? userSession[deviceId].email : newInfo.email;
    
            db.update(newInfo, {where:{userId: userSession[deviceId].userId}}).then(success=>{
            console.log('updated the user info------->',success);
            res.send({message: 'updated user info'})
            }).catch(err=>{
                console.log('couldnt update the user--------->', err.message);
                res.send({message: 'couldnt update the user'});
            })
        }).catch(err=>{
            console.log(err.message)
            res.send({message: 'cannot hash password'})
        })
       
      
    }
}); 

router.options('/checkloggedin',cors(corsOptions));
router.post('/checkloggedin',cors(corsOptions),(req,res)=>{
    let deviceId= req.body.deviceId;

    let keys= Object.keys(userSession).length;
// check if there users logged in
    if(keys > 0){
// loop over session Object
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
// delete user session
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
// check if the phone number is stored in the database
router.options('/checkuser', cors(corsOptions));
router.post('/checkuser',cors(corsOptions), (req, res)=>{
    let phoneNumber= req.body.phoneNumber;
    db.findOne({
        where: {phoneNumber: phoneNumber}
    })
    .then(user=>{
        if(!user){
            res.send({message: 'user not in database'});
        }else{
            res.send({message: 'user in the database'})
        }
    }).catch(err=>{
        res.send({message: 'error while filtering'});
    })
});

router.options('/changepassword', cors(corsOptions));
router.post('/changepassword',cors(corsOptions), (req, res)=>{
    let newPassword= req.body.newPassword;
    let phoneNumber= req.body.phoneNumber;
// check password length if 8 or more hash the new password and update in the database
    if(newPassword.length < 8){
        res.send({message: 'please provide valid password'});
    } else {
// hash new password 
        bcrypt.hash(newPassword, 15).then(hashedPassword=>{
// update user info with new hashed password
            db.update({password: hashedPassword}, {where: {phoneNumber: phoneNumber}}).then(success =>{
                console.log('password updated ----> ', success);
                res.send({message: 'password changed'});
// error on updating password during database query
            }).catch(err =>{
                console.log('couldn’t update the password in the Database---->', err.message);
                res.send({message: 'password didnt update error in database'});
            })
// error during hash the new password
        }).catch(err =>{
            console.log('couldn’t hash the password', err);
            res.send({message: 'password did not hash'});
        })
    }
});

module.exports= {router,userSession,cors,corsOptions};