

$(function () {
  "use strict";
  var appId = $("#appId").val();
  render(appId);
  events();

});

function events() {
  $("#appType").on("click", function () {
    var temp = $("#appType").val();
    if("10001" === temp)
    {
      $("#bundleId").css("display", "block");
      $("#bundleVer").css("display", "block");
    }
    else{
      $("#bundleId").css("display", "none");
      $("#bundleVer").css("display", "none");
      $("#bundleIdentifier").val("NULL");
      $("#bundleVersion").val("NULL");
    }
  });
}

function render(appId) {
  if (appId !== "0")
  {
    smart.doget("/app/info.json?app_id="+appId, function (err, data)
    {
      new ButtonGroup("appType",data.appType).init();
      $("#name").val(data.name);
      $("#copyright").val(data.copyright);
      $("#description").val(data.description);
      $("#version").val(data.version);
      $("#releaseNote").val(data.releaseNote);
      $("#category").val(data.category);
      $("#bundleVersion").val(data.bundleVersion);
      $("#bundleIdentifier").val(data.bundleIdentifier);
      $("#requireOs").val(data.require.os);
      $("#requireDevice").val(data.require.device);

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

      //公开对象permission_view
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
          var newChkValueId = _.without(chkValueId, data);
          $("#permissionDownloadInput").val(newChkValueId);
          $(this).remove();
        });
      });
    });
  }
  else
  {
    new ButtonGroup("appType","10001").init();
  }
}

function didSendStep1Callback(result) {
  // 错误信息
  if(result.error && result.error.code){
    $alertMsg.error(result.error.message);
    return;
  }
  var appId = result.data._id;
  window.location.href = "/app/add/step2?appId=" + appId;
}

function didSendFn(data) {
  var sendData = {};
  var crsf = $("#_csrf").val();
  var category = [];
  var appType = $("#appType").val();
  for (var i in data)
  {
    sendData[data[i].name] = data[i].value;
    if (data[i].name === "category") {
      category.push(data[i].value);
    }
    if (data[i].name === "device") {
      sendData["require.device"] = data[i].value;
    }
    if (data[i].name === "permission.download") {
      sendData[data[i].name] = data[i].value.split(",");
    }
  }
  sendData.appType = appType;
  sendData.category = category;
  sendData._csrf = crsf;
  return sendData;
}


