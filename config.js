/** Common config for bookstore. */

require('dotenv').config();

let DB_URI = `postgresql://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@localhost:5432`;


if (process.env.NODE_ENV === "test") {
  DB_URI = `${DB_URI}/books-test`;
} else {
  DB_URI = process.env.DATABASE_URL || `${DB_URI}/books`;
}


module.exports = { DB_URI };