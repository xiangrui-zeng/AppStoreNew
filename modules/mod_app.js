var mongo       = smart.util.mongoose
  , conn        = smart.framework.connection
  , schema      = mongo.Schema;

var App = new schema({

      name          : {type: String, description:"名称"}
    , description   : {type: String, description:"详细信息"}
    , release_note  : {type: String, description:"更新信息"}
    , appType       : {type: String, description:"设备的类型：OS、android、PC "}
    , permission    : {
          admin      : [String]
        , edit       : [String]
        , view       : [String]
        , download   : [String]
        }
    , icon          : {
        big          : {type: String}
      , small        : {type: String}}
    , screenshot      : [String]
    , category        : [String]
    , version         : {type: String, description:"版本"}
    , downloadId      : {type: String, description:"下载id"}
    , plistDownloadId : {type:String, description:"pList"}
    , open_date       : {type: Date, description:"公开日期"}
    , expire_date       : {type: Date, description:"过期时间"}
    , create_date     : {type: Date, description:"创建时间"}
    , create_user     : {type: String, description:"创建者"}
    , update_date     : {type: Date, description:"更新日期"}
    , update_user     : {type: String, description:"更新者"}
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
    , bundle_identifier : {type:String, description:"plist  标识"}
    , bundle_version  : {type:String, description:"plist"}
    , kind            : {type:String, description:"种类"}
    , downloadCount   : {type: Number, description:"下载数量"}
    , notice          : {type: String, description:"审核信息"}
    , noticeimage     : [String]
});

function model() {
  return conn.model("", "app", App);
}

exports.create = function (app_, callback_) {
    var app = model();
    new app(app_).save(function (err, result) {
        callback_(err, result);
    });
};
//更新评分
exports.updateRank = function (appId, rank, rankCount, callback_) {
    var app = model();
    app.findByIdAndUpdate(appId, { rank: rank, rankcount: rankCount }, function (err, result) {
        callback_(err, result);
    });
};
//更新下载数量
exports.updateDownloadCount = function(appId_, dlCount_, callback_) {
  var app = model();
  app.findByIdAndUpdate(appId_, { downloadCount: dlCount_ }, function (err, result) {
    callback_(err, result);
  });
};

exports.find = function (appId, callback_) {
    var app = model();
    app.findOne({_id:appId}, function (err, result) {
        callback_(err, result);
    });
};

exports.getAppsByIds = function(ids_, callback_){
  var app = model();

  app.find({'_id': {$in: ids_}}).exec(function(err, result){
    callback_(err, result);
  });
};

exports.list = function (condition_, options_, callback_) {
  var app = model();
    app.find(condition_)
    .skip(options_.start || 0)
    .limit(options_.limit || 20)
    .sort({update_date: -1})
    .exec(function(err, result){
      app.count(condition_).exec(function(err, count){
        callback_(err,{total:count,items:result});
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
exports.update = function(code, appId, update, callback) {

  var App = model(code);

  App.findByIdAndUpdate(appId+"", update, function(err, result) {
    callback(err, result);
  });
};