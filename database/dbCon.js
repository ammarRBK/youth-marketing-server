const { Sequelize }= require("sequelize");

const sequelize= new Sequelize("youthmarketing_teafrozen", "youthmarketing_teafrozen", "b66c205eaae4a51e5c904c3626c6e118fd1177c8",{
    host: '65t.h.filess.io',
    port: '3307',
    dialect: 'mysql',
    logging: false
});



module.exports= {sequelize};