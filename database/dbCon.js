const { Sequelize }= require("sequelize");
const sequelize= new Sequelize("dbname", "dbusername","dbpassword",{
    host: 'localhost',
    dialect: 'mysql'
});

try{
    await sequelize.authenticate();
    console.log("--------> Connected to the database");

} catch(err){
    console.error("--------> unable to connect to database because: ",err);
}


module.exports= {sequelize};