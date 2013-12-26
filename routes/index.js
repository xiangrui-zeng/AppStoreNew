
var log         = smart.framework.log
  , user        = require("../apis/user")
  , application = require('../apis/application')
  , file        = require("../apis/file");
  //, categorory = require('/modules/mod_category')
var ctrlapp = require('../controllers/ctrl_app');

var ctrlapp = require('../controllers/ctrl_app');

var log         = smart.framework.log
  , user        = require("../apis/user")
  , download    = require('../apis/download')
  , file         =require('../apis/file')
  , application = require('../apis/application');

/*
 * GET home page.
 */

exports.guiding = function (app) {

  app.get("/",function(req, res) {
    res.render("login", {"title": "login"});
  });

  app.get("/login",function(req, res) {
    res.render("login", {"title": "login"});
  });


  app.get("/starwall",function(req, res) {
    res.render("starwall", {"title": "starwall", user: req.session.user});
  });

  app.get("/admin",function(req, res) {
    res.render("admin", {"title": "admin", user: req.session.user});
  });

  app.get("/empty",function(req, res) {
    res.render("empty", {"title": "empty", user: req.session.user});
  });

  // 登陆
  app.get('/simplelogin', function (req, res) {
    user.simpleLogin(req, res);
  });

  // 注销
  app.get("/simplelogout", function (req, res) {
    log.audit("logout");
    user.simpleLogout(req, res);
  });

  //上传应用第一步
  app.get('/app/add/step1', function (req, res) {
    ctrlapp.renderAppStep(req, res, 1);
  });

  app.get('/app/add/step2', function (req, res) {
    ctrlapp.renderAppStep(req, res, 2);
  });

  app.get('/app/add/step3', function (req, res) {
    ctrlapp.renderAppStep(req, res, 3);
  });
  app.get('/app/add/step4', function (req, res) {
    ctrlapp.renderAppStep(req, res, 4);
  });

  app.get('/app/add/step5', function (req, res) {
    ctrlapp.renderAppStep(req, res, 5);
  });

  //json的post与get方法
  //上传应用
  app.post('/app/create.json',function(req,res)
  {
    application.createApp(req,res);
  });
  //上传数据：创建app第一步信息
  app.post('/app/create/step1.json',function(req,res)
  {
    application.createAppStep1(req,res);
  });
  //上传数据：更新app第一步信息
  app.post('/app/update/step1.json',function(req,res)
  {
    application.updateAppStep1(req,res);
  });
  //上传数据：创建app的第2-5步信息
  app.post('/app/create/step2.json',function(req,res)
  {
    application.createAppStep2(req,res);
  });

  app.post('/app/create/step3.json',function(req,res)
  {
    application.createAppStep3(req,res);
  });

  app.post('/app/create/step4.json',function(req,res)
  {
    application.createAppStep4(req,res);
  });

  app.post('/app/create/step5.json',function(req,res)
  {
    application.createAppStep5(req,res);
  });
  //get**.json
  app.get('/app/info.json',function(req,res){
    application.getAppInfo(req,res);
  });

  app.get('/app/search.json', function(req, res){
    application.search(req, res);
  });

  app.get('/app/list.json', function(req, res){
    application.list(req, res);
  });

  app.get('/app/downloaded/list.json', function(req, res){
    application.downloadedList(req, res);
  });

  // 获取分类一览
  app.get('/app/category.json', function(req, res){
    category.getCategory(req, res);
  });

  app.get('/app/list.json', function(req, res){
    application.list(req, res);
  });
  //存储图片
  app.post('/app/image/save.json', function (req, res) {
    application.saveimage(req, res);
  });
  // 获取图片
  app.get('/picture/:id', function (req, res) {
    file.getImage(req, res);
  });

  app.get('/file/download.json', function (req, res) {
    download.create(req,res,function(){
    file.download(req, res);
    });
  });

//进入App_detail画面
  app.get('/app/:app_id', function (req, res) {
    var app_id = req.params.app_id;
    ctrlapp.renderDetail(req, res, app_id);
  });


  //评论和获取评论，评分

  app.post('/app/comment/create.json', function(req, res){
    comment.create(req, res);
  });

  app.get('/app/comment/list.json', function(req, res){
    comment.list(req, res);
  });

  app.get('/app/comment/ranktotal.json', function(req, res){
    comment.ranktotal(req, res);
  });

  //进入到全部App一览--按照最新排序
  app.get("/new/all/list",function(req, res) {
    res.render("new_all_list", {"title": "new_all_list", user: req.session.user});
  });


  //进入到全部App一览--按照下载排序
  app.get("/down/all/list",function(req, res) {
    res.render("down_all_list", {"title": "doown_all_list", user: req.session.user});
  });


  //进入到全部App一览--按照评分排序
  app.get("/rank/all/list",function(req, res) {
    res.render("rank_all_list", {"title": "rank_all_list", user: req.session.user});
  });
};
