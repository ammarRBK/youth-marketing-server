const { Sequelize }= require("sequelize");

const sequelize= new Sequelize("youthmarketing", "ammar", "ammar@1234",{
    host: 'mysql-79695-0.cloudclusters.net',
    port: '18802',
    dialect: 'mysql',
    logging: false
});



module.exports= {sequelize};