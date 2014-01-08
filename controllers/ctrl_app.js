
"use strict";

var context       = smart.framework.context
  , user          = smart.ctrl.user
  , file          = smart.ctrl.file
  , async         = smart.util.async
  , error         = smart.framework.error
  , app           = require("../modules/mod_app.js")
  , downloadInfo  = require("../modules/mod_download")
  , categorory    = require("../modules/mod_category")
  , devices       = require("../modules/mod_device")
  , starerrors    = require("../core/starerrors.js")
  , apputil       = require("../core/apputil.js");

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

exports.getAppInfoById = function (handler, callback) {
  var params = handler.params;
  app.find(params.app_id, function (err, docs) {
    console.log(docs);
    callback(err,docs);
  });
};

exports.downloadedList = function(handler, callback_){
  var uid_ = handler.uid;
  var tasks = [];
  var taskGetAppIds = function(cb){
    downloadInfo.appIdsByUser(uid_,function(err, ids){
      cb(err,ids);
    });
  };
  tasks.push(taskGetAppIds);

  var taskGetApps = function(ids, cb){
    app.getAppsByIds(ids, function(err, result){
      cb(err, result);
    });
  };
  tasks.push(taskGetApps);

  var taskGetCreator = function (result, cb) {
    async.forEach(result, function (app, cb_) {
      user.at(app.create_user, function (err, creator) {
        app._doc.creator = creator;
        cb_(err);
      });
    }, function (err) {
      cb(err, result);
    });
  };
  tasks.push(taskGetCreator);

  var taskGetUpdater = function (result, cb) {
    async.forEach(result, function (app, cb_) {
      user.at(app.update_user, function (err, updater) {
        app._doc.updater = updater;
        cb_(err);
      });
    }, function (err) {
      cb(err, result);
    });
  };
  tasks.push(taskGetUpdater);

  var taskOther = function (result, cb) {
    async.forEach(result, function (app, cb_) {
      app._doc.appTypeCategory = categorory.getByCode(app.appType); // 追加系统分类
      if (app.require && app.require.device){
        app._doc.device = devices.getDevice(app.require.device);  // 追加设备
      }
      cb_(null, result);
    }, function (err) {
      cb(err, result);
    });
  };
  tasks.push(taskOther);

  async.waterfall(tasks,function(err,result){
    return callback_(err, result);
  });
};

/**
 * @file 查询ctrl
 * @author chenda
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */
exports.search = function(handler, callback){
	var category  = handler.params.category
		 ,keywords  = handler.params.keywords;
	var condition = {"name": new RegExp("^.*" + keywords.toLowerCase() + ".*$", "i")};
	var options   = {
      start: handler.params.start
     ,limit: handler.params.count
     ,sort: {update_date:-1}
  };
	if(category) {
		if(categorory.isAppTypes(category))
			condition.appType = category;
		else
			condition.category = { $elemMatch: {$in: [category]} };
	}
	app.list(condition,options, function(err, result){
		return callback(err, result);
	});
}

/**
 * @file list ctrl
 * @author chenda
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */
exports.list = function(handler, callback){
  var sort        = handler.params.sort
	   ,category    = handler.params.category
	   ,create_user = handler.params.create_user
	   ,status      = handler.params.status
	   ,asc         = handler.params.asc;
	var condition   = {};

	if(category){
    if(categorory.isAppTypes(category))
      condition.appType = category;
    else
      condition.category = { $elemMatch: {$in: [category]} };
  }
  if(create_user){
    condition.create_user = create_user;
  }
  if(status){
    condition.status = status;
  }

  var options = {
      start: handler.params.start
    , limit: handler.params.limit
  };
  if (sort){
    options.sort = {};
    options.sort[sort] = asc == 1 ? 1 : -1;
  }
	  app.list(condition,options, function(err, result){
      if (err) {
        return callback(new error.InternalServer(err));
      }
      return callback(err, result);
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
    }, function(err){
      cb(err, result);
    });
  };
  tasks.push(task_getCreator);

  var task_getUpdater = function(result, cb){
    async.forEach(result.items, function(app, cb_){
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
    return callback(err, result);
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
// 更新变为两步
//exports.updatestep1 = function (handler, callback) {
//  var appId = handler.params.appId
//    , code  = handler.params.code
//    , create_user = handler.uid
//    , icon_big = handler.params['icon.big']
//    , icon_small = handler.params['icon.small']
//    , screenshot = handler.params.screenshot
//    , pptfile = handler.params.pptfile
//    , downloadId = handler.params.downloadId
//    , size = handler.params.pptfile_size
//    , editstep = handler.params.editstep
//  var app_update = {
//    update_date : new Date()
//    ,update_user : create_user
//    , icon :{
//      big: icon_big
//      ,small :icon_small
//
//    }
//    , screenshot : screenshot
//    , pptfile : pptfile
//    , size : size
//    , downloadId : downloadId
//    , editstep : editstep
//    , plistDownloadId : ""
//  };
//
//  app.update(code, appId, app_update, function (err, result) {
//    callback(err, result);
//  });
//}

exports.update = function (handler, callback) {
  var appId = handler.params.appId
    , code  = handler.params.code
    , create_user = handler.uid
    , icon_big = handler.params['icon.big']
    , icon_small = handler.params['icon.small']
    , screenshot = handler.params.screenshot
    , pptfile = handler.params.pptfile
    , downloadId = handler.params.downloadId
    , size = handler.params.pptfile_size
//    , editstep = handler.params.editstep
  var app_update = {
    update_date : new Date()
   ,update_user : create_user
   , icon :{
      big: icon_big
      ,small :icon_small

    }
  , screenshot : screenshot
  , pptfile : pptfile
  , size : size
  , downloadId : downloadId
//  , editstep : editstep
  , plistDownloadId : ""
  };

  app.update(code, appId, app_update, function (err, result) {
    callback(err, result);
  });
}

exports.checkApply = function (handler, callback) {
  var appId = handler.params.app
    , code        = "";
  var app_apply = { status:  1}
  app.update(code, appId, app_apply, function (err, result) {
    callback(err, result);
  });
}

exports.checkAllow = function (handler, callback) {
  var appId = handler.params.app
    , code        = "";
  var app_allow = { status:  2}
  app.update(code, appId, app_allow, function (err, result) {
    callback(err, result);
  });
}

exports.checkDeny = function (handler, callback) {
  var appId = handler.params.app
    , code        = "";
  var data = handler.params;
  var app_Deny = {
    status:  3
  , notice: data.notice
  , noticeimage: data.noticeimage
  }
  app.update(code, appId, app_Deny, function (err, result) {
    callback(err, result);
  });
}

exports.checkStop = function (handler, callback) {
  var appId = handler.params.app
    , code        = "";
  var app_stop = { status:  4}
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
