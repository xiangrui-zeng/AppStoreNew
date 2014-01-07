/**
 * @file 存取评论信息的module
 * @author lizheng
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var conn    = smart.framework.connection
  , mongo   = smart.util.mongoose
  , schema  = mongo.Schema;

var Comment = new schema({
    appId        : { type : String, description: "应用标识" }
  , comment      : { type : String, description: "评论内容" }
  , rank         : { type : Number, description: "评分" }
  , version      : { type : String, description: "应用版本" }
  , valid        : { type: Number,  description: "删除 0:无效 1:有效", default:1 }
  , createAt     : { type : Date,   description: "创建时间" }
  , createBy     : { type : String, description: "创建者" }
  , updateAt     : { type : Date,   description: "最终修改时间" }
  , updateBy     : { type : String, description: "最终修改者" }
  });

function model(code) {
  return conn.model(code, "Comment", Comment);
}

/**
 * 添加评论
 * @param {Object} comment 评论
 * @param {Function} callback 回调函数，返回新添加的评论
 */
exports.add = function(comment, callback){
  var Comment = model();
  new Comment(comment).save(function(err, result){
    callback(err, result);
  });
};

/**
 * 获取评价的总和及评价人数（用于计算平均评价值）
 * @param {String} appId 应用标识
 * @param {Function} callback 回调函数，返回评价的总和及评价人数
 */
exports.getRankTotal = function(appId, callback){
  var comment = model();
  comment.aggregate([
    { $match: {appId: appId} },
    { $group: {_id: "$appId", sum: {$sum: "$rank"}, count: {$sum: 1}} }
  ], function(err, result){
    callback(err, result ? result[0] : {});
  });
};

/**
 * 根据指定条件查询评论
 * @param {Object} condition 查询条件
 * @param {Number} start 跳过的文书数，默认为0
 * @param {Number} limit 返回的文书的上限数目，默认为20
 * @param {Function} callback 回调函数，返回评论列表
 */
exports.getList = function (condition, start, limit, callback) {
  var comment = model();
  comment.find(condition)
    .skip(start || 0)
    .limit(limit || 20)
    .sort({updateAt: -1})
    .exec(function (err, result) {
      comment.count(condition).exec(function (err, count) {
        callback(err, {totalItems: count, items: result});
      });
    });
};