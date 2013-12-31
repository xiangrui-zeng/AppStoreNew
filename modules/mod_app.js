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
        , description:"权限??"}
    , icon          : {
        big          : {type: String}
      , small        : {type: String}, description:"大小图标"}
    , screenshot      : [String]
    , category        : [String]
    , version         : {type: String, description:"版本"}
    , downloadId      : {type: String, description:"下载id"}
    , plistDownloadId : {type:String, description:"pList"}
    , open_date       : {type: Date, description:"公开日期"}
    , expire_date     : {type: Date, description:"过期时间"}
    , create_date     : {type: Date, description:"创建时间"}
    , create_user     : {type: String, description:"创建者"}
    , update_date     : {type: Date, description:"更新日期"}
    , update_user     : {type: String, description:"更新者"}
    , copyright       : {type: String, description:"版本"}
    , require         : {
        os: {type: String}
      , device: {type: String}
      , description:"系统 ios7.0 、设备要求iphone 5S"}
    , size            : {type: Number, description:"大小size"}
    , status          : {type: Number, description:"状态： 0、未申请 1、待审核 2、公开中 3、审核未通过 4、无效 ",default:0}
    , rank            : {type: Number, description:"评分分数",default: 0}
    , rankcount       : {type: Number, description:"评分次数",default: 0}
    , bundle_identifier :{type:String, description:"plist  标识"}
    , bundle_version  :{type:String, description:"plist"}
    , kind            :{type:String, description:"种类"}
    , downloadCount   :{type: Number, description:"下载数量"}
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

exports.updateRank = function (appId, rank, callback_) {
    var app = model();
    app.findByIdAndUpdate(appId, { rank: rank }, function (err, result) {
        callback_(err, result);
    });
};

exports.updateDownloadCount = function(appId_, dlCount_, callback_) {
  var app = model();
  app.findByIdAndUpdate(appId_, { downloadCount: dlCount_ }, function (err, result) {
    callback_(err, result);
  });
};

exports.find = function (appId, callback_) {
    var app = model();
    console.log("exports.find = funct   %s",appId);
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
    console.log("测试conditions_    "+condition_);
    app.find(condition_)
    .skip(options_.start || 0)
    .limit(options_.limit || 20)
    .sort(options_.sort)
    .exec(function(err, result){
      app.count(condition_).exec(function(err, count){
        callback_(err,{total:count,items:result});
      });
    });
};