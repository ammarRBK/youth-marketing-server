const { Sequelize }= require("sequelize");

const sequelize= new Sequelize("youthmarketing", "ammar", "ammar@1234",{
    host: 'mysql-72075-0.cloudclusters.net',
    port: '18794',
    dialect: 'mysql',
    logging: false
});



module.exports= {sequelize};