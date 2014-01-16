/**
 * @file 下载App的controller
 * @author lizheng
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var async       = smart.util.async
  , context     = smart.framework.context
  , errors      = smart.framework.errors
  , log         = smart.framework.log
  , ctrlApp     = require("../controllers/ctrl_app")
  , ctrlFile    = require("../controllers/ctrl_file")
  , modApp      = require("../modules/mod_app")
  , modDownload = require("../modules/mod_download");

/**
 * 下载Plist
 * @param {Object} handler 上下文对象
 * @param {Function} callback 回调函数，返回Plist
 */
exports.getPlist = function (handler, callback) {

  var params = handler.params;

  ctrlApp.getAppInfoById(handler, function (err, app) {

    if (err) {
      log.error(err, handler.uid);
      callback(new errors.InternalServer(err));
      return;
    }

     var url = "http://"  + params.host + ":" + params.port +"/download/" + app._id + "/" + params.user_id + "/IosApp.ipa";

    var plist = "";
    plist += "<?xml version=\"1.0\" encoding=\"UTF-8\" ?>";
    plist += "<!DOCTYPE plist PUBLIC \"-//Apple//DTD PLIST 1.0//EN\" \"http://www.apple.com/DTDs/PropertyList-1.0.dtd\">";
    plist += "<plist version=\"1.0\">";
    plist += "  <dict>";
    plist += "    <key>items</key>";
    plist += "    <array>";
    plist += "      <dict>";
    plist += "        <key>assets</key>";
    plist += "        <array>";
    plist += "          <dict>";
    plist += "            <key>kind</key>";
    plist += "            <string>software-package</string>";
    plist += "            <key>url</key>";
    plist += "            <string>" + url + "</string>";
    plist += "          </dict>";
    plist += "        </array>";
    plist += "        <key>metadata</key>";
    plist += "        <dict>";
    plist += "          <key>bundle-identifier</key>";
    plist += "          <string>" + app.bundleIdentifier + "</string>";
    plist += "          <key>bundle-version</key>";
    plist += "          <string>" + app.bundleVersion + "</string>";
    plist += "          <key>kind</key>";
    plist += "          <string>software</string>";
    plist += "          <key>title</key>";
    plist += "          <string>" + app.name + "</string>";
    plist += "        </dict>";
    plist += "      </dict>";
    plist += "    </array>";
    plist += "  </dict>";
    plist += "</plist>";

    callback(null, plist);
  });
};

/**
 * 下载Ipa文件
 * @param {Object} handler 上下文对象
 * @param {Function} callback 回调函数，返回Ipa文件
 */
exports.getIpaFile = function (handler, callback) {

  var params = handler.params;
  var uid = params.user_id;
  var appId = params.app_id;

  var tasks = [];
  // 获取App
  var taskGetApp = function(cb){
    ctrlApp.getAppInfoById(handler, function (err, app) {
      cb(err, app);
    });
  };
  tasks.push(taskGetApp);

  // 获取文件
  var taskGetFile = function(app, cb){
    var tempHandler = new context().create(uid, handler.code, handler.lang);
    tempHandler.addParams("id", app.downloadId);
    ctrlFile.getFile(tempHandler, function(err, file) {
      cb(err, app, file);
    });
  };
  tasks.push(taskGetFile);

  // 更新下载信息
  var taskAddHistory = function(app, file, cb){
    var tempHandler = new context().create(uid, handler.code, handler.lang);
    tempHandler.addParams("app_id", appId);
    exports.addHistory(tempHandler, function(err) {
      cb(err, file);
    });
  };
  tasks.push(taskAddHistory);

  async.waterfall(tasks, function(err, file){
    if (err) {
      log.error(err, handler.uid);
      callback(new errors.InternalServer(err));
      return;
    }

    return callback(err, file);
  });
};

/**
 * 下载Apk文件
 * @param {Object} handler 上下文对象
 * @param {Function} callback 回调函数，返回Apk文件
 */
exports.getApkFile = function (handler, callback) {

	var params = handler.params;
	var uid = params.user_id;
	var appId = params.app_id;

	var tasks = [];
	// 获取App
	var taskGetApp = function(cb){
		ctrlApp.getAppInfoById(handler, function (err, app) {
			cb(err, app);
		});
	};
	tasks.push(taskGetApp);

	// 获取文件
	var taskGetFile = function(app, cb){
		var tempHandler = new context().create(uid, handler.code, handler.lang);
		tempHandler.addParams("id", app.downloadId);
		ctrlFile.getFile(tempHandler, function(err, file) {
			cb(err, app, file);
		});
	};
	tasks.push(taskGetFile);

	// 更新下载信息
	var taskAddHistory = function(app, file, cb){
		var tempHandler = new context().create(uid, handler.code, handler.lang);
		tempHandler.addParams("app_id", appId);
		exports.addHistory(tempHandler, function(err) {
			cb(err, file);
		});
	};
	tasks.push(taskAddHistory);

	async.waterfall(tasks, function(err, file){
		if (err) {
			log.error(err, handler.uid);
			callback(new errors.InternalServer(err));
			return;
		}

		return callback(err, file);
	});
};

/**
 * 下载Exe文件
 * @param {Object} handler 上下文对象
 * @param {Function} callback 回调函数，返回Exe文件
 */
exports.getExeFile = function (handler, callback) {

	var params = handler.params;
	var uid = params.user_id;
	var appId = params.app_id;

	var tasks = [];
	// 获取App
	var taskGetApp = function(cb){
		ctrlApp.getAppInfoById(handler, function (err, app) {
			cb(err, app);
		});
	};
	tasks.push(taskGetApp);

	// 获取文件
	var taskGetFile = function(app, cb){
		var tempHandler = new context().create(uid, handler.code, handler.lang);
		tempHandler.addParams("id", app.downloadId);
		ctrlFile.getFile(tempHandler, function(err, file) {
			cb(err, app, file);
		});
	};
	tasks.push(taskGetFile);

	// 更新下载信息
	var taskAddHistory = function(app, file, cb){
		var tempHandler = new context().create(uid, handler.code, handler.lang);
		tempHandler.addParams("app_id", appId);
		exports.addHistory(tempHandler, function(err) {
			cb(err, file);
		});
	};
	tasks.push(taskAddHistory);

	async.waterfall(tasks, function(err, file){
		if (err) {
			log.error(err, handler.uid);
			callback(new errors.InternalServer(err));
			return;
		}

		return callback(err, file);
	});
};

/**
 * 添加下载履历
 * @param {Object} handler 上下文对象
 * @param {Function} callback 回调函数，返回下载履历
 */
exports.addHistory = function (handler, callback){

  var params = handler.params;

  var tasks = [];

  // 添加下载履历
  var taskAddDownloadInfo = function(cb){
    var download = {};
    download.appId = params.app_id;
    download.valid = 1;
    download.createAt = new Date();
    download.createBy = handler.uid.toString();
    download.updateAt = download.createAt;
    download.updateBy = download.createBy;

    modDownload.add(download, function(err, result) {
      cb(err, result);
    });
  };
  tasks.push(taskAddDownloadInfo);

  // 更新下载次数
  var taskUpdateDownloadCount = function(result, cb){
    modDownload.countByApp(params.app_id, function(err, count){
      if(err) {
        return cb(err);
      }
      modApp.updateDownloadCount(params.app_id, count, function(err){
        cb(err, result);
      });
    });
  };
  tasks.push(taskUpdateDownloadCount);

  async.waterfall(tasks,function(err, result){
    return callback(err, result);
  });
};
