function initEnv() {

//    if ($.browser.msie && /6.0/.test(navigator.userAgent)) {
//        try {
//            document.execCommand("BackgroundImageCache", false, true);
//        } catch (e) {
//        }
//    }
    //清理浏览器内存,只对IE起效
//    if ($.browser.msie) {
//        window.setInterval("CollectGarbage();", 10000);
//    }

    $(window).resize(function () {
        initLayout();
    });

    var ajaxbg = $("#progressBar");
    $(document).ajaxStart(function () {
        ajaxbg.attr("value", "loading");
    }).ajaxStop(function () {
            ajaxbg.attr("value", "submit");
        });


    setTimeout(function () {
        initLayout();
        initUI();
    }, 10);

}
function initLayout() {
    var iContentW = $(window).width();
    var iContentH = $(window).height();

    var width = $("#_navbar").css("width");

    var left = parseFloat(iContentW)/2 -parseFloat(width)/2;

    if(left < 0){
        left = 0;
    }
//    $("#_navbar").css("margin-left",left);
}

function initUI(_box) {
    var $p = $(_box || document);

    $("form.required-validate", $p).each(function () {
        var $form = $(this);
        $form.validate({
            onsubmit: false,
            focusInvalid: true,
            focusCleanup: true,
            errorClass: "help-inline",
            errorElement: "span",
            ignore: ".ignore",
            invalidHandler: function (form, validator) {
                var errors = validator.numberOfInvalids();
                if (errors) {
                    var message = $sw.msg("validateFormError", [errors]);
                    $alertMsg.error(message);
                }
            },
            highlight: function (element, errorClass, validClass) {
                console.log(errorClass);
            },
            unhighlight: function (element, errorClass, validClass) {

            }
        });
    });
    if ($.fn.loadUrl) $("[target=loadUrl]", $p).loadUrl();
    if ($.fn.ajaxGet) $("[target=ajaxGet]", $p).ajaxGet();
}


