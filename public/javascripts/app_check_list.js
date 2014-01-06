/**
 * Created by xiangrui.zeng@gmail.com on 13/12/26.
 */

$(function () {

  'use strict';
  events();
});


function events() {

  $("#check_list_container").on("click", "a", function(event){
    var operation = $(event.target).attr("operation")
      , app_id = $(event.target).attr("appId");
    if (operation == "allow") {
      $("#applyModal").modal("show");
      $("#confirmApply").bind("click",function(){
        $("#applyModal").modal("hide");
        smart.dopost("/app/appAllow.json", {app: app_id}, function(err, result){
          if (err) {
            Alertify.log.error(i18n["js.public.error.device.operation"]); console.log(err);
          } else {
            Alertify.log.info(i18n["js.public.info.device.allow"]);
            render(0, 15);
          }
        });
      });
    }

    if (operation == "apply") {
      smart.dopost("/app/checkApply.json", {app: app_id}, function(err, result){
        if (err) {
          Alertify.log.error(i18n["js.public.error.device.operation"]); console.log(err);
        } else {
          Alertify.log.info(i18n["js.public.info.device.allow"]);
          render(0, 15);
        }
      });
    }

    if (operation == "deny") {
      $("#rejectModal").modal("show");
      $("#confirmReject").bind("click",function(){
        $("#rejectModal").modal("hiden");
        smart.dopost("/app/checkDeny.json", {app: app_id}, function(err, result){
          if (err) {
            Alertify.log.error(i18n["js.public.error.device.operation"]); console.log(err);
          } else {
            Alertify.log.info(i18n["js.public.info.device.allow"]);
          }
        });
      });
    }

    if (operation == "stop") {
      smart.dopost("/app/checkStop.json", {app: app_id}, function(err, result){
        if (err) {
          Alertify.log.error(i18n["js.public.error.device.operation"]); console.log(err);
        } else {
          Alertify.log.info(i18n["js.public.info.device.allow"]);
        }
      });
    }

  });

}

