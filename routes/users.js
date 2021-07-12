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
    let phoneNumber= req.body.phoneNumber;
    let adress= req.body.adress || null;

    bcrypt.hash(password,15)
    .then((hashedPassword)=>{
        var newUser = {
            userName: userName,
            password: hashedPassword,
            phoneNumber: phoneNumber,
            adress: adress
        }
        console.log(newUser);
        // var user = new db(newUser);
        // user.save()
        // .then(item => {
        //     res.send("user saved in database");
        })
    })
    .then(()=>{
        
        res.send("User saved with hashed password");
    })
    .catch(error =>{
        res.send(error);
    })

    res.send({message:"hello Ammar from users"})
})

module.exports= {router};