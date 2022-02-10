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
        type: DataTypes.DATEONLY
    },
    expirationDate:{
        type: DataTypes.DATEONLY
    },
    image:{
        type: DataTypes.CHAR(100)
    },
    productPrice:{
        type: DataTypes.FLOAT,
        allowNull: false
    }
},{
    freezeTableName: true
});

module.exports= {Productions};