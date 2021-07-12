const {Sequelize, DataTypes, Model}= require("sequelize");
var sequelize= require("./dbCon").sequelize;

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
    password:{
        type: DataTypes.STRING,
        allowNull: false
    },
    phoneNumber:{
        type: DataTypes.INTEGER,
        unique: true
    },
    address:{
        type: DataTypes.STRING,
        allowNull: false

    }
},{
    freezeTableName: true
});

module.exports={Users}