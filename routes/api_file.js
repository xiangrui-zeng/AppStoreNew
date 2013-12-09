"use strict";

var file      = require("../apis/file")
  , download  = require("../apis/download");

exports.guiding = function(app){

  // 获取图片
  app.get("/picture/:id", function (req, res) {
    file.getImage(req, res);
  });

  app.get("/file/download.json", function (req, res) {
    download.create(req,res,function(){
      //file.download(req, res);
    });
  });
};