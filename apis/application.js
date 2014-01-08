
"use strict";

var util      = smart.framework.util
  , response  = smart.framework.response
  , context   = smart.framework.context
  , log       = smart.framework.log
  , app       = require("../controllers/ctrl_app.js")
  , apputil   = require("../core/apputil.js");


function setDownloadURL(req, appInfo) {
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
}
//还需要调整 by yt
exports.updateAppStep1 = function (req_, res_) {
  var handler = new context().bind(req_, res_);
  console.log(handler+"???????");
  var creator = handler.session.uid;
  var appId = handler.params.app;
  var appType = handler.params.appType;
  var name = handler.params.name;
  var copyright = handler.params.copyright;
  var version = handler.params.version;
  var release_note = handler.params.release_note;
  var description = handler.params.description;
  var device = handler.params.device_device;
  var os = handler.params.require_os;
  var category = handler.body.category;
  var bundle_identifier = handler.params.bundle_identifier;
  var bundle_version = handler.params.bundle_version;
  var title = handler.body.title;
  var permission_download =handler.params.permission.download;
  app.create(data, function (err, result) {
    response.send(res, err, result);
  });
}
exports.createAppStep1 = function (req, res) {
  var creator = req.session.user._id;//创建者
  var data = util.checkObject(req.body);
  data.require = {                  //require 两项
    device: data.require_device,
    os: data.require_os
  };
  data.rank = 0;
  data.rankcount = 0;
  data.downloadCount = 0;
  data.create_user = creator;
  data.editstep = 1;              //编辑步骤
  data.editing = 0;               //?
  data.status = 0;                //状态 默认为0：未申请
  data.category = req.body.category;   //类别
  data.permission = {                  //权限
    admin: [creator],
    edit: [creator],
    view: [creator],
    download: [creator]

  };
  data.update_date = new Date();       //更新时间 当前时间
  data.update_user = creator;
  app.create(data, function (err, result) {
    response.send(res, err, result);
  });
};
//
exports.createAppStep2 = function (req, res) {
  var handler = new context().bind(req, res);
  log.operation("begin: create an app step2.", handler.uid);

  app.update (handler, function(err, result) {
    log.operation("finish: create an app step2.", handler.uid);
    response.send(res, err, result);
  });
};

// uploud image
exports.saveimage = function (req, res) {
  var handler = new context().bind(req, res);
  log.operation("begin: upload an item.", handler.uid);
  // 文件个数判断 引入0.1.34版本后的smartcore 此处逻辑可删除
  var params = handler.params
    , files = params.files;
  var tmpFiles = [];
  console.log(files);
  if (files) {
    if (files[0] instanceof Array) {
      var fileList = files[0];
      for (var i in fileList) {
        tmpFiles.push(fileList[i]);
      }
    } else {
      tmpFiles.push(files[0]);
    }
  }
  handler.addParams("files", tmpFiles);

  app.addimage(handler, function (err, result) {
    log.operation("finish: upload an item.", handler.uid);
    response.send(res, err, result);
  });
};

exports.createApp = function (req_, res_) {
  var creator = req_.session.user._id;
  var data = util.checkObject(req_.body);
  data.create_user = creator;
  data.update_user = creator;
  console.log(req_.body);
  app.create(data, function (err, result) {
    response.send(res_, err, result);
  });
};

exports.getAppInfo = function (req, res) {
  var handler = new context().bind(req, res);
  app.getAppInfoById(handler, function (err, result) {
//    setDownloadURL(req_, result);    留后用
    response.send(res, err, result);
  });
};

exports.downloadedList = function (req, res) {
  var uid = req_.session.user._id;
  var handler = new context().bind(req, res);

  app.downloadedList(handler, function (err, result) {
    setDownloadURL(req_, result);
    response.send(res_, err, result);
  });
};

/**
 * @file 查询apis
 * @author chenda
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */
exports.search = function (req_, res_) {
	var handler = new context().bind(req_,res_);
	app.search(handler, function(err, result) {
		log.operation("finish : search app list",handler.uid);
		response.send(res_,err,result);
	});
};

/**
 * @file list apis
 * @author chenda
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */
exports.list = function (req_, res_) {
  var handler = new context().bind(req_,res_);
	log.operation("finish : list app ",handler.uid);
	app.list(handler,function(err, result){
		setDownloadURL(req_, result);
		response.send(res_, err, result);
	})
};

exports.checkApply = function(req, res) {
  var handler = new context().bind(req, res);
  log.operation("begin: apply an app.", handler.uid);

  app.checkApply (handler, function(err, result) {
    log.operation("finish: apply an app.", handler.uid);
    response.send(res, err, result);
  });
};

exports.checkAllow = function(req, res) {
  var handler = new context().bind(req, res);
  log.operation("begin: allow an app.", handler.uid);

  app.checkAllow (handler, function(err, result) {
    log.operation("finish: allow an app.", handler.uid);
    response.send(res, err, result);
  });
};

exports.checkDeny = function(req, res) {
  var handler = new context().bind(req, res);
  log.operation("begin: Deny an app.", handler.uid);

  app.checkDeny (handler, function(err, result) {
    log.operation("finish: Deny an app.", handler.uid);
    response.send(res, err, result);
  });
};

exports.checkStop = function(req, res) {
  var handler = new context().bind(req, res);
  log.operation("begin: Stop an app.", handler.uid);

  app.checkStop (handler, function(err, result) {
    log.operation("finish: Stop an app.", handler.uid);
    response.send(res, err, result);
  });
};
//获取plist文件
exports.getPlist = function (req_, res_) {
    console.log(req_.host);
    var app_id = req_.params.app_id;
    app.getAppInfoById(app_id, function (err, result) {
        if (err) {
          return new error.InternalServer(err);
        } else {
            var url = "http://"+req_.host+":3000/file/download.json?_id="+result.downloadId+"&amp;app_id="+app_id+"&amp;flag=phone";
            var bundle_identifier = result.bundle_identifier;
            var bundle_version = result.bundle_version;
            var kind = "software";
            var title = result.name;

            res_.setHeader('Content-Type', "text/xml");
            res_.send("<?xml version=\"1.0\" encoding=\"UTF-8\" ?>\
<!DOCTYPE plist PUBLIC \"-//Apple//DTD PLIST 1.0//EN\" \"http://www.apple.com/DTDs/PropertyList-1.0.dtd\">\
<plist version=\"1.0\">\
<dict>\
<key>items</key>\
<array>\
<dict>\
<key>assets</key>\
<array>\
<dict>\
<key>kind</key>\
<string>software-package</string>\
<key>url</key>"
+"<string>"
+url
+"</string>"
+"</dict>\
<dict>\
<key>kind</key>\
<string>display-image</string>\
<key>needs-shine</key>\
<true/>\
<key>url</key>\
<string>http://3g.momo.im/down/ICON.PNG</string>\
</dict>\
<dict>\
<key>kind</key>\
<string>full-size-image</string>\
<key>url</key><string>http://3g.momo.im/down/ICON@2x.PNG</string>\
</dict>\
</array><key>metadata</key>\
<dict>\
<key>bundle-identifier</key>               \
<string>"+bundle_identifier+"</string>     \
<key>bundle-version</key>                  \
<string>"+bundle_version+"</string>                       \
<key>kind</key>                            \
<string>software</string>                  \
<key>title</key>                           \
<string>"+title+"</string>                     \
</dict>\
</dict>\
</array>\
</dict>\
</plist>");
            return;
        }
    });

}
