"use strict";

var application = require("../apis/application")
  , category    = require("../apis/category")
  , ctrlapp     = require("../controllers/ctrl_app");

exports.guiding = function(app){

  // html
  // 下载一览
  app.get("/app/list", function (req, res) {
    res.render("app_list", {"title": "app_list", user: req.session.user});
  });
	//新着更多一览
	app.get("/app/list/title_new_list", function (req, res) {
		res.render("app_list", {"title": "title_new_list", user: req.session.user});
	});
	//download更多一览
	app.get("/app/list/title_download_list", function (req, res) {
		res.render("app_list", {"title": "title_download_list", user: req.session.user});
	});
	//评价更多一览
	app.get("/app/list/title_rank_list", function (req, res) {
		res.render("app_list", {"title": "title_rank_list", user: req.session.user});
	});
  // 上传一览
  app.get("/app/upload/list", function (req, res) {
    res.render("app_list", {"title": "upload_list", user: req.session.user});
  });

  // 管理一览
  app.get("/app/manage/list", function (req, res) {
    res.render("app_list", {"title": "manage_list", user: req.session.user});
  });

  // 审核一览
  app.get("/app/check/list", function (req, res) {
    res.render("app_check_list", {"title": "check_list", user: req.session.user});
  });
  // APP详细
  app.get("/app/detail/list", function (req, res) {
    res.render("app_detail_list", {"title": "app_list", user: req.session.user});
  });

  //上传应用第一步
  app.get("/app/add/step1", function(req, res){
    ctrlapp.renderAppStep(req, res, 1);
  });
  app.get("/app/add/step2", function(req, res){
    ctrlapp.renderAppStep(req, res, 2);
  });

  // 检索结果一览
  app.get("/list/search", function (req, res) {
    res.render("list_search", { title: "检索结果一览", bright: "home", user: req.session.user
      ,keywords: req.query.keywords
    });
  });

  // json
  // APP检索
  app.get("/app/search.json", function(req, res){
    application.search(req, res);
  });

  // 获取分类一览
  app.get("/app/category.json", function(req, res){
    category.getCategory(req, res);
  });

  //上传应用
  app.post("/app/create.json",function(req,res){
    application.createApp(req,res);
  });

  //上传数据：创建app第一步信息
  app.post("/app/create/step1.json",function(req,res){
    application.createAppStep1(req,res);
  });

  //上传数据：更新app第一步信息
  app.post("/app/update/step1.json",function(req,res){
    application.updateAppStep(req,res);
  });

  //上传数据：创建app的第2-5步信息
  app.post("/app/create/step2.json",function(req,res)
  {
    application.createAppStep2(req,res);
  });

  // info
  app.get("/app/info.json",function(req, res){
    application.getAppInfo(req, res);
  });

  app.get("/app/list.json", function(req, res){
    application.list(req, res);
  });

  //存储图片
  app.post("/app/image/save.json", function (req, res) {
    application.saveimage(req, res);
  });

  app.post("/app/checkApply.json", function(req, res){
    application.checkApply(req, res);
  });

  app.post("/app/appAllow.json", function(req, res){
    application.checkAllow(req, res);
  });

  app.post("/app/checkDeny.json", function(req, res){
    application.checkDeny(req, res);
  });

  app.post("/app/checkStop.json", function(req, res){
    application.checkStop(req, res);
  });

};