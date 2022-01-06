const { Sequelize }= require("sequelize");

const sequelize= new Sequelize("youthmarketing", "ammar", "ammar@1234",{
    host: 'mysql-65187-0.cloudclusters.net',
    port: '17010',
    dialect: 'mysql'
});



module.exports= {sequelize};