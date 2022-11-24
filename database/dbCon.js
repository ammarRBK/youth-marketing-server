const { Sequelize }= require("sequelize");

const sequelize= new Sequelize("youthmarketing", "ammar", "ammar@1234",{
    host: 'mysql-90549-0.cloudclusters.net',
    port: '18762',
    dialect: 'mysql',
    logging: false
});



module.exports= {sequelize};