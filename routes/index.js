
var log       = smart.framework.log
  , user      = require("../apis/user");

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
};
