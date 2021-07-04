const { Sequelize }= require("sequelize");
const sequelize= new Sequelize("life-melody", "root", "ammar@1234",{
    host: 'localhost:3306',
    dialect: 'mysql'
});

(async () => {
    try{
        await sequelize.authenticate();
        console.log("--------> Connected to the database");

    } catch(err){
        console.error("--------> unable to connect to database because: ",err);
    }
})();



module.exports= {sequelize};