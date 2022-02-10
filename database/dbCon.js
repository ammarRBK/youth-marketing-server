const { Sequelize }= require("sequelize");

const sequelize= new Sequelize("youthmarketing", "ammar", "ammar@1234",{
    host: 'mysql-67945-0.cloudclusters.net',
    port: '18213',
    dialect: 'mysql',
    logging: false
});



module.exports= {sequelize};