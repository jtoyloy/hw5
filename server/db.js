const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  password: "lynn",
  host: "localhost",
  port: 5432,
  database: "api"
});

module.exports = pool;