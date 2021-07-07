const {Sequelize, DataTypes, Model}= require("sequelize");
var sequelize= require("./dbCon").sequelize;


// class User extends Model{}
// User.init({
//     userId:{
//             type: DataTypes.INTEGER,
//             autoIncrement: true,
//             unique: true,
//             primaryKey: true
//         },
//         userName:{
//             type: DataTypes.STRING(100),
//             allowNull: false,
//             unique: true
//         },
//         address:{
//             type: DataTypes.STRING,
//             allowNull: false
//         },
//     },{
//     sequelize,
//     modelName: 'Users'
// });
const Users= sequelize.define('users',{
    userId:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        unique: true,
        primaryKey: true
    },
    userName:{
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    address:{
        type: DataTypes.STRING,
        allowNull: false

    }
},{
    freezeTableName: true
})


sequelize.sync()
    .then((result=>{
        console.log(result);
    }))
    .catch((err)=>{
        console.log(err);
    })

module.exports={Users}