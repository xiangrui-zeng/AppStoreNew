<<<<<<< Updated upstream
var app = require("../controllers/ctrl_app.js")
    , download = require("../controllers/ctrl_download")
    , util = smart.framework.util
    , json = smart.framework.response;
=======
var   app      = require("../controllers/ctrl_app.js")
    , download = require("../controllers/ctrl_download")
    , util     = smart.framework.util;

>>>>>>> Stashed changes

exports.create = function (req_, res_, callback) {
    var creator = req_.session.user._id||0;
    var data = {};
    data.app_id = req_.query.app_id;
    data.create_user = creator;
    data.device = 'ios';
    data.ip = getClientIp(req_);
    console.log("fdsdfdsf 1");
    app.findAppInfoById(data.app_id, function (err, app_docs) {
        var flag = req_.query.flag;
        console.log("fdsdfdsf 2");
        console.log(flag);
        if (app_docs.appType == "10001"&&!flag) {
            console.log("跳出");
            res_.redirect("/ios/download?app_id=" + app_docs._id);
            return;
        } else {
            console.log("fdsdfds  3f");
            download.create(data, function (err, result) {
                console.log("fdsdfdsf 4");
                callback(err, result);

                return;
            });
        }

    })

};

function getClientIp(req) {
    var ipAddress;
    var forwardedIpsStr = req.header('x-forwarded-for');
    if (forwardedIpsStr) {
        var forwardedIps = forwardedIpsStr.split(',');
        ipAddress = forwardedIps[0];
    }
    if (!ipAddress) {
        ipAddress = req.connection.remoteAddress;
    }
    return ipAddress;
}