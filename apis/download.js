/**
 * @file 下载App的api
 * @author lizheng
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var context  = smart.framework.context
  , response = smart.framework.response
  , download = require("../controllers/ctrl_download");

/**
 * 下载Plist
 * @param req 请求对象
 * @param res 响应对象
 * @returns {*} 无
 */
exports.getPlist = function (req, res) {

  var handler = new context().bind(req, res);
  handler.addParams("host", req.host);
  handler.addParams("port", req.app.get("port"));

  download.getPlist(handler, function(err, plist) {
    if(err) {
      return response.send(res, err);
    }

    res.setHeader("Content-Type", "text/xml");
    res.send(plist);
  });
};

/**
 * 下载Ipa文件
 * @param req 请求对象
 * @param res 响应对象
 * @returns {*} 无
 */
exports.getIpaFile = function (req, res) {

  var handler = new context().bind(req, res);

  download.getIpaFile(handler, function(err, file) {
    if(err) {
      return response.send(res, err);
    }

    response.sendFile(res, err, file);
  });
};


/**
 * 下载Apk文件
 * @param req 请求对象
 * @param res 响应对象
 * @returns {*} 无
 */
exports.getApkFile = function (req, res) {

	var handler = new context().bind(req, res);

	download.getApkFile(handler, function(err, file) {
		if(err) {
			return response.send(res, err);
		}

		response.sendFile(res, err, file);
	});
};


/**
 * 下载exe文件
 * @param req 请求对象
 * @param res 响应对象
 * @returns {*} 无
 */
exports.getExeFile = function (req, res) {

	var handler = new context().bind(req, res);

	download.getExeFile(handler, function(err, file) {
		if(err) {
			return response.send(res, err);
		}

		response.sendFile(res, err, file);
	});
};