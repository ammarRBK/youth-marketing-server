const { Sequelize }= require("sequelize");

const sequelize= new Sequelize("sql12645429", "sql12645429", "x6sXFRtysd",{
    host: 'sql12.freemysqlhosting.net',
    port: '3306',
    dialect: 'mysql',
    logging: false
});



module.exports= {sequelize};