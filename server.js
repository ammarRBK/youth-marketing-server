var express = require('express');
var app = express();
var path = require('path');
var fs= require('fs');
var bodyParser = require('body-parser');
var cors= require('cors')
app.use(cors({
  "Access-Control-Allow-Origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 204
}))

var products = require('./routes/products').router;
var users= require('./routes/users').router;
var db= require('./database/dbsetup');

// var session= require('express-session');
// app.use(session({
//   secret: 'keyboard cat',
//   resave: false,
//   saveUninitialized: true,
//   cookie: { secure: true }
// }));


// app.use(logger('dev'));
app.use(bodyParser.json({limit:"50mb"}));
app.use(bodyParser.urlencoded({limit:'50mb',extended:'true'}));
app.use(express.static(path.join(__dirname, './life-melody-server')));


app.use('/api/users', users);
app.use('/api/products',products);



app.listen(process.env.PORT ||3000,()=>{
  console.log("app is ready")
})

// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyD1fnhsRF_daPim_g50D4bz7Uf7h4kPkNg",
//   authDomain: "youth-marketing-server.firebaseapp.com",
//   projectId: "youth-marketing-server",
//   storageBucket: "youth-marketing-server.appspot.com",
//   messagingSenderId: "391850460375",
//   appId: "1:391850460375:web:b2967c9181a8ca4f769c92"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

app.get('/api',(req,res)=>{
  res.send({message:"hello Ammar"})
})

module.exports = app;