"use strict";

var comment = require("../apis/comment");

exports.guiding = function(app){
  app.post("/app/comment/create.json", function(req, res){
    comment.add(req, res);
  });

  app.get("/app/comment/list.json", function(req, res){
    comment.getList(req, res);
  });

  app.get("/app/comment/ranktotal.json", function(req, res){
    comment.getRankTotal(req, res);
  });
};
