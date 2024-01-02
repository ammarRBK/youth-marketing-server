// import sequelize constructor from dbCon file
var sequelize= require('./dbCon').sequelize;
var users= require('./usersModel');
var productions= require('./productionsModel');
//connect tables together using foreignKey
const Users= users.Users;
const Productions= productions.Productions;

Users.hasMany(Productions,{
    foreignKey:{
        name: 'userId'
    }
});

Productions.belongsTo(Users);
//start database connection
sequelize.sync()
    .then((result=>{
        console.log("Database Connection Successed");
    }))
    .catch((err)=>{
        console.log(err);
})