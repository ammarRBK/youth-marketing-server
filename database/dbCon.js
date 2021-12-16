const { Sequelize }= require("sequelize");

const sequelize= new Sequelize("youthmarketing", "ammar", "ammar@1234",{
    host: 'mysql-62375-0.cloudclusters.net',
    port: '10738',
    dialect: 'mysql'
});



module.exports= {sequelize};