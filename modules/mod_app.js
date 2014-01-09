
"use strict";

var mongo       = smart.util.mongoose
  , conn        = smart.framework.connection
  , schema      = mongo.Schema;

var App = new schema({

    name          : {type: String, description:"名称"}
  , description   : {type: String, description:"详细信息"}
  , releaseNote   : {type: String, description:"更新信息"}
  , appType       : {type: String, description:"设备的类型：OS、android、PC "}
  , permission    : {
        admin      : [String]
      , edit       : [String]
      , view       : [String]
      , download   : [String]
      }
    , icon           : {
        big          : { type: String }
      , small        : { type: String }
      }
    , screenshot      : [String]
    , category        : [String]
    , version         : {type: String, description:"版本"}
    , downloadId      : {type: String, description:"下载id"}
    , plistDownloadId : {type:String, description:"pList"}
    , openAt         : {type: Date, description:"公开日期"}
    , expireAt       : {type: Date, description:"过期时间"}
    , copyright       : {type: String, description:"版权"}
    , editstep        : {type:Number,description:"编辑进行的状态"}
    , require         : {
        os: {type: String}
      , device: {type: String}
      }
    , size            : {type: Number, description:"大小size"}
    , status          : {type: Number, description:"状态： 0、未申? 1、待审核 2、公开中 3、审核未通过 4、无效 ",default:0}
    , rank            : {type: Number, description:"评分分数",default: 0}
    , rankcount       : {type: Number, description:"评分次数",default: 0}
    , bundleIdentifier : {type:String, description:"plist  标识"}
    , bundleVersion   : {type:String, description:"plist"}
    , kind            : {type:String, description:"plist种类  固定的",default: "software"}
    , downloadCount   : {type: Number, description:"下载数量"}
    , noticeMessage          : {type: String, description:"审核信息"}
    , noticeImage     : [String]
    , valid           : { type: Number, description: "删除 0:无效 1:有效", default: 1 }
    , createAt        : {type: Date, description:"创建时间"}
    , createBy        : {type: String, description:"创建者"}
    , updateAt        : {type: Date, description:"更新日期"}
    , updateBy        : {type: String, description:"更新者"}
    });

function model() {
  return conn.model("", "app", App);
}
//创建app
exports.create = function (app, callback) {
  var App = model();
  new App(app).save(function (err, result) {
    callback(err, result);
  });
};
//更新评分
exports.updateRank = function (appId, rank, rankCount, callback) {
  var app = model();
  app.findByIdAndUpdate(appId, { rank: rank, rankcount: rankCount }, function (err, result) {
    callback(err, result);
  });
};
//更新下载数量
exports.updateDownloadCount = function (appId, dlCount, callback) {
  var app = model();
  app.findByIdAndUpdate(appId, { downloadCount: dlCount}, function (err, result) {
    callback(err, result);
  });
};
/**
 * 查找app信息
 * @param {String} appId 应用标识
 * @param {Function} callback 回调函数，返回app信息
 */
exports.find = function (appId,callback) {
  var app = model();
  app.findOne({_id: appId}, function (err, result) {
    callback(err, result);
  });
};
/**
 * 通过appId获取app
 * @param {String} appId 应用标识
 * @param {Function} callback 回调函数，返回app信息
 */
exports.getAppsByIds = function (ids, callback) {
  var app = model();

  app.find({"_id": {$in: ids}}).exec(function (err, result) {
    callback(err, result);
  });
};
/**
 * app列表
 * @param {Object} list 列表
 * @param {Function} callback 回调函数，返回app列表
 */
exports.list = function (condition,options,callback) {
  var app = model();
  app.find(condition)
    .skip(options.start || 0)
    .limit(options.limit || 20)
    .sort(options.sort)
    .exec(function (err, result) {
      app.count(condition).exec(function (err, count) {
        callback(err, {total: count, items: result});
      });
    });
};

/**
 * 更新状态
 * @param code 数据库标识
 * @param appId 文档标识
 * @param app更新状态
 * @param callback 返回更新后的状态
 */
exports.update = function (code, appId, update, callback) {

  var App = model(code);

  App.findByIdAndUpdate(appId+"", update, function (err, result) {
    callback(err, result);
  });
};

/**
 * 获取App件数
 * @param {string} code 公司Code
 * @param {object} condition 条件
 * @param {function} callback 返回服务件数
 */

exports.total = function (code, condition, callback) {

  var App = model(code);

  App.count(condition).exec(function(err, count) {
    callback(err, count);
  });
};

exports.getList = function(code, condition, callback) {

  var App = model(code);
  console.log(condition);
  App.find(condition)
    .sort({createAt: +1})
    .exec(function(err, result) {
      callback(err, result);
    });
};