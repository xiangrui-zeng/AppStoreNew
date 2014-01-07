/**
 * @file 存取下载履历的module
 * @author lizheng
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var mongo       = smart.util.mongoose
  , conn        = smart.framework.connection
  , schema      = mongo.Schema;

var Download = new schema({
    appId        : { type: String,  description: "应用标识" }
  , valid        : { type: Number,  description: "删除 0:无效 1:有效", default:1 }
  , createAt     : { type : Date,   description: "创建时间" }
  , createBy     : { type : String, description: "创建者" }
  , updateAt     : { type : Date,   description: "最终修改时间" }
  , updateBy     : { type : String, description: "最终修改者" }
  });

function model(code) {
  return conn.model(code, "Download", Download);
}

/**
 * 添加下载履历
 * @param {Object} download 下载履历
 * @param {Function} callback 回调函数，返回新添加的下载履历
 */
exports.add = function (download, callback) {
  var Download = model();
  new Download(download).save(function (err, result) {
    callback(err, result);
  });
};

/**
 * 获取某个App的下载次数
 * @param {String} appId 应用标识
 * @param {Function} callback 回调函数，返回下载次数
 */
exports.countByApp = function (appId, callback) {
  var download = model();
  download.count({appId: appId}).exec(function (err, count) {
    callback(err, count);
  });
};

/**
 * 获取某个用户下载过的App
 * @param {String} uid 用户标识
 * @param {Function} callback 回调函数，返回下载过的App
 */
exports.appIdsByUser = function (uid, callback) {
  var download = model();
  download.find({createBy: uid}).distinct("appId", function (err, ids) {
    callback(err, ids);
  });
};