const { Sequelize }= require("sequelize");

const sequelize= new Sequelize("youthmarketing", "ammar", "ammar@1234",{
    host: 'mysql-112608-0.cloudclusters.net',
    port: '10013',
    dialect: 'mysql',
    logging: false
});



module.exports= {sequelize};