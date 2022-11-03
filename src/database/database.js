import config from "../config";
const mariadb = require('mariadb');

const pool = mariadb.createPool({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
});

const getConnection = ()=>{
    return pool;
}

module.exports = {
    getConnection
};