const { Sequelize }= require("sequelize");

const sequelize= new Sequelize("youthmarketing", "ammar", "ammar@1234",{
    host: 'mysql-97300-0.cloudclusters.net',
    port: '17442',
    dialect: 'mysql',
    logging: false
});



module.exports= {sequelize};