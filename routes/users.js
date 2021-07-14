var express= require('express');
var app= express();
var router= express.Router();
var bcrypt= require('bcrypt');
var db= require('../database/usersModel').Users;

var session= require('express-session');
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));



router.post('/signup',(req,res)=>{
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
        // var user = new db(newUser);
        // user.save()
        // .then(item => {
        //     res.send("user saved in database");
        // })
    })
    .then(()=>{
        res.send({successMessage:"User saved with hashed password"});
    })
    .catch(error =>{
        res.send(error);
    })
});


router.post('/signin',(req,res)=>{
    let userName= req.body.userName;
    let password= req.body.password;

    db.findOne({
        where:{userName: userName}
    }).then(user=>{
        console.log("-------->user: ",user)
        if(!user){
            res.send({message: "user is not in database"})
        }else{
            bcrypt.compare(password,user.password).then(result=>{
                if (result) {
                    var userSession={
                        userName: user.userName,
                        address: user.address
                    };
                    session.user= userSession;
                    res.send({message: "user Authintecated",user: userSession});
                } else {
                    res.send({message: "wrong password"});
                }
            })
            .catch(err =>{
                console.log("error in Comparing Password ", err);
            })
        }
    })
});

module.exports= {router};