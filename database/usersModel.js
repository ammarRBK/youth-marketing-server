const {Sequelize, DataTypes}= require("sequelize");
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
        type: DataTypes.CHAR(50),
        allowNull: false,
        unique: true
    },
    address:{
        type: DataTypes.STRING,
        allowNull: false

    },
    email:{
        type: DataTypes.STRING(150),
        allowNull: true
    }
},{
    freezeTableName: true
});

module.exports={Users}