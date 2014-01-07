/**
 * @file 存取评论信息的controller
 * @author lizheng
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var async      = smart.util.async
  , context    = smart.framework.context
  , errors     = smart.framework.errors
  , log        = smart.framework.log
  , user       = smart.ctrl.user
  , modComment = require("../modules/mod_comment")
  , modApp     = require("../modules/mod_app");

/**
 * 添加评论
 * @param {Object} handler 上下文对象
 * @param {Function} callback 回调函数，返回新添加的评论
 */
exports.add = function (handler, callback){

  var params = handler.params;
  var uid = handler.uid.toString();

  var comment = {};
  comment.appId = params.appId;
  comment.comment = params.comment;
  comment.rank = params.rank;
  comment.version = params.version;
  comment.valid = 1;
  comment.createAt = new Date();
  comment.createBy = uid;
  comment.updateAt = comment.createAt;
  comment.updateBy = uid;

  var tasks = [];
  var taskCreateComment = function(cb){
    modComment.add(comment, function(err, result){
      comment = result._doc;
      cb(err);
    });
  };
  tasks.push(taskCreateComment);

  var taskGetRank = function(cb){
    modComment.getRankTotal(params.appId, function(err, rank){
      cb(err, rank);
    });
  };
  tasks.push(taskGetRank);

  var taskUpdateAppRank = function(rank, cb){
    var averageRank = rank.count === 0 ? 0 : (rank.sum/rank.count).toFixed(1) * 1;
    modApp.updateRank(params.appId, averageRank, rank.count, function(err){
      cb(err);
    });
  };
  tasks.push(taskUpdateAppRank);

  async.waterfall(tasks,function(err){

    if (err) {
      log.error(err, uid);
      callback(new errors.InternalServer(err));
      return;
    }

    return callback(err, comment);
  });
};

/**
 * 根据指定条件查询评论
 * @param {Object} handler 上下文对象
 * @param {Function} callback 回调函数，返回评论列表
 */
exports.getList = function(handler, callback){

  var params = handler.params;

  var tasks = [];
  // 获取评论
  var taskGetComments = function(cb){
    var condition = {
        appId: params.appId
      };
    if(params.range === "current") {
      condition.version = params.version;
    } else {
      condition.version = {$lt: params.version};
    }
    modComment.getList(condition, params.start, params.limit, function(err, result){
      cb(err, result);
    });
  };
  tasks.push(taskGetComments);

  // 获取评论用户
  var taskGetUsers = function(result, cb){
    async.forEach(result.items, function(cmt, cb2){
      var tempHandler = new context().create(handler.uid, handler.code, handler.lang);
      tempHandler.addParams("uid", cmt.createBy);
      user.get(tempHandler, function(err, user){
        cmt._doc.user = user;
        cb2(err);
      });
    }, function(err){
      cb(err, result);
    });
  };
  tasks.push(taskGetUsers);

  async.waterfall(tasks, function(err, result){

    if (err) {
      log.error(err, handler.uid);
      callback(new errors.InternalServer(err));
      return;
    }

    return callback(err, result);
  });
};

/**
 * 获取评价的总和及评价人数（用于计算平均评价值）
 * @param {Object} handler 上下文对象
 * @param {Function} callback 回调函数，返回评价的总和及评价人数
 */
exports.getRankTotal = function(handler, callback){

  modComment.getRankTotal(handler.params.appId, function(err, result){

    if (err) {
      log.error(err, handler.uid);
      callback(new errors.InternalServer(err));
      return;
    }

    callback(err, result);
  });
};
