
"use strict";

var user          = smart.ctrl.user
  , file          = smart.ctrl.file
  , async         = smart.util.async
  , error         = smart.framework.error
  , moment        = smart.util.moment
	, util          = smart.framework.util
  , app           = require("../modules/mod_app.js")
  , downloadInfo  = require("../modules/mod_download")
  , categorory    = require("../modules/mod_category")
  , devices       = require("../modules/mod_device")
  , starerrors    = require("../core/starerrors.js")
  , apputil       = require("../core/apputil.js");

/**
 * 上传App第一步
 * @param {Object} handler    上下文对象
 * @param {Function} callback 回调函数，返回结果？
 */
exports.create = function (handler, callback) {

  var creator  = handler.req.session.user._id;//创建者
  var data     = handler.params;
  data.require = {                  //require 两项
    device: data.requireDevice,
    os: data.requireOs
  };
  data.rank          = 0;
  data.rankcount     = 0;
  data.downloadCount = 0;
  data.createUser    = creator;
  data.editstep      = 1;              //编辑步骤
  data.editing       = 0;               //?
  data.status        = 0;                //状态 默认为0：未申请
  data.category      = handler.params.category;   //类别
  data.permission    = {                  //权限
    admin: [creator],
    edit: [creator],
    view: [creator],
    download: [creator]

  };
  var date = new Date();
  data.createAt   = date;
  data.createBy   = creator;

  app.create(data, function (err, result) {
    err = err ? new error.InternalServer(err) : null;
    return callback(err, result);
  });
};
/**
 * 根据appId查找app信息
 * @param {Object} handler 上下文对象
 * @param {Function} callback 回调函数，返回app信息
 */
exports.findAppInfoById = function (appId, callback) {
  console.log(appId);
  app.find(appId, function (err, docs) {
    callback(err, docs);
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
/**
 * 根据appId获取app信息
 * @param {Object} handler 上下文对象
 * @param {Function} callback 回调函数，返回app信息
 */
exports.getAppInfoById = function (handler, callback) {
  var params = handler.params;
  app.find(params.app_id, function (err, docs) {
    console.log(docs);
    callback(err,docs);
  });
};

exports.downloadedList = function(handler, callback_){
  var uid_  = handler.uid;
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
      user.at(app.createBy, function (err, creator) {
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
      user.at(app.updateBy, function (err, updater) {
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
 * search
 * @param {Object} handler 上下文对象
 * @param {Function} callback 回调函数，返回查询结果
 */
exports.search = function(handler, callback){
	var category  = handler.params.category
		, keywords  = handler.params.keywords;
	var condition = {"name": new RegExp("^.*" + keywords.toLowerCase() + ".*$", "i")
                  ,status: handler.params.status};
	var options   = {
      start: handler.params.start
    , limit: handler.params.count
    , sort: {updateAt:-1}
    };
	if(category) {
		if(categorory.isAppTypes(category)) {
			condition.appType = category;
    } else {
			condition.category = { $elemMatch: {$in: [category]} };
    }
	}
	app.list(condition,options, function(err, result){
		return callback(err, result);
	});
};

/**
 * list
 * @param {Object} handler 上下文对象
 * @param {Function} callback 回调函数，返回app列表
 */
exports.list = function(handler, callback){
  var sort        = handler.params.sort
    , category    = handler.params.category
    , createBy    = handler.params.createBy
    , status      = handler.params.status
    , asc         = handler.params.asc;
	var condition   = {};

	if(category){
    if(categorory.isAppTypes(category)) {
      condition.appType = category;
    } else {
      condition.category = { $elemMatch: {$in: [category]} };
    }
  }
  if (createBy) {
    condition.createBy = createBy;
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

  app.list(condition, options, function (err, result) {
    if (err) {
      return callback(new error.InternalServer(err));
    }
    return callback(err, result);
  });

	var tasks = [];
  var taskGetAppList = function(cb){
    app.list(condition,options, function(err, result){
      cb(err,result);
    });
  };
  tasks.push(taskGetAppList);

  var taskGetCreator = function(result, cb){
    async.forEach(result.items, function(app, cb_){

    }, function(err){
      cb(err, result);
    });
  };
  tasks.push(taskGetCreator);

  var taskGetUpdater = function(result, cb){
    async.forEach(result.items, function(app, cb_){

    }, function(err){
      cb(err, result);
    });
  };
  tasks.push(taskGetUpdater);

  var taskOther = function(result, callbk){
    async.forEach(result.items, function(app, cb){
      app._doc.appTypeCategory = categorory.getByCode(app.appType); // 追加系统分类
      if(app.require && app.require.device) {
        app._doc.device = devices.getDevice(app.require.device);  // 追加设备
      }
      cb(null, result);
    }, function(err){
      callbk(err, result);
    });
  };
  tasks.push(taskOther);

  async.waterfall(tasks,function(err,result){
    return callback(err, result);
  });
};


/**
 * 渲染追加或编辑画面
 * @param req
 * @param res
 * @param step
 */
exports.renderAppStep = function(req, res, step) {
  var appId = req.query.appId || "0";
  if(req.query.appId) {// 编辑
    exports.findAppInfoById(appId, function(err, app) {
      if(err){
        return starerrors.render(req, res, err);
      }
      // 编辑权限check
      if(!apputil.isCanEdit(app, req.session.user._id)){
        return starerrors.render(req, res, new starerrors.NoEditError);
      }
      // 正常跳转
      _renderAppStep(req, res, step, appId);
    });
  }else {// 追加
  // 正常跳转
    _renderAppStep(req, res, step, appId);
  }
};

/**
 * 更新应用信息-step1
 * @param {Object} handler    上下文对象
 * @param {Function} callback 回调函数，返回结果
 */
exports.update1 = function (handler, callback) {

  var updatetor        = handler.req.session.user._id;
  var code             = handler.params.code
    , appId            = handler.params.appId
    , name             = handler.params.name
    , description      = handler.params.description
    , appType          = handler.params.appType
    , releaseNote      = handler.params.releaseNote
    , copyright        = handler.params.copyright
    , category         = handler.params.category
    , version          = handler.params.version
    , requireOs        = handler.params.requireOs
    , requireDevice    = handler.params.requireDevice
    , bundleIdentifier = handler.params.bundleIdentifier
    , bundlerVersion   = handler.params.bundlerVersion;
    //added by 留着 后期权限设置用
//    , permisson        = handler.params.permisson;

  var appUpdate = {
      updateAt    : new Date()
    , updateBy    : updatetor
    , name        : name
    , description : description
    , appType     : appType
    , releaseNote : releaseNote
    , copyright   : copyright
    , category    : category
    , version     : version
    , require     : {
        device    : requireDevice
      , os        : requireOs
      }
    , bundleIdentifier : bundleIdentifier
    , bundlerVersion   : bundlerVersion
    //added by yt 先留着 后期权限设置使用
//    , permission       : permisson
    , status           : 0
    };

  app.update(code, appId, appUpdate, function (err, result) {
    callback(err, result);
  });
};
/**
 * 更新应用信息-step2
 * @param {Object} handler    上下文对象
 * @param {Function} callback 回调函数，返回结果
 */
exports.update2 = function (handler, callback) {
  //flag标记editstep 判断是否为更新 默认不考虑上传中断
  var flag =-1;
  if(1 === handler.params.editstep)//???editstep
  {
    flag = 0;//第二步上传
  }
  else
  {
    flag = 1;//更新App信息
  }
  var appId      = handler.params.appId
    , code       = handler.params.code
    , createBy   = handler.uid
    , iconBig    = handler.params["icon.big"]
    , iconSmall  = handler.params["icon.small"]
    , screenshot = handler.params.screenshot
    , pptfile    = handler.params.pptfile
    , downloadId = handler.params.downloadId
    , size       = handler.params.pptfileSize
    , editstep   = 2;

  var appUpdate = {
    updateAt : new Date()
   ,updateBy : createBy
   ,icon : {
      big     : iconBig
     ,small  :iconSmall
    }
  , screenshot : screenshot
  , pptfile : pptfile
  , size : size
  , downloadId : downloadId
  , editstep : editstep
  , plistDownloadId : ""
  , status          : 0
  };

  if(!flag)
  {
    appUpdate.updateAt = "";
    appUpdate.updateBy = "";
  }

  app.update(code, appId, appUpdate, function (err, result) {
    callback(err, result);
  });
};

//申请
exports.checkApply = function (handler, callback) {
  var appId    = handler.params.app
    , code     = "";
  var appApply = { status: 1 };
  app.update(code, appId, appApply, function (err, result) {
    callback(err, result);
  });
};
//通过
exports.checkAllow = function (handler, callback) {
  var appId    = handler.params.app
    , code     = "";
  var appAllow = { status:  2} ;
  app.update(code, appId, appAllow, function (err, result) {
    callback(err, result);
  });
};
//拒绝
exports.checkDeny = function (handler, callback) {
  var appId   = handler.params.app
    , code    = "";
  var data    = handler.params;
  var appDeny = {
    status:  3
  , noticeMessage: data.noticeMessage
  , noticeImage: data.noticeImage
  };
  app.update(code, appId, appDeny, function (err, result) {
    callback(err, result);
  });
};
//无效
exports.checkStop = function (handler, callback) {
  var appId   = handler.params.app
    , code    = "";
  var appStop = { status:  4 };
  app.update(code, appId, appStop, function (err, result) {
    callback(err, result);
  });
};

//查询App数量
exports.getAppNum = function (handler, callback) {
  var code      = handler.code
    , startDate = handler.params.startDate
    , endDate   = handler.params.endDate;
  var startTime = moment(startDate, ["YYYY-MM-DD"])
    , endTime   = moment(endDate, ["YYYY-MM-DD"]);
  startTime.set("hour", 0);
  endTime.set("hour", 24);

  startTime = startTime.toDate();
  endTime   = endTime.toDate();

  var condition = {
    valid : 1
  };

  condition.createAt = {"$gte":startTime,"$lte":endTime};
  console.log(condition);
  app.getList(code, condition, function(err, total){
    callback(err, total);
  });
};


function _renderAppStep(req, res, step, appId) {
  if (step === 1) {
    res.render('app_add_step_1', {
      title: "star", bright: "home", user: req.session.user, appId: appId
     ,appTypes: categorory.getAppTypes()
     ,categoryTypes: categorory.getCategoryTypes()
    });
  } else if (step === 2) {
    res.render("app_add_step_2", {
      title: "star", bright: "home", user: req.session.user, appId: appId
    });
  }
}

exports.setDownloadURL = function(req, appInfo) {

	// 现在API里有返回数据组，有返回json格式的。
	var list;
	if (util.isArray(appInfo)) { // 数组
		list = appInfo;
	} else if (appInfo.items) { // json数组
		list = appInfo.items;
	} else if (appInfo._doc) {
		list = [ appInfo ];
	} else if (appInfo.data) {
		list = [ appInfo.data ];
	}

	for (var i = 0; i < list.length; i++) {
		var app_ = list[i];
		var url = apputil.getDownloadURL(req, app_);

		if (app_._doc) {
			app_._doc.downloadURL = url;
			//app_._doc.downloadId = ""; // 移除downloadId
		} else {
			app_.downloadURL = url;
			//app_.downloadId = ""; // 移除downloadId
		}
	}
};