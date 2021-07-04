const {Sequelize, DataTypes}= require("sequelize");
var sequelize= require("./dbCon").sequelize;

const Users= sequelize.define('Users',{
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


console.log(Users === sequelize.models.Users);