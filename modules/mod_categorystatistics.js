/**
 * Created by yt on 14-1-7.
 */
var mongo       = smart.util.mongoose
  , conn        = smart.framework.connection
  , schema      = mongo.Schema;

var Categorystatistics = new schema({
  code:{type:Number,description:"类别标识，10000"}
 ,name:{type:String,description:"类别名称 设备"}
 ,items:[
 {
   code:{type:Number,description:"具体类别码 10001 10002 10003"}
  ,name:{type:String,description:"具体类别名称 IOS、Android、PCweb"}
  ,icon:{type:String,description:"类别对应图标"}
  ,count:{type:Number,description:"对应类别应用数量"}
  ,downloadCount:{type:Number,description:"类别下载量"}
  }
  ]
});

function model() {
  return conn.model("", "Categorystatistics", Categorystatistics);
}

exports.create = function (Categorystatistics_, callback_) {
  var Categorystatistics = model();
  new Categorystatistics(Categorystatistics_).save(function (err, result) {
    callback_(err, result);
  });
}