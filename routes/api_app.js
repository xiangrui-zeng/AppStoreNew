/**
 * Created by yt on 13-12-23.
 */
var application = require('../api/application')
  , category = require('../api/category');

exports.guiding = function(app){

  app.get('/app/search.json', function(req, res){
    application.search(req, res);
  });

  app.get('/app/downloaded/list.json', function(req, res){
    application.downloadedList(req, res);
  });

  // 获取分类一览
  app.get('/app/category.json', function(req, res){
    category.getCategory(req, res);
  });

};