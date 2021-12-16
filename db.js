const mysql = require('mysql2')

const dbconfig ={
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    port:process.env.DB_PORT,
    database:process.env.DB_NAME
}

let connection;

export const handleConnection = () => {
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

module.exports = connection