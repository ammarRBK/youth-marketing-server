const { Sequelize }= require("sequelize");

const sequelize= new Sequelize("youthmarketing", "ammar", "ammar@1234",{
    host: 'mysql-66942-0.cloudclusters.net',
    port: '10149',
    dialect: 'mysql'
});



module.exports= {sequelize};