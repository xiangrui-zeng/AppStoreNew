
"use strict";

var i18n      = smart.ctrl.i18n
    , errors  = smart.framework.errors
    , util    = smart.framework.util
    , log     = smart.framework.log
    , _       = smart.util.underscore;

/**
 * 判断是否有管理权限
 * @param app_
 */
exports.isCanManage = function(app, uid) {
  // 创建者
  if(uid && app && app.createBy === uid){
    return true;
  }
    // 管理者权限
  if(uid && app && app.permission && app.permission.admin) {
    var result = _.find(app.permission.admin, function(uid_){ return uid === uid_; } );
    if(result){
      return true;
    }
  }

  return false;
};
/**
 * 判断是否有阅览权限
 * @param app_
 */
exports.isCanView = function(app, uid) {
  // 有管理权限就有阅览权限
  if(exports.isCanManage(app, uid)){
    return true;
  }
  // 编辑权限
  if(uid && app && app.permission && app.permission.edit) {
    var result = _.find(app.permission.edit, function(uid_){ return uid === uid_; } );
    if(result){
      return true;
    }
  }
  return false;
};
/**
 * 判断是否有编辑权限
 * @param app_
 */
exports.isCanEdit = function(app, uid) {
  // 有管理权限就有编辑权限
  if(exports.isCanManage(app, uid)){
    return true;
  }

  // 编辑权限
  if(uid && app && app.permission && app.permission.edit) {
    var result = _.find(app.permission.edit, function(uid_){ return uid === uid_; } );
    if(result){
      return true;
    }
  }

  return false;
};


/**
 * 判断是否有下载权限
 * @param app_
 */
exports.isCanDownload = function(app_, uid) {
  // 有管理权限就有下载权限
  if(this.isCanManage(app_, uid)){
    return true;
  }

  if(uid && app_ && app_.downloadId && app_.permission && app_.permission.download) {
    var result = _.find(app_.permission.edit, function(uid_){ return uid === uid_; } );
    if(result){
        return true;
    }
  }

  return false;
};


/**
 * 设置下载Url
 * @param app_
 * 返回url_
 */
exports.getDownloadURL = function(req_, app_) {

	if(!app_.downloadId){
    return null;
  }

  if(!(req_.session && req_.session.user)){
    return null;
  }

  var uid = req_.session.user._id;
//    if(!exports.isCanDownload(app_, uid))
//        return null;

  var app_id = app_._id;
  var protocol = req_.protocol;
  var host = req_.host;
  var port = req_.app.get("port");
  var appType = app_.appType;
// var appName = app_.name;
// console.log("appNmae:"+appName);
// console.log("appType:"+appType);
  var url_ = "";
  port = ( port === 80 || port === 443 ? "" : ":" + port );// fixed
 //对应IOS
  if(appType === "10001"){
    url_ = protocol + "://" + host + port + "/download/" + app_id + "/"+uid+"/IosApp.plist";
    log.operation("finish setDownloadUrl:"+url_);
    return "itms-services://?action=download-manifest&url=" + url_;
  } else if(appType === "10002"){  //对应andriod
    url_ = protocol + "://" + host + port + "/download/" + app_id + "/"+uid+"/AndriodApp.apk";
    log.operation("finish setDownloadUrl:"+url_);
    return url_;
  }else if(appType === "10003"){  //对应 pcweb
		url_ = protocol + "://" + host + port + "/download/" + app_id + "/"+uid+"/PCWebApp.exe";
    log.operation("finish setDownloadUrl:"+url_);
    return url_;
  }
};

///**
// * 获取客户端IP
// * @param req 请求对象
// * @returns {String} 客户端IP
// */
//function getClientIp(req) {
//  var ipAddress;
//  var forwardedIpsStr = req.header("x-forwarded-for");
//  if (forwardedIpsStr) {
//    var forwardedIps = forwardedIpsStr.split(",");
//    ipAddress = forwardedIps[0];
//  }
//  if (!ipAddress) {
//    ipAddress = req.connection.remoteAddress;
//  }
//  return ipAddress;
//}