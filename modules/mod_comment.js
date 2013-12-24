var mongo   = smart.util.mongoose
  , conn    = require('./connection')
  , schema  = mongo.Schema;

var Comment = new schema({
    appId: {type: String}
  , comment: {type: String}
  , rank: {type: Number}
  , version: {type: String}
  , create_date: {type: Date}           //创建日期
  , create_user: {type: String}           //创建者
  , create_custom: {type: String}
  , update_date: {type: Date}           //更新日期
});

function model() {
  return conn().model('Comment', Comment);
}

exports.create = function(comment_, callback_){
  var comment = model();
  new comment(comment_).save(function(err, result){
    callback_(err, result);
  });
};

exports.getRankAvg = function(appId_, callback_){
  var comment = model();
  comment.aggregate([
    { $match: {appId: appId_}},
    { $group: {
      _id: '$appId',
      rankAvg: { $avg: '$rank'}
    }}
  ], function(err, result){
    var rank = {};
    if (result.length > 0)
      rank = result[0];
    callback_(err, rank);
  });
};

// 获取指定评价的总和及评价人数（用于计算平均评价值）
exports.getRankTotal = function(appId_, callback_){
  var comment = model();
  comment.aggregate([
    { $match: {appId: appId_} },
    { $group: {_id: '$appId', sum: {$sum: '$rank'}, count: {$sum: 1}} }
  ], function(err, result){
    callback_(err, result ? result[0] : {});
  });
};

exports.list = function(condition_, options_, callback_){
    var comment = model();
    comment.find(condition_)
    .skip(options_.start || 0)
    .limit(options_.limit)
    .sort({update_date: -1})
    .exec(function(err, result){
      comment.count(condition_).exec(function(err, count){
        callback_(err,{total:count,items:result});
      });
    });
};