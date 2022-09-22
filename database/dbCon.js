const { Sequelize }= require("sequelize");

const sequelize= new Sequelize("youthmarketing", "ammar", "ammar@1234",{
    host: 'mysql-88912-0.cloudclusters.net',
    port: '12604',
    dialect: 'mysql',
    logging: false
});



module.exports= {sequelize};