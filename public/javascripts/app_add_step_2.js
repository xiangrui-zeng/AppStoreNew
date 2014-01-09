/**
 * Created by Administrator on 14-1-2.
 */
$(function () {
  'use strict';
  var appId = $("#appId").val();
  render(appId);
  events(appId);
});

function events(appId) {

}

function render(appId) {
  if ("0" !== appId) {
    $(function () {
      smart.doget("/app/info.json?app_id=<%=appId%>", function (err, data) {
        console.log(data.editstep);
        for (var i = 1; i <= 2; i++) {
          if (data.editstep >= i) {
            $("#step" + (i) + "").attr("href", "/app/add/step" + (i) + "?appId=" + data._id);
            $("#step" + (i) + "").css("background-image", "url(/images/check.png)");
            $("#step" + (i) + "").css("background-repeat", "no-repeat");
          }
          else
            $("#step" + (i) + "").attr("href", "#");

          $("#step2").addClass("active");
        }
        if (data.appType == '10001')
          $("#plist_group").css("display", "block");
        if (!data.icon || data.icon.big.length == 0) {
          return;
        }
        var big_fid = data.icon.big;


        $("#icon_big_file_hid").val(big_fid);
        $("#icon_big_img").css("display", "block");
        $("#icon_big_btn").css("display", "none");
        $("#icon_big_span").bind("click", function (e) {
        $("#icon_big_btn").css("display", "block");
        $("#icon_big_img").css("display", "none");
        $("#icon_big_span").unbind('click');
        });
        $("#icon_big_img").attr("src", "/picture/" + big_fid);

        var small_fid = data.icon.small;
        $("#icon_small_file_hid").val(small_fid);
        $("#icon_small_img").css("display", "block");
        $("#icon_small_btn").css("display", "none");
        $("#icon_small_span").bind("click", function (e) {
          $("#icon_small_btn").css("display", "block");
          $("#icon_small_img").css("display", "none");
          $("#icon_small_span").unbind('click');
        });
        $("#icon_small_img").attr("src", "/picture/" + small_fid);
        var screenshotImg = data.screenshot;
        console.log(screenshotImg);
        var fids = [];
        for (var i = 0; i < data.screenshot.length; i++) {
          console.log(data.screenshot[i]);
          fids.push(data.screenshot[i]);

          $($("#image_show img").eq(i)[0]).attr("src", '/picture/' + data.screenshot[i]);
        }
        $("#image_big_file_hid").val(fids);
        $("#video").val(data.video);
        $("#pptfile_hid").val(data.downloadId);

      });
    });
  }

}

$(function () {
  $app.initialize();
});
function didSendStepCallback(result) {
  try {
    // 错误信息
    if (result.error && result.error.code) {
      $alertMsg.error(result.error.message);
      return;
    }
  } catch (e) {

  }

  var appId = result.data._id;
  console.log("appp id   is   %s", appId);
  window.location.href = "/app/add/step3?appId=" + appId;
}

function didSendFn(data) {
  var sendData = {};
  var crsf = $("#_csrf").val();
  for (var i in data) {
    sendData[data[i].name] = data[i].value;
    if (data[i].name == 'appId') {
      sendData["_id"] = data[i].value;
    }
    if (data[i].name == "screenshot") {

      sendData[data[i].name] = data[i].value.split(',');
    }
  }
  sendData["_csrf"] = crsf;
  return sendData;
}

