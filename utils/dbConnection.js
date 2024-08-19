const mssql = require('mssql');
const dotenv = require('dotenv');
dotenv.config('./ecosystem.config.js')
console.log('dbid', process.env.IP)
dotenv.config()
const config = {
    dirver: 'msnodesqlv8',
    server: process.env.IP,
    database: 'VOTE_DCL_2024',
    user:'sa',
    password: '@dm1n321#',
    options: {
        encrypt: false,
        enableArithAbort: false
    }
}

const pool = new mssql.ConnectionPool(config);

pool.on('error', err => {
    console.error(err)
})

async function connectionToDb(){
    try{
        await pool.connect();
        console.log('Connected to sql server database');
    }catch(err){
        console.error('Failed to connect to SQL Server database:', err);
        process.exit(1); // Exit the application with an error code
    }
}

connectionToDb()
module.exports = pool;
