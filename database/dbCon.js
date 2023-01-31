const { Sequelize }= require("sequelize");

const sequelize= new Sequelize("youthmarketing", "ammar", "ammar@1234",{
    host: 'mysql-108678-0.cloudclusters.net',
    port: '10271',
    dialect: 'mysql',
    logging: false
});



module.exports= {sequelize};