const { Sequelize }= require("sequelize");

const sequelize= new Sequelize("youthmarketing", "root", "ammar@1234",{
    host: 'localhost',
    dialect: 'mysql'
});



module.exports= {sequelize};