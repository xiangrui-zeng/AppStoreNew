/**
 * Created by yt on 13-12-23.
 */
var application = require('../api/application')
  , category = require('../api/category');

exports.guiding = function(app){
  app.post('/app/create.json', function(req, res){
    application.createApp(req, res);
  });
  app.post('/app/create/step1.json', function(req, res){
    application.createAppStep1(req, res);
  });
  app.post('/app/update/step1.json', function(req, res){
    application.updateAppStep1(req, res);
  });

  app.post('/app/create/step2.json', function(req, res){
    application.createAppStep2(req, res);
  });
  app.post('/app/create/step3.json', function(req, res){
    application.createAppStep3(req, res);
  });
  app.post('/app/create/step4.json', function(req, res){
    application.createAppStep4(req, res);
  });
  app.post('/app/create/step5.json', function(req, res){
    application.createAppStep5(req, res);
  });

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

};