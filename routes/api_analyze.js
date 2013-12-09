/**
 * Created by xiangrui.zeng@gmail.com on 14/01/07.
 */

"use strict";

exports.guiding = function(app){
  // APP分析一览
  app.get("/app/analyze", function (req, res) {
    res.render("app_analyze", {"title": "app_analyze", user: req.session.user});
  });
};

