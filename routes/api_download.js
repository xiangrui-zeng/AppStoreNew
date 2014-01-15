"use strict";

var download = require("../apis/download");

exports.guiding = function(app){

  //获取plist
  app.get("/download/:app_id/:user_id/IosApp.plist", function(req, res) {
    download.getPlist(req, res);
  });

  //获取ipa文件
  app.get("/download/:app_id/:user_id/IosApp.ipa", function(req, res) {
    download.getIpaFile(req, res);
  });

  //获取apk文件
	app.get("/download/:app_id/:user_id/AndriodApp.apk", function(req, res) {
		download.getApkFile(req, res);
	});

	//获取exe文件
	app.get("/download/:app_id/:user_id/PCWebApp.exe", function(req, res) {
		download.getExeFile(req, res);
	});
};