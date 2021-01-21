const Sequelize = require('sequelize');

require('dotenv').config();

let sequelize;

if (process.env.JAWSDB_URL) {
    sequelize = new Sequelize(process.env.JAWSDB_URL);
} else {
    sequelize = new Sequelize(process.env.DB_NAME,process.envDB_USER,process.env.DB_PW, {
        host: 'localhost',
        password: 'Corinthians10:13',
        dialect: 'mysql',
        port:3306
    });
}

module.exports = sequelize;