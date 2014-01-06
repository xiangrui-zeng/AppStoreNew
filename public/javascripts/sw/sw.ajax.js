/**
 * 上传图片
 */
function uploadFiles(input, files, callback) {
    var that = this;
    if (!files || files.length <= 0) {
        return false;
    }
    var fd = new FormData();
    for (var i = 0; i < files.length; i++) {
        fd.append("files", files[i]);
    }
    var _uploadFn = function (opt) {
        var crsf = $("#_csrf").val();
      // 发送文件
      smart.dopostData("/app/image/save.json", fd,function(err, result){


          if(err){
            callback(1, err);
          } else {
            if (result.error) {

              callback(1, input, result);
            } else {
              callback(0, input, result);
            }
          }
        }

      );
    };
    _uploadFn({data: fd});
};

function ajaxGetCallback(btn,opt,callback){
    var _getFn = function () {
        $.ajax({
            type: opt.method || 'GET',
            url: opt.url || $(btn).attr("action"),
            data: opt.data || $(btn).attr("data"),
            dataType: "json",
            cache: false,
            success: callback || $sw.ajaxDone,
            error: $sw.ajaxError
        });
    };
    _getFn();
    return;
};

function ajaxTodoCallback(btn, opt, callback, confirmMsg) {

    var $btn = $(btn);

    var _todoFn = function () {
        $.ajax({
            type: opt.method || 'POST',
            url: opt.url || $btn.attr("action"),
            data: opt.data || $btn.attr("data"),
            dataType: "json",
            cache: false,
            success: callback || $sw.ajaxDone,
            error: $sw.ajaxError
        });
    };
    if (confirmMsg) {
        $alertMsg.confirm(confirmMsg, {okCall: _todoFn});
    } else {
        _todoFn();
    }
    return false;
};

function validateCallback(form, callback, fn,confirmMsg) {

    var $form = $(form);
    if (!$form.valid()) {
        return false;
    }
    var f = fn($form.serializeArray());

    var csrftoken = $('#_csrf').val();
    console.log(fn($form.serializeArray()));
    var data =  (fn?fn($form.serializeArray()):{
        "_csrf": csrftoken,
        "form": $form.serializeArray()
       , "iocnsmall" : $('#icon_small_file_hid').val()
      , "iocnbig" : $('#icon_big_file_hid').val()
    })||{"_csrf":csrftoken};
    console.log($form.attr("action"));
    var _submitFn = function () {
      smart.dopost($form.attr("action"),data,  function(err, result) {
        if (err) {
          return Alertify.log.info("提交失败");
        }
        callback(result);
      });
    }

    if (confirmMsg) {
        $alertMsg.confirm(confirmMsg||"确认提交吗？", {okCall: _submitFn});
    } else {

        _submitFn();
    }

    return false;
};

function ajaxTodo(url, callback) {
    var $callback = callback || navTabAjaxDone;
    if (!$.isFunction($callback)) $callback = eval('(' + callback + ')');
    $.ajax({
        type: 'POST',
        url: url,
        dataType: "json",
        cache: false,
        success: $callback,
        error: DWZ.ajaxError
    });
}

$.fn.extend({
    ajaxTodo: function () {
        return this.each(function () {
            var $this = $(this);
            $this.click(function (event) {
                var url = unescape($this.attr("href")).replaceTmById($(event.target).parents(".unitBox:first"));
                DWZ.debug(url);
                if (!url.isFinishedTm()) {
                    alertMsg.error($this.attr("warn") || DWZ.msg("alertSelectMsg"));
                    return false;
                }
                var title = $this.attr("title");
                if (title) {
                    alertMsg.confirm(title, {
                        okCall: function () {
                            ajaxTodo(url, $this.attr("callback"));
                        }
                    });
                } else {
                    ajaxTodo(url, $this.attr("callback"));
                }
                event.preventDefault();
            });
        });
    }
});
