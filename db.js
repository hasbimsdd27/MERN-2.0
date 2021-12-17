const mysql = require('mysql2')

const dbconfig ={
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASS,
    port:process.env.DB_PORT,
    database:process.env.DB_NAME
}

let connection;

const handleConnection = async () => {
    connection = mysql.createConnection(dbconfig)
    connection.connect((err)=>{
        if(err){
            console.log("error when connecting to db", err)
            setTimeout(handleConnection(),2000)
        }
    })
    connection.on('error', (err)=>{
        if(err.code ==="PROTOCOL_CONNECTION_LOST"){
handleConnection()
        }else{
throw err
        }
    })
}

const GetDBSession = () => connection

module.exports = {GetDBSession, handleConnection}