"use strict";

var download = require("../apis/download");

exports.guiding = function(app){

  app.get("/download/:app_id/:user_id/app.plist", function(req, res) {
    download.getPlist(req, res);
  });

  app.get("/download/:app_id/:user_id/app.ipa", function(req, res) {
    download.getIpaFile(req, res);
  });
};