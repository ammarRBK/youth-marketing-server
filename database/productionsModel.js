const {Sequelize, DataTypes}= require("sequelize");
var sequelize= require("./dbCon").sequelize;


const Productions= sequelize.define('productions',{
    productId:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        unique: true
    },
    userId:{
        type: DataTypes.INTEGER,
        unique: true,
        forignKey: true
    },
    productTitle:{
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: false
    },
    productDisciption:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    productQuantity:{
        type: DataTypes.FLOAT
    },
    productDate:{
        type: DataTypes.DATEONLY
    },
    expirationDate:{
        type: DataTypes.DATEONLY
    }
},{
    freezeTableName: true
});

module.exports= Productions