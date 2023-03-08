const { Sequelize }= require("sequelize");

const sequelize= new Sequelize("youthmarketing", "ammar", "ammar@1234",{
    host: 'mysql-114537-0.cloudclusters.net',
    port: '19999',
    dialect: 'mysql',
    logging: false
});



module.exports= {sequelize};