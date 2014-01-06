var EventProxy = require('eventproxy');
var app = require("../modules/mod_app.js")
  , context  = smart.framework.context
  , user = smart.ctrl.user
  , file      = smart.ctrl.file
  , downloadInfo = require("../modules/mod_download")
  , async = smart.util.async
  , categorory = require('../modules/mod_category')
  , devices = require('../modules/mod_device');
var error = smart.framework.error;
var starerrors = require('../core/starerrors.js');
var apputil = require('../core/apputil.js');
exports.create = function (data_, callback_){
  var date = Date.now();
  var app_ = data_;
  app_.create_date = date;
  app_.update_date = date;

  app.create(app_, function(err, result){
    err = err ? new error.InternalServer(err) : null;
    return callback_(err, result);
  });
};
exports.findAppInfoById = function (app_id_, callback_) {
    console.log(app_id_);
    app.find(app_id_, function (err, docs) {
        console.log(docs);
        callback_(err, docs);
    });
};

exports.addimage = function(handler, callback) {

  file.add(handler, function(err, result){

    if(err){
      return callback(new error.InternalServer(err));
    }
    callback(err, result);
  });
};

exports.getAppInfoById = function (handler, callback_) {

  var params = handler.params;

  app.find(params.app_id, function (err, docs) {
    var proxy = new EventProxy();
    var proxy1 = new EventProxy();
    var proxy2 = new EventProxy();
    var proxy3 = new EventProxy();
    var proxy4 = new EventProxy();
    var admin_list = [];
    var edit_list = [];
    var view_list = [];
    var download_list = [];
    var app_info = docs;
    console.log(docs);
    proxy.after('permission_ready', 4, function () {
      return callback_(null, app_info);
    });
    proxy1.after('admin_ready', docs.permission.admin.length, function () {
      app_info.admin_list = admin_list;
      proxy.emit('permission_ready');
    });

    proxy2.after('edit_ready', docs.permission.edit.length, function () {
      app_info.edit_list = edit_list;
      proxy.emit('permission_ready');
    });

    proxy3.after('view_ready', docs.permission.view.length, function () {
      app_info.view_list = view_list;
      proxy.emit('permission_ready');
    });

    proxy4.after('download_ready', docs.permission.download.length, function () {
      app_info.download_list = download_list;
      proxy.emit('permission_ready');
    });
    proxy.fail(callback_);
    proxy1.fail(callback_);
    proxy2.fail(callback_);
    proxy3.fail(callback_);
    proxy4.fail(callback_);

    //获取允许下载列表
//    docs.permission.download.forEach(function (id, i) {
//      var tempHandler = new context().create(handler.uid, handler.code, handler.lang);
//      tempHandler.addParams("uid", id);
//      user.get(tempHandler, function (err, user) {
//        download_list.push({id: id, name: user.first});
//        proxy4.emit('download_ready');
//      });
//    });
  });


};

exports.downloadedList = function(uid_, callback_){
  var tasks = [];
  var task_getAppIds = function(cb){
    downloadInfo.appIdsByUser(uid_,function(err, ids){
      cb(err,ids);
    });
  };
  tasks.push(task_getAppIds);

  var task_getApps = function(ids, cb){
    app.getAppsByIds(ids, function(err, result){
      cb(err, result);
    });
  };
  tasks.push(task_getApps);

    var task_getCreator = function(result, cb){
        async.forEach(result, function(app, cb_){
            user.at(app.create_user, function(err, creator){
                app._doc.creator = creator;
                cb_(err);
            });
        }, function(err){
            cb(err, result);
        });
    };
    tasks.push(task_getCreator);

    var task_getUpdater = function(result, cb){
        async.forEach(result, function(app, cb_){
            user.at(app.update_user, function(err, updater){
                app._doc.updater = updater;
                cb_(err);
            });
        }, function(err){
            cb(err, result);
        });
    };
    tasks.push(task_getUpdater);

    var task_other = function(result, cb){
        async.forEach(result, function(app, cb_){
            app._doc.appTypeCategory = categorory.getByCode(app.appType); // 追加系统分类
            if(app.require && app.require.device)
                app._doc.device = devices.getDevice(app.require.device);  // 追加设备
            cb_(null, result);
        }, function(err){
            cb(err, result);
        });
    };
    tasks.push(task_other);

  async.waterfall(tasks,function(err,result){
    return callback_(err, result);
  });
};

exports.search = function(uid_, keyword_, start_, count_, category_, callback_){
  var condition = {"name": new RegExp("^.*" + keyword_.toLowerCase() + ".*$", "i")};
  var options = {
      start: start_
    , limit: count_
    , sort: {update_date:-1}
  };

  if(category_) {
      if(categorory.isAppTypes(category_))
          condition.appType = category_;
      else
          condition.category = { $elemMatch: {$in: [category_]} };
  }

  var tasks = [];
  var task_getAppList = function(cb){
    app.list(condition, options, function(err, result){
      cb(err,result);
    });
  };
  tasks.push(task_getAppList);
  var task_other = function(result, cb){
	async.forEach(result.items, function(app, cb_){
		app._doc.appTypeCategory = categorory.getByCode(app.appType); // 追加系统分类
		if(app.require && app.require.device)
			app._doc.device = devices.getDevice(app.require.device);  // 追加设备
		cb_(null, result);
	}, function(err){
		cb(err, result);
	});
  };
  tasks.push(task_other);


  async.waterfall(tasks,function(err,result){
    return callback_(err, result);
  });
};

exports.list = function(sort_,asc_,category_, start_, count_, status_,callback_){
  var condition = {};
//  if (admin_) {
//    condition.$or = [
//        {'create_user': uid_}
//      , {'permission.admin': uid_}
//      , {'permission.edit': uid_}
//    ];
//  } else {
//      condition.$and = [
//          {'permission.view': uid_}
//          , {'status': 1}           // 1、社内公开
//      ];
//  }

  if(category_) {
      if(categorory.isAppTypes(category_))
        condition.appType = category_;
      else
        condition.category = { $elemMatch: {$in: [category_]} };
  }
  if(status_)
  {
    condition.status = status_;
  }

  var options = {
      start: start_
    , limit: count_
  };
  if (sort_){
    options.sort = {};
    options.sort[sort_] = asc_ == 1 ? 1 : -1;
  }

  app.list(condition,options, function(err, result){
    if (err) {
      return callback_(new error.InternalServer(err));
    }
    console.log(result)
    return callback_(err, result);
  });

  var tasks = [];
  var task_getAppList = function(cb){
    app.list(condition,options, function(err, result){
      cb(err,result);
    });
  };
  tasks.push(task_getAppList);

  var task_getCreator = function(result, cb){
    async.forEach(result.items, function(app, cb_){
//      var tmphandler = new context().create(app.create_user, "","");
//      tmphandler.addParams("uid", app.create_user);
//      user.get(tmphandler, function(err, creator){
//        app._doc.creator = creator.userName;
//        cb_(err);
//      });
    }, function(err){
      cb(err, result);
    });
  };
  tasks.push(task_getCreator);

  var task_getUpdater = function(result, cb){
    async.forEach(result.items, function(app, cb_){
//      var tmphandler = new context().create(app.update_user, "","");
//      tmphandler.addParams("uid", app.update_user);
//      console.log("====="+tmphandler)
//      user.get(tmphandler, function(err, updater){
//        app._doc.updater = updater.userName;
//        cb_(err);
//      });
    }, function(err){
      cb(err, result);
    });
  };
tasks.push(task_getUpdater);

   var task_other = function(result, cb){
      async.forEach(result.items, function(app, cb_){
           app._doc.appTypeCategory = categorory.getByCode(app.appType); // 追加系统分类
           if(app.require && app.require.device)
               app._doc.device = devices.getDevice(app.require.device);  // 追加设备
           cb_(null, result);
       }, function(err){
          cb(err, result);
      });
   };
  tasks.push(task_other);

  async.waterfall(tasks,function(err,result){
    return callback_(err, result);
 });
};

/**
 * 渲染详细画面
 * @param req
 * @param res
 * @param app_id
 */
exports.renderDetail = function(req, res, app_id) {
    exports.findAppInfoById(app_id, function(err, app) {
        if(err)
           return starerrors.render(req, res, err);
        // 阅览权限check
        if(!apputil.isCanView(app, req.session.user._id))
            return starerrors.render(req, res, new starerrors.NoViewError);
        // 正常跳转
        res.render("app_detail", {
            app_id: app_id,
            title: "star", bright: "home",
            user: req.session.user,
            app: app
         });
    });
};
/**
 * 渲染追加或编辑画面
 * @param req
 * @param res
 * @param step
 */
exports.renderAppStep = function(req, res, step) {
    var appId = req.query.appId || '0';
    if(req.query.appId) {// 编辑
        exports.findAppInfoById(appId, function(err, app) {
            if(err)
                return starerrors.render(req, res, err);

            // 编辑权限check
            if(!apputil.isCanEdit(app, req.session.user._id))
                return starerrors.render(req, res, new starerrors.NoEditError);

            // 正常跳转
            _renderAppStep(req, res, step, appId);
        });
    }else {// 追加
        // 正常跳转
        _renderAppStep(req, res, step, appId);
    }
};

exports.update = function (handler, callback) {
  var session_uid = handler.uid
    , appId = handler.params._id
    , code  = handler.params.code
    , create_user = handler.uid
    , icon_big = handler.params['icon.big']
    , icon_small = handler.params['icon.small']
    , screenshot = handler.params.screenshot
    , pptfile = handler.params.pptfile
    , downloadId = handler.params.downloadId
    , editstep = 2
    , plistdownloadId = handler.params.plistDownloadId;
  var app_update = {
    update_date : new Date()
   ,update_user : create_user
   , icon :{
      big: icon_big
      ,small :icon_small

    }
  , screenshot : screenshot
  , pptfile : pptfile
  , downloadId : downloadId
  , editstep : editstep
  , plistDownloadId : ""
  };

  app.update(code, appId, app_update, function (err, result) {
    callback(err, result);
  });
}

exports.checkApply = function (handler, callback) {
  var session_uid = handler.uid
    , appId = handler.params.app
    , code        = "";
  app_apply = { status:  1}
  app.update(code, appId, app_apply, function (err, result) {
    callback(err, result);
  });
}

exports.checkAllow = function (handler, callback) {
  var session_uid = handler.uid
    , appId = handler.params.app
    , code        = "";
  app_allow = { status:  2}
  app.update(code, appId, app_allow, function (err, result) {
    callback(err, result);
  });
}

exports.checkDeny = function (handler, callback) {
  var session_uid = handler.uid
    , appId = handler.params.app
    , code        = "";
  app_Deny = { status:  3}
  app.update(code, appId, app_Deny, function (err, result) {
    callback(err, result);
  });
}

exports.checkStop = function (handler, callback) {
  var session_uid = handler.uid
    , appId = handler.params.app
    , code        = "";
  app_stop = { status:  4}
  app.update(code, appId, app_stop, function (err, result) {
    callback(err, result);
  });
}

function _renderAppStep(req, res, step, appId) {
    if (step == 1) {
        res.render('app_add_step_1', {
            title: "star", bright: "home", user: req.session.user, appId: appId
            ,appTypes: categorory.getAppTypes()
            ,categoryTypes: categorory.getCategoryTypes()
        });
    } else if (step == 2) {
        res.render('app_add_step_2', {
            title: "star", bright: "home", user: req.session.user, appId: appId
        });
    }
}
