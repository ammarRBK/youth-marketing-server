const {Sequelize, DataTypes}= require("sequelize");
var sequelize= require("./dbCon").sequelize;


const Productions= sequelize.define('productions',{
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
        type: DataTypes.FLOAT,
        allowNull: false
    },
    availableUnits:{
        type: DataTypes.INTEGER
    },
    productDate:{
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    expirationDate:{
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    image:{
        type: DataTypes.CHAR(100)
    },
    imageId:{
        type: DataTypes.CHAR
    },
    productPrice:{
        type: DataTypes.FLOAT,
        allowNull: false
    },
    phoneNumber:{
        type: DataTypes.INTEGER
    },
    productOwner:{
        type: DataTypes.STRING(100),
        allowNull: false
    },
    productCategory: {
        type: DataTypes.STRING,
        allowNull: false
    }
},{
    freezeTableName: true
});

module.exports= {Productions};