var $sw = {
    keyCode: {
        ENTER: 13, ESC: 27, END: 35, HOME: 36,
        SHIFT: 16, TAB: 9,
        LEFT: 37, RIGHT: 39, UP: 38, DOWN: 40,
        DELETE: 46, BACKSPACE: 8
    },
    eventType: {
        pageClear: "pageClear",	// 用于重新ajaxLoad、关闭nabTab, 关闭dialog时，去除xheditor等需要特殊处理的资源
        resizeGrid: "resizeGrid"	// 用于窗口或dialog大小调整
    },
    frag: {}, //page fragment
    _msg: {}, //alert message
    _set: {
        loginUrl: "", //session timeout
        loginTitle: "", //if loginTitle open a login dialog
        debug: true
    },
    statusCode: {ok: 200, error: 300, timeout: 301},
    jsonEval: function (data) {
        try {
            if ($.type(data) == 'string')
                return eval('(' + data + ')');
            else return data;
        } catch (e) {
            return {};
        }
    },
    msg: function (key, args) {
        var _format = function (str, args) {
            args = args || [];
            var result = str || "";
            for (var i = 0; i < args.length; i++) {
                result = result.replace(new RegExp("\\{" + i + "\\}", "g"), args[i]);
            }
            return result;
        }
        return _format(this._msg[key], args);
    },
    init: function () {
        console.log('init');
    },
    initUI: function () {

    },
    debug: function (msg) {
        if (this._set.debug) {
            if (typeof(console) != "undefined") console.log(msg);
            else alert(msg);
        }
    },
    ajaxError: function (xhr, ajaxOptions, thrownError) {
        $alertMsg.error(xhr);
    },
    ajaxDone: function (json) {
        if (this._set.debug) {
            this.debug(json);
            alert('success');
        }
    },
    init: function (pageFrag, options) {
        var op = $.extend({
            loginUrl: "login.html", loginTitle: null, callback: null, debug: false,
            statusCode: {}
        }, options);
        this._set.loginUrl = op.loginUrl;
        this._set.loginTitle = op.loginTitle;
        this._set.debug = op.debug;
        $.extend($sw.statusCode, op.statusCode);
        $.extend($sw.pageInfo, op.pageInfo);

        jQuery.ajax({
            type: 'GET',
            url: pageFrag,
            dataType: 'xml',
            timeout: 50000,
            cache: false,
            error: function (xhr) {
                alert('Error loading XML document: ' + pageFrag + "\nHttp status: " + xhr.status + " " + xhr.statusText);
            },
            success: function (xml) {
                $(xml).find("_PAGE_").each(function () {
                    var pageId = $(this).attr("id");
                    if (pageId) $sw.frag[pageId] = $(this).text();
                });

                $(xml).find("_MSG_").each(function () {
                    var id = $(this).attr("id");
                    if (id) $sw._msg[id] = $(this).text();
                });

                if (jQuery.isFunction(op.callback)) op.callback();
            }
        });

//        var _doc = $(document);
//        if (!_doc.isBind($sw.eventType.pageClear)) {
//            _doc.bind($sw.eventType.pageClear, function (event) {
//                var box = event.target;
//                if ($.fn.xheditor) {
//                    $("textarea.editor", box).xheditor(false);
//                }
//            });
//        }
    }
};


(function ($) {


    $.fn.extend({
        /**
         * @param {Object} op: {type:GET/POST, url:ajax请求地址, data:ajax请求参数列表, callback:回调函数 }
         */
        ajaxGet: function () {
            console.log('init ajax get');
            var $this = $(this);
            var callback = eval($this.attr("callback"));
            var url = $this.attr("action");

            $.ajax({
                type: 'GET',
                url: url,
//                data: op.data,
                cache: false,
                success: function (response) {
                    var json = $sw.jsonEval(response);
                    if ($.isFunction(callback)) callback(json);

                },
                error: function () {
                    console.log('error');
                }
            });
        },
        ajaxUrl: function (op) {
            var $this = $(this);

            $this.trigger(DWZ.eventType.pageClear);

            $.ajax({
                type: op.type || 'GET',
                url: op.url,
                data: op.data,
                cache: false,
                success: function (response) {
                    var json = DWZ.jsonEval(response);

                    if (json.statusCode == DWZ.statusCode.error) {
                        if (json.message) alertMsg.error(json.message);
                    } else {
                        $this.html(response).initUI();
                        if ($.isFunction(op.callback)) op.callback(response);
                    }

                },
                error: DWZ.ajaxError,
                statusCode: {
                    503: function (xhr, ajaxOptions, thrownError) {
                        alert(DWZ.msg("statusCode_503") || thrownError);
                    }
                }
            });
        },
        loadUrl: function (url, data, callback) {
            console.log("loadUrl");
            var $this = $(this);
            $this.each(function (i, self) {

                console.log(self);
                console.log(i);
            });

        },
        initUI: function () {
            return this.each(function () {
                if ($.isFunction(initUI)) initUI(this);
            });
        },

        isBind: function (type) {
            var _events = $(this).data("events");
            return _events && type && _events[type];
        },
        /**
         * 输出firebug日志
         * @param {Object} msg
         */
        log: function (msg) {
            return this.each(function () {
                if (console) console.log("%s: %o", msg, this);
            });
        }
    });


    /**
     * 扩展String方法
     */
    $.extend(String.prototype, {
        isPositiveInteger: function () {
            return (new RegExp(/^[1-9]\d*$/).test(this));
        },
        isInteger: function () {
            return (new RegExp(/^\d+$/).test(this));
        },
        isNumber: function (value, element) {
            return (new RegExp(/^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/).test(this));
        },
        trim: function () {
            return this.replace(/(^\s*)|(\s*$)|\r|\n/g, "");
        },
        startsWith: function (pattern) {
            return this.indexOf(pattern) === 0;
        },
        endsWith: function (pattern) {
            var d = this.length - pattern.length;
            return d >= 0 && this.lastIndexOf(pattern) === d;
        },
        replaceSuffix: function (index) {
            return this.replace(/\[[0-9]+\]/, '[' + index + ']').replace('#index#', index);
        },
        trans: function () {
            return this.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
        },
        encodeTXT: function () {
            return (this).replaceAll('&', '&amp;').replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll(" ", "&nbsp;");
        },
        replaceAll: function (os, ns) {
            return this.replace(new RegExp(os, "gm"), ns);
        },
        replaceTm: function ($data) {
            if (!$data) return this;
            return this.replace(RegExp("({[A-Za-z_]+[A-Za-z0-9_]*})", "g"), function ($1) {
                return $data[$1.replace(/[{}]+/g, "")];
            });
        },
        replaceTmById: function (_box) {
            var $parent = _box || $(document);
            return this.replace(RegExp("({[A-Za-z_]+[A-Za-z0-9_]*})", "g"), function ($1) {
                var $input = $parent.find("#" + $1.replace(/[{}]+/g, ""));
                return $input.val() ? $input.val() : $1;
            });
        },
        isFinishedTm: function () {
            return !(new RegExp("{[A-Za-z_]+[A-Za-z0-9_]*}").test(this));
        },
        skipChar: function (ch) {
            if (!this || this.length === 0) {
                return '';
            }
            if (this.charAt(0) === ch) {
                return this.substring(1).skipChar(ch);
            }
            return this;
        },
        isValidPwd: function () {
            return (new RegExp(/^([_]|[a-zA-Z0-9]){6,32}$/).test(this));
        },
        isValidMail: function () {
            return(new RegExp(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/).test(this.trim()));
        },
        isSpaces: function () {
            for (var i = 0; i < this.length; i += 1) {
                var ch = this.charAt(i);
                if (ch != ' ' && ch != "\n" && ch != "\t" && ch != "\r") {
                    return false;
                }
            }
            return true;
        },
        isPhone: function () {
            return (new RegExp(/(^([0-9]{3,4}[-])?\d{3,8}(-\d{1,6})?$)|(^\([0-9]{3,4}\)\d{3,8}(\(\d{1,6}\))?$)|(^\d{3,8}$)/).test(this));
        },
        isUrl: function () {
            return (new RegExp(/^[a-zA-z]+:\/\/([a-zA-Z0-9\-\.]+)([-\w .\/?%&=:]*)$/).test(this));
        },
        isExternalUrl: function () {
            return this.isUrl() && this.indexOf("://" + document.domain) == -1;
        }
    });
})
    (jQuery);

