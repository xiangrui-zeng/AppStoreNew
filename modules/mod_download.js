var mongo       = smart.util.mongoose
  , conn        = smart.framework.connection
  , schema      = mongo.Schema;
var Download = new schema({
    app_id : {type:String}
    , create_at: { type: Date, default: Date.now }
    , ip    : {type:String}
    , create_user :{type:String}
    , type  : {type:String}
    , device : {type:String}
});

function model() {
  return conn.model("", "download", Download);
}

exports.create = function (down_, callback_) {
    var app = model();
    new app(down_).save(function (err, result) {
        callback_(err, result);
    });
};

exports.count = function(app_id, callback_){
    var app = model();
    app.count({app_id: app_id}).exec(function(err, count){
        callback_(err,count);
    });
};

exports.appIdsByUser = function(uid_, callback_){
    var download = model();
    download.find({create_user:uid_}).distinct('app_id',function(err,ids){
        callback_(err, ids);
    });
};