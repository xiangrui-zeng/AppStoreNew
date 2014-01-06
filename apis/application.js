var app = require("../controllers/ctrl_app.js")
  , util = smart.framework.util
  , response  = smart.framework.response
  , context   = smart.framework.context
  , log       = smart.framework.log
  , apputil = require("../core/apputil.js")
  , starerrors = require("../core/starerrors.js");

function setDownloadURL(req, app_info) {
  // 现在API里有返回数据组，有返回json格式的。
  var list;
  if (util.isArray(app_info)) // 数组
    list = app_info;
  else if (app_info.items)   // json数组
    list = app_info.items;
  else if (app_info._doc)
    list = [ app_info ];
  else if (app_info.data)
    list = [ app_info.data ];

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

exports.updateAppStep1 = function (req_, res_) {
  var creator = req_.session.user._id;
  var appId = req_.body._id;
  var appType = req_.body.appType;
  var name = req_.body.name;
  var copyright = req_.body.copyright;
  var version = req_.body.version;
  var release_note = req_body.release_note;
  //var memo = req_.body.memo;
  var description = req_.body.description;
  var device = req_.require.device;
  var os = req_.require.os;
  var category = req_.body.category;
  var bundle_identifier = req_.body.bundle_identifier;
  var bundle_version = req_.body.bundle_version;
  var title = req_.body.title;
  var editstep = 1;
//  app.findAppInfoById(appId,function(err,docs){
//    docs.name = name;
//    docs.appType = appType;
//    docs.copyright = copyright;
//    docs.description = description;
//    dosc.category = category;
//    dosc.version = version;
//    dosc.release_note = release_note;
//    dosc.os = os;
//    dosc.device = device;
//    dosc.bundle_identifier = bundle_identifier;
//    dosc.bundle_version = bundle_version;
//    docs.save(function (err_, result) {
//          response.send(res, err_, result);
//        });
//  });
//    app.findAppInfoById(appId, function (err, docs) {
//        // check编辑权限
//        if(!apputil.isCanEdit(docs, req_.session.user._id))
//          return new error.InternalServer(err);
//
//        docs.name = name;
//        docs.version = version;
//        docs.bundle_identifier = bundle_identifier;
//        docs.bundle_version = bundle_version;
//        docs.title = title;
//        docs.memo = memo;
//        docs.description = description;
//        docs.require = {device: device, os: os};
//        docs.appType = appType;
//        docs.category = category;
//        docs.update_date = new Date();
//        docs.update_user = creator;
//        if (docs.editstep < editstep) {
//            docs.editstep = editstep;
//        }
//        if (!docs.editstep) {
//            docs.editstep = editstep;
//        }
//        docs.save(function (err_, result) {
//          response.send(res, err_, result);
//        });
//    });
};
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

exports.createAppStep3 = function (req_, res_) {
  var creator = req_.session.user._id;
  var appId = req_.body._id;

  var permission_edit = req_.body['permission.edit'];
  var permission_view = req_.body['permission.view'];
  var permission_download = req_.body['permission.download'];
  var permission_admin = req_.body['permission.admin'];
  console.log(permission_view);
  console.log(permission_edit);
  console.log(permission_download);
  console.log(permission_admin);
  var editstep = 3;
//    app.findAppInfoById(appId, function (err, docs) {
//        // check编辑权限
//        if(!apputil.isCanEdit(docs, req_.session.user._id))
//          return new error.InternalServer(err);
//
//        docs.permission.admin = permission_admin;
//        docs.permission.download = permission_download;
//        docs.permission.view = permission_view;
//        docs.permission.edit = permission_edit;
//        docs.update_date = new Date();
//        docs.update_user = creator;
//        if (docs.editstep < editstep) {
//            docs.editstep = editstep;
//        }
//        if (!docs.editstep) {
//            docs.editstep = editstep;
//        }
//        console.log(docs);
//        docs.save(function (err_, result) {
//
//          response.send(res_, err_, result);
//        });
//    });
};
exports.createAppStep4 = function (req_, res_) {
  var creator = req_.session.user._id;
  var appId = req_.body._id;
  var support = req_.body.support;
  var notice = req_.body.notice;
  var release_note = req_.body.release_note;
  var editstep = 4;
//    app.findAppInfoById(appId, function (err, docs) {
//        // check编辑权限
//        if(!apputil.isCanEdit(docs, req_.session.user._id))
//          return new error.InternalServer(err);
//
//        docs.support = support;
//        docs.notice = notice;
//        docs.release_note = release_note;
//        docs.update_date = new Date();
//        docs.update_user = creator;
//        if (docs.editstep < editstep) {
//            docs.editstep = editstep;
//        }
//        if (!docs.editstep) {
//            docs.editstep = editstep;
//        }
//        docs.save(function (err_, result) {
//          response.send(res_, err_, result);
//        });
//    });
};
exports.createAppStep5 = function (req_, res_) {
  var creator = req_.session.user._id;
  var appId = req_.body._id;
  var editstep = 5;
//    app.findAppInfoById(appId, function (err, docs) {
//        // check编辑权限
//        if(!apputil.isCanEdit(docs, req_.session.user._id))
//            return json.sendError(res_, new starerrors.NoEditError);
//
//        docs.editing = 1;
//        docs.status = 1;
//        docs.editstep = editstep;
//        docs.update_date = new Date();
//        docs.update_user = creator;
//        docs.save(function (err_, result) {
//          response.send(res_, err_, result);
//        });
//    });
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

exports.downloadedList = function (req_, res_) {
  var uid = req_.session.user._id;

  app.downloadedList(uid, function (err, result) {
    setDownloadURL(req_, result);
    response.send(res_, err, result);
  });
};

exports.search = function (req_, res_) {
  var start = Number(util.checkString(req_.query.start));
  var count = Number(util.checkString(req_.query.count));
  var uid = req_.session.user._id;
  var keywords = req_.query.keywords;
  var category = req_.query.category;

  app.search(uid, keywords, start, count, category, function (err, result) {
    setDownloadURL(req_, result);
    response.send(res_, err, result);
  });
};

exports.list = function (req_, res_) {
  var start = Number(util.checkString(req_.query.start));
  var count = Number(util.checkString(req_.query.count));
  var sort = util.checkString(req_.query.sort);
  var asc = Number(util.checkString(req_.query.asc));
  //var uid = req_.session.user._id;
  //var admin = req_.query.admin ? true : false;
  var category = req_.query.category;
  var status = req_.query.status;

  app.list(sort, asc, category, start, count, status ,function (err, result) {
    setDownloadURL(req_, result);
    response.send(res_, err, result);
  });
};

exports.checkApply = function(req, res) {
  var handler = new context().bind(req, res);
  log.operation("begin: apply an app.", handler.uid);

  app.checkApply (handler, function(err, result) {
    log.operation("finish: apply an app.", handler.uid);
    response.send(res, err, result);
  });
}

exports.checkAllow = function(req, res) {
  var handler = new context().bind(req, res);
  log.operation("begin: allow an app.", handler.uid);

  app.checkAllow (handler, function(err, result) {
    log.operation("finish: allow an app.", handler.uid);
    response.send(res, err, result);
  });
}

exports.checkDeny = function(req, res) {
  var handler = new context().bind(req, res);
  log.operation("begin: Deny an app.", handler.uid);

  app.checkDeny (handler, function(err, result) {
    log.operation("finish: Deny an app.", handler.uid);
    response.send(res, err, result);
  });
}

exports.checkStop = function(req, res) {
  var handler = new context().bind(req, res);
  log.operation("begin: Stop an app.", handler.uid);

  app.checkStop (handler, function(err, result) {
    log.operation("finish: Stop an app.", handler.uid);
    response.send(res, err, result);
  });
}
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
            var kind = result.kind;
            var title = result.title;

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
