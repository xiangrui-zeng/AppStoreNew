/**
 * Created by xiangrui.zeng@gmail.com on 13/12/26.
 */
"use strict";
$(function () {
  events();
});

function events() {

  var tmpimage = [];
  $("#image_big_btn").bind("click", function () {
    $("#image_big_file").bind("change", function (e) {
      if (e.target.files.length < 7) {
        if (!e.target.files || e.target.files.length <= 0) {
          return false;
        }
        var fd = new FormData();
        for (var i = 0; i < e.target.files.length; i++) {
          fd.append("files", e.target.files[i]);
        }
        // 发送文件
        smart.dopostData("/app/image/save.json", fd, function (err, result) {
            if (err) {
              callback(1, err);
            } else {
              for (var i = 0; i < result.data.length; i++) {
                tmpimage[i] = result.data[i]._id;
              }
            }
          }
        );
      } else {
        alert("上传图片不要超过6张");
      }

      $("#icon_big_file").unbind("change");
    });
    var src = $("#image_big_file");
    src.attr("accept", "");
    src.attr("multiple", "multiple");
    src.trigger("click");
  });

  $("#check_list_container").on("click", "a", function (event) {
    var operation = $(event.target).attr("operation")
      , app_id = $(event.target).attr("appId");
    if (operation === "allow") {
      $("#applyModal").modal("show");
      $("#confirmApply").bind("click", function () {
        $("#applyModal").modal("hide");
        window.location = "/app/check/list";
        smart.dopost("/app/appAllow.json", {app: app_id}, function (err, result) {
          if (err) {
            Alertify.log.error(i18n["js.public.error.device.operation"]);
            console.log(err);
          } else {
            Alertify.log.info(i18n["js.public.info.device.allow"]);
          }
        });
      });
    }

    if (operation === "apply") {
      smart.dopost("/app/checkApply.json", {app: app_id}, function (err, result) {
        if (err) {
          Alertify.log.error(i18n["js.public.error.device.operation"]);
          console.log(err);
        } else {
          Alertify.log.info(i18n["js.public.info.device.allow"]);

        }
      });
    }

    if (operation === "deny") {
      $("#rejectModal").modal("show");
      $("#confirmReject").bind("click", function () {
        $("#rejectModal").modal("hide");
        var data = {
          "noticeMessage": $('#rejectReason').val(), "noticeImage": tmpimage, "app": app_id
        }
        smart.dopost("/app/checkDeny.json", data, function (err, result) {
          if (err) {
            Alertify.log.error(i18n["js.public.error.device.operation"]);
            console.log(err);
          } else {
            Alertify.log.info(i18n["js.public.info.device.allow"]);
          }
        });
      });
    }

    if (operation === "stop") {
      smart.dopost("/app/checkStop.json", {app: app_id}, function (err, result) {
        if (err) {
          Alertify.log.error(i18n["js.public.error.device.operation"]);
          console.log(err);
        } else {
          Alertify.log.info(i18n["js.public.info.device.allow"]);
        }
      });
    }

  });

}

