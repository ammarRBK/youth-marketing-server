const { Sequelize }= require("sequelize");

const sequelize= new Sequelize("youthmarketing", "ammar", "ammar@1234",{
    host: 'mysql-87866-0.cloudclusters.net',
    port: '18698',
    dialect: 'mysql',
    logging: false
});



module.exports= {sequelize};