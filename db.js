/** Database config for the books db of Bookstore. */


const { Client } = require("pg");
const {DB_URI} = require("./config");

let db = new Client({
  connectionString: DB_URI
});

db.connect()
    .then(() => console.log('Connected to the Bookstore database'))
    .catch(err => console.error('Connection error', err));

module.exports = db;