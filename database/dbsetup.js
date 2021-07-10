var sequelize= require('./dbCon').sequelize;
var users= require('./usersModel');
var productions= require('./productionsModel');

const Users= users.Users;
const Productions= productions.Productions;

Users.hasMany(Productions,{
    foreignKey:{
        name: 'userId'
    }
});

Productions.belongsTo(Users);

sequelize.sync()
    .then((result=>{
        console.log(result);
    }))
    .catch((err)=>{
        console.log(err);
})