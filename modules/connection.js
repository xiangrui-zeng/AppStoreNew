<<<<<<< Updated upstream
/**
 * Created by yt on 13-12-23.
 */
var mongo = smart.util.mongoose
  , util = smart.lang.util
  , log = smart.framework.log
  , dbconf = process.env['TEST'] ? require('config').testdb : require('config').db;

//连接MongoDB

var __connection;

module.exports = function(){
  //无连接
  if(!__connection){
    log.out('info','Create a connection');
    return createConnection();
  }

  //连接断开
  if(__connection.readyState == 0){
    log.out('info','Re-new the connection');
=======

/**
 *
 */
var mongo   = smart.util.mongoose
  , util    = smart.framework.util
  , log     = smart.framework.log
  , dbconf  = process.env['TEST'] ? require('config').testdb : require('config').db;

/**
 * Mongodb连接实例
 */
var __connection;


module.exports = function() {

  // 无连接
  if (!__connection) {
    log.out('info', 'Create a connection');
    return createConnection();
  }

  // 连接被断开
  if (__connection.readyState == 0) {
    log.out('info', 'Re-new the connection');
>>>>>>> Stashed changes
    return createConnection();
  }

  return __connection;
<<<<<<< Updated upstream
}

function createConnection(){
  __connection = mongo.createConnection(
  util.format('mongodb://%s:%d/%s', dbconf.host, dbconf.port, dbconf.dbname)
    , {server: {poolSize: dbconf.pool}}
  );
  log.out('info','The connection pool size of '+dbconf.pool);
  return __connection;
}
=======
};

/**
 * 创建一个新的连接
 */
function createConnection() {
  __connection = mongo.createConnection(
    util.format('mongodb://%s:%d/%s', dbconf.host, dbconf.port, dbconf.dbname), {server: {poolSize: dbconf.pool}}
  );

  log.out('info', 'The connection pool size of ' + dbconf.pool);
  return __connection;
}
>>>>>>> Stashed changes
