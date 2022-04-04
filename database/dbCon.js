const { Sequelize }= require("sequelize");

const sequelize= new Sequelize("youthmarketing", "ammar", "ammar@1234",{
    host: 'mysql-74556-0.cloudclusters.net',
    port: '10738',
    dialect: 'mysql',
    logging: false
});



module.exports= {sequelize};