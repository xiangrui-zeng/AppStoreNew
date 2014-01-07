
$(function () {
  'use strict';
  var appId = $("#appId").val();
  render(appId);
  events(appId);

});

function events(appId) {

}

function render(appId) {
  if (appId != '0') {
    smart.doget("/app/info.json?app_id="+appId, function (err, data) {
    $("#appType").val(data.appType);
    $("#name").val(data.name);
    $("#copyright").val(data.copyright);
    $("#description").val(data.description);
    $("#version").val(data.version);
    $("#release_note").val(data.release_note);
    $("#category").val(data.category);
    $("#bundle_version").val(data.bundle_version);
    $("#bundle_identifier").val(data.bundle_identifier);
    $("#require_os").val(data.require.os);
    $("#require_device").val(data.require.device);

      //device 例：phone、pad 暂时没有这数据段  先留着  l
//      $device = $("input[name=device]");
//      for (var i = 0; i < $device.length; i++) {
//        if ($($device[i]).val() == data.require.device) {
//          $($device[i]).attr("checked", "checked");
//        }
//      }
      //选择应用类别
      $select = $("select[name=category] option");
      for (var i = 0; i < $select.length; i++) {
        if (data.category.indexOf($($select[i]).val()) > -1) {
          $($select[i]).attr("selected", "selected");
        }
      }
       //apptype ios、android、pc
      $input = $("input[name=appType]");
      for (var i = 0; i < $input.length; i++) {
        if ($($input[i]).val() == data.appType) {
          $($input[i]).attr("checked", "checked");
        }
      }

      $("form").attr("action", "/app/update/step1.json");

      //控制sidebar
      console.log(data.editstep);
      for (var i = 1; i <= 2; i++) {
        if (data.editstep >= i) {
          $("#step" + (i) + "").attr("href", "/app/add/step" + (i) + "?appId=" + data._id);
          $("#step" + (i) + "").css("background-image", "url(/images/check.png)");
          $("#step" + (i) + "").css("background-repeat", "no-repeat");
        } else {
          $("#step" + (i) + "").attr("href", "#");
        }
        $("#step1").addClass("active");
      }

      //公开对象permission_download
      console.log(data);
      if(!data.name){
        return;
      }
      var permission = data.permission;
      $('input[name="permission.download"]').val(permission.download.join(','));
      $("#download_user_selected").html('');
      for (var i = 0; i < data.download_list.length; i++) {
        $("#download_user_selected").append("<li class=\"user_has_selected\" data=\"" + data.download_list[i].id + "\"><div ><div style='float: left'><i class='icon-user'/>" + data.download_list[i].name.name_zh + "</div><div class='close_user' style='display: none;float: right;'>X</div><div><br></li>");
      }
      $(".user_has_selected").each(function (i, li) {
        $(this).mouseover(function () {
          $(this).find(".close_user").css("display", "block");
        });
        $(this).mouseleave(function () {
          $(this).find(".close_user").css("display", "none");
        });
        $(this).click(function () {
          var data = $(this).attr("data");
          console.log(data);
          console.log(chk_value_id);
          console.log(chk_value_id);
          var new_chk_value_id = _.without(chk_value_id, data);
          console.log(new_chk_value_id);
          console.log();
          $("#permission_download_input").val(new_chk_value_id);
          $(this).remove();
        });
      });
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
    if (data[i].name == "permission.download") {
      sendData[data[i].name] = data[i].value.split(',');
    }
  }
  sendData["category"] = category;
  sendData["_csrf"] = crsf;
  return sendData;
}


