/**
 * Created by xiangrui.zeng@gmail.com on 13/12/19.
 */

$(function () {
  'use strict';

  var appId = "";
  render(appId);
  events(appId);

});

function events(appId) {

}

function render(appId) {

  if (appId != 0) {
    smart.doget("/app/info.json?app_id="+appId, function (err, data) {
      console.log(data);
      $("#name").val(data.name);
      $("#version").val(data.version);
      $("#memo").val(data.memo);
      $("#bundle_version").val(data.bundle_version);
      $("#bundle_identifier").val(data.bundle_identifier);
      $("#title").val(data.title);
      $device = $("input[name=device]");
      for (var i = 0; i < $device.length; i++) {
        if ($($device[i]).val() == data.require.device) {
          $($device[i]).attr("checked", "checked");
        }
      }
      $("#os").val(data.require.os);
      $select = $("select[name=category] option");
      for (var i = 0; i < $select.length; i++) {
        if (data.category.indexOf($($select[i]).val()) > -1) {
          $($select[i]).attr("selected", "selected");
        }
      }

      $input = $("input[name=appType]");
      for (var i = 0; i < $input.length; i++) {
        if ($($input[i]).val() == data.appType) {
          $($input[i]).attr("checked", "checked");
        }
      }
      $("form").attr("action", "/app/update/step1.json");
      //控制sidebar
      console.log(data.editstep);
      for (var i = 1; i <= 5; i++) {
        if (data.editstep >= i) {
          $("#step" + (i) + "").attr("href", "/app/add/step" + (i) + "?appId=" + data._id);
          $("#step" + (i) + "").css("background-image", "url(/images/check.png)");
          $("#step" + (i) + "").css("background-repeat", "no-repeat");


        } else {
          $("#step" + (i) + "").attr("href", "#");
        }
        $("#step1").addClass("active");
      }
    });
  }
};

function didSendStep1Callback(result) {
  // 错误信息
  if(result.error && result.error.code) {
    $alertMsg.error(result.error.message);
    return;
  }
  console.log("console.log(result);");
  console.log(result);
  var appId = result.data._id;
  console.log("appp id   is   %s", appId);
  window.location.href = "/app/add/step2?appId=" + appId;
};

function didSendFn(data) {
  var sendData = {};
  var crsf = $("#_csrf").val();
  var category = [];
  for (var i in data) {
    sendData[data[i].name] = data[i].value;
    if (data[i].name == 'category') {
      category.push(data[i].value);
    }
    if (data[i].name == 'device') {
      sendData["require.device"] = data[i].value;
    }

  }

  sendData["category"] = category;
  sendData["_csrf"] = crsf;
  return sendData;
};


