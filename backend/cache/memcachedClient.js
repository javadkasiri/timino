const Memcached = require("memcached");
const memcached = new Memcached("db1.timino.co:11211");

module.exports = memcached;
