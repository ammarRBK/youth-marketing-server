// require datatypes object
const {Sequelize, DataTypes}= require("sequelize");
var sequelize= require("./dbCon").sequelize;

// create productions table with fields requierments
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
        defaultValue: null,
        type: DataTypes.DATEONLY   
    },
    expirationDate:{
        defaultValue: null,
        type: DataTypes.DATEONLY
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
        type: DataTypes.CHAR(50)
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
//don’t allow table name editing
    freezeTableName: true
});

// export productions table schema
module.exports= {Productions};