var mongo       = smart.util.mongoose
  , conn        = smart.framework.connection
  , schema      = mongo.Schema;

var App = new schema({

    name: {type: String}  //名称
    , description: {type: String}           //详细介绍
    , memo: {type: String}                  //简介
    , release_note: {type: String}           //
    , appType: {type: String}               //应用设备的类型：iphone、ipad、winphone
    , permission: {
        admin: [String]                     //管理者权限
        , edit: [String]                      //编集权限
        , view: [String]                      //阅览权限
        , download: [String]                  //下载权限
    }, icon: {                               //图标
        big: {type: String}, small: {type: String}
    }, screenshot: [String]                  //截图（最多5张）
    , video: {type: String}                  //视频
    , category: [String]                    //分类
    , version: {type: String}               //版本
    , downloadId: {type: String}            //下载Id
    , plistDownloadId : {type:String}       // plist  下载id
    , pptfile: {type: String}            //pptfile 演示文件
    , open_date: {type: Date}             //公开日期
    , expire_date: {type: Date}           //过期
    , create_date: {type: Date}           //创建日期
    , create_user: {type: String}           //创建者
    , update_date: {type: Date}           //更新日期
    , update_user: {type: String}           //更新者
    , require: {
        os: {type: String}                  //系统要求
        , device: {type: String}              //设备要求
        , server: {type: String}              //服务器要求
    }, size: {type: Number}                      //大小
    , status: {type: Number}                 // 状态：-1、无效app 0、未公开 1、社内公开 2、社外限定公开 3、社外任意公开
    , editing : {type:Number}               //编辑中   0 、表示编辑中     1、表示编辑完成
    , rank: {type: Number}
    , support :{type:String}
    , notice : {type:String}
    , editstep :{type:Number}           //编辑进行的状态
    , bundle_identifier :{type:String}
    , bundle_version    :{type:String}
    , kind              :{type:String}
    , title             :{type:String}
    , admin_list : {type: schema.Types.Mixed}          //返回前台的 管理员信息
    , edit_list :    {type: schema.Types.Mixed}        //返回前台的 编辑者信息
    , view_list :  {type: schema.Types.Mixed}          //返回前台的 浏览者信息
    , download_list :  {type: schema.Types.Mixed}      //返回前台的 下载者信息
    , downloadCount :{type: Number}
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