var ctrlapp = require('../controllers/ctrl_app');

var log         = smart.framework.log
  , user        = require("../apis/user")
  , download    = require('../apis/download')
  , file        = require('../apis/file')
  , category    = require('../apis/category')
  , application = require('../apis/application')
  , apiComment  = require('./api_comment');

/*
 * GET home page.
 */

exports.guiding = function (app) {

  apiComment.guiding(app);

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

  //新加页面 0
  app.get('/app/add/select',function (req, res){
    res.render("app_add_select", {"title": "app_add_select", user: req.session.user});
  });
  //上传应用第一步
  app.get('/app/add/step1', function (req, res) {
    ctrlapp.renderAppStep(req, res, 1);
  });
  app.get('/app/add/step2', function (req, res) {
    ctrlapp.renderAppStep(req, res, 2);
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

  //管理、分类App一览
  app.get('/app/list', function (req, res) {
    res.render("app_list", {"title": "check_list", user: req.session.user});
  });

  //get**.json
  app.get('/app/info.json',function(req,res){
    application.getAppInfo(req, res);
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

////进入App_detail画面
//  app.get('/app/:app_id', function (req, res) {
//    var app_id = req.params.app_id;
//    ctrlapp.renderDetail(req, res, app_id);
//  });

  app.get('/app/check/list', function (req, res) {
    res.render("app_check_list", {"title": "check_list", user: req.session.user});
  });

  //app详细信息 popup by正哥
  app.get('/detaildemo', function (req, res) {
    res.render("app_detail_new", {"title": "check_list", user: req.session.user});
  });


  app.get('/app/detail/list', function (req, res) {
    res.render("app_detail_list", {"title": "app_list", user: req.session.user});
  });
};


