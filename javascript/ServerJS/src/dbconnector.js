const {Pool} = require('pg');

const connectionData = {
    user:'postgres',
    host:'postgres',
    database:'tiendita',
    password:'postgres',
    port:5432
}

const client = new Pool(connectionData)

module.exports = {client};