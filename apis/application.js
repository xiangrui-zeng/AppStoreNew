
"use strict";

var util      = smart.framework.util
  , response  = smart.framework.response
  , context   = smart.framework.context
  , log       = smart.framework.log
  , app       = require("../controllers/ctrl_app.js")
  , apputil   = require("../core/apputil.js");




/**
 * 更新App信息
 * @param req 请求对象
 * @param res 响应对象
 * @returns {*} 无
 */
exports.updateAppStep = function (req, res) {
  var handler = new context().bind(req, res);
  log.operation("begin: update an app step1.", handler.uid);

  app.update1(handler, function (err, result) {
    log.operation("finish: update an app step1.", handler.uid);
    response.send(res, err, result);
  });
};

/**
 * 上传App第一步
 * @param req 请求对象
 * @param res 响应对象
 * @returns {*} 无
 */
exports.createAppStep1 = function (req, res) {
  var handler = new context().bind(req, res);
  log.operation("begin: create an app step1.", handler.uid);

  app.create(handler, function (err, result) {
    log.operation("finish: create an app step1.", handler.uid);
    response.send(res, err, result);
  });

};

/**
 * 上传App第二步
 * @param req 请求对象
 * @param res 响应对象
 * @returns {*} 无
 */
exports.createAppStep2 = function (req, res) {
  var handler = new context().bind(req, res);
  log.operation("begin: create an app step2.", handler.uid);

  app.update2(handler, function (err, result) {
    log.operation("finish: create an app step2.", handler.uid);
    response.send(res, err, result);
  });
};

// uploud image
exports.saveimage = function (req, res) {
  var handler = new context().bind(req, res);
  log.operation("begin: upload an item.", handler.uid);
  // 文件个数判断 引入0.1.34版本后的smartcore 此处逻辑可删除
  var params = handler.params
    , files = params.files;
  var tmpFiles = [];
  console.log(files);
  if (files) {
    if (files[0] instanceof Array) {
      var fileList = files[0];
      for (var i in fileList) {
        tmpFiles.push(fileList[i]);
      }
    } else {
      tmpFiles.push(files[0]);
    }
  }
  handler.addParams("files", tmpFiles);

  app.addimage(handler, function (err, result) {
    log.operation("finish: upload an item.", handler.uid);
    response.send(res, err, result);
  });
};
/**
 * apis 获取app信息
 * @param req 请求对象
 * @param res 响应对象
 */
exports.getAppInfo = function (req, res) {
  var handler = new context().bind(req, res);
  app.getAppInfoById(handler, function (err, result) {
    app.setDownloadURL(req, result);
    response.send(res, err, result);
  });
};

exports.downloadedList = function (req, res) {
  var handler = new context().bind(req, res);

  app.downloadedList(handler, function (err, result) {
    app.setDownloadURL(req, result);
    response.send(res, err, result);
  });
};

/**
 * apis查找方法
 * @param req 请求对象
 * @param res 响应对象
 */
exports.search = function (req, res) {
	var handler = new context().bind(req,res);
	app.search(handler, function(err, result) {
		log.operation("finish : search app list",handler.uid);
		response.send(res,err,result);
	});
};

/**
 * apis中list方法
 * @param req 请求对象
 * @param res 响应对象
 */
exports.list = function (req, res) {
  var handler = new context().bind(req,res);

	app.list(handler,function(err, result){
		app.setDownloadURL(req, result);
		response.send(res, err, result);
	});
};
/**
 * apis中app申请
 * @param req 请求对象
 * @param res 响应对象
 */
exports.checkApply = function(req, res) {
  var handler = new context().bind(req, res);
  log.operation("begin: apply an app.", handler.uid);

  app.checkApply (handler, function(err, result) {
    log.operation("finish: apply an app.", handler.uid);
    response.send(res, err, result);
  });
};
/**
 * apis中app审核通过
 * @param req 请求对象
 * @param res 响应对象
 */
exports.checkAllow = function(req, res) {
  var handler = new context().bind(req, res);
  log.operation("begin: allow an app.", handler.uid);

  app.checkAllow (handler, function(err, result) {
    log.operation("finish: allow an app.", handler.uid);
    response.send(res, err, result);
  });
};
/**
 * apis中app拒绝通过
 * @param req 请求对象
 * @param res 响应对象
 */
exports.checkDeny = function(req, res) {
  var handler = new context().bind(req, res);
  log.operation("begin: Deny an app.", handler.uid);

  app.checkDeny (handler, function(err, result) {
    log.operation("finish: Deny an app.", handler.uid);
    response.send(res, err, result);
  });
};
/**
 * apis中app无效
 * @param req 请求对象
 * @param res 响应对象
 */
exports.checkStop = function(req, res) {
  var handler = new context().bind(req, res);
  log.operation("begin: Stop an app.", handler.uid);

  app.checkStop (handler, function(err, result) {
    log.operation("finish: Stop an app.", handler.uid);
    response.send(res, err, result);
  });
};

/**
 * apis中查找APP数量
 * @param req 请求对象
 * @param res 响应对象
 */
exports.getAppNum = function(req, res) {
  var handler = new context().bind(req, res);

  app.getAppNum (handler, function(err, result) {
    response.send(res, err, result);
  });
};

