var mongo       = smart.util.mongoose
  , conn        = smart.framework.connection
  , schema      = mongo.Schema;

var App = new schema({

      name          : {type: String, description:"名称"}
    , description   : {type: String, description:"??信息"}
    , release_note  : {type: String, description:"更新信息"}
    , appType       : {type: String, description:"??的?型：OS、android、PC "}
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
    , downloadId      : {type: String, description:"下?id"}
    , plistDownloadId : {type:String, description:"pList"}
    , open_date       : {type: Date, description:"公?日期"}
    , expire_date     : {type: Date, description:"?期??"}
    , create_date     : {type: Date, description:"?建??"}
    , create_user     : {type: String, description:"?建者"}
    , update_date     : {type: Date, description:"更新日期"}
    , update_user     : {type: String, description:"更新者"}
    , copyright       : {type: String, description:"版本"}
    , require         : {
        os: {type: String}
      , device: {type: String}
      }
    , size            : {type: Number, description:"大小size"}
    , status          : {type: Number, description:"状?： 0、未申? 1、待?核 2、公?中 3、?核未通? 4、无效 ",default:0}
    , rank            : {type: Number, description:"?分分数",default: 0}
    , rankcount       : {type: Number, description:"?分次数",default: 0}
    , bundle_identifier :{type:String, description:"plist  ??"}
    , bundle_version  :{type:String, description:"plist"}
    , kind            :{type:String, description:"??"}
    , downloadCount   :{type: Number, description:"下?数量"}
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