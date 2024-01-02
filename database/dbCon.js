const { Sequelize }= require("sequelize");
// sequelize constructer contains database connection parameters (database’s user,password,host and port) 
const sequelize= new Sequelize("youthmarketing_hourpupil", "youthmarketing_hourpupil", "5221a3e52a84f8ee968dfb5fd6539ee36154b091",{
    host: '8ax.h.filess.io',
    port: '3307',
    dialect: 'mysql',
    logging: false
});


// export constructer
module.exports= {sequelize};