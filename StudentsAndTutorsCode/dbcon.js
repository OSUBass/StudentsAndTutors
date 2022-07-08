var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_howed',
  password        : '6503zaps',
  database        : 'cs340_howed',
  multipleStatements : 'true'
});

module.exports.pool = pool;
