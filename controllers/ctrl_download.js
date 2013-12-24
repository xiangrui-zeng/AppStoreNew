var download = require("../modules/mod_download.js");
var app = require("../modules/mod_app.js");
var async = smart.util.async;
var app      = require("../modules/mod_app.js");
var async    = smart.util.async;

exports.create = function (data_, callback_){
  var down_ = data_;

  var tasks = [];

  var task_createDlInfo = function(cb){
    download.create(down_, function(err, result){
      err = err ? new error.InternalServer(err) : null;
      if (err) {
        return callback_(err);
      } else {
        cb(err, result);
      }
    });
  };
  tasks.push(task_createDlInfo);

  var task_updateDLCount = function(result, cb){
    var appId = down_.app_id;
    download.count(appId, function(err, count){
      app.updateDownloadCount(appId, count, function(err, _app){
        err = err ? new error.InternalServer(err) : null;
        if (err) {
          return callback_(err);
        } else {
          cb(err, result);
        }
      });
    });
  };
  tasks.push(task_updateDLCount);


  async.waterfall(tasks,function(err,result){
    return callback_(err, result);
  });
};