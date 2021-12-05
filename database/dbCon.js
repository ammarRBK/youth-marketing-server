const { Sequelize }= require("sequelize");

const sequelize= new Sequelize("youthmarketing", "ammar", "ammar@1234",{
    host: 'mysql-60776-0.cloudclusters.net',
    dialect: 'mysql'
});



module.exports= {sequelize};