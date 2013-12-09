"use strict";
var user        = require("../apis/user")
  , apiApp      = require("./api_app")
  , apiFile     = require("./api_file")
  , apiComment  = require("./api_comment")
  , apiAnalyze  = require("./api_analyze")
  , apiDownload = require("./api_download");

/*
 * GET home page.
 */

exports.guiding = function (app) {

  // APP
  apiApp.guiding(app);

  // file
  apiFile.guiding(app);

  // comment
  apiComment.guiding(app);

  // analyze
  apiAnalyze.guiding(app);

  // download
  apiDownload.guiding(app);

  // 登陆
  app.get("/simplelogin", function (req, res) {
    user.simpleLogin(req, res);
  });

  // 注销
  app.get("/simplelogout", function (req, res) {
    user.simpleLogout(req, res);
  });

  // root
  app.get("/", function(req, res) {
    res.render("login", {"title": "login"});
  });

  // login
  app.get("/login", function(req, res) {
    res.render("login", {"title": "login"});
  });

  // homepage
  app.get("/starwall", function(req, res) {
    res.render("starwall", {"title": "starwall", user: req.session.user});
  });

};


