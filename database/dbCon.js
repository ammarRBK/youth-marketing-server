const { Sequelize }= require("sequelize");

const sequelize= new Sequelize("youthmarketing", "ammar", "ammar@1234",{
    host: 'mysql-78972-0.cloudclusters.net',
    port: '17182',
    dialect: 'mysql',
    logging: false
});



module.exports= {sequelize};