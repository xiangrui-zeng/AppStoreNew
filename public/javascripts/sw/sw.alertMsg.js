var $alertMsg = {


    _types: {error: "error", info: "info", warn: "warn", correct: "correct", confirm: "confirm"},
    _keydownOk: function (event) {
        if (event.keyCode == DWZ.keyCode.ENTER) event.data.target.trigger("click");
        return false;
    },
    _keydownEsc: function (event) {
        if (event.keyCode == DWZ.keyCode.ESC) event.data.target.trigger("click");
    },
    _alert: function (type, msg, options) {

        this._open(type, msg);
    },
    _open: function (type, msg, buttons) {
        if (this._types.error == type) {
            Alertify.log.error(msg);
        } else if(this._types.confirm == type){

            if(confirm(msg)){

                eval("buttons[0].call();");
            }else{

            }
        }else if(this._types.correct ==type){
            Alertify.log.error(msg);
        }else{
            Alertify.log.error(msg);
        }


    },
    /**
     *
     * @param {Object} msg
     * @param {Object} options {okName, okCal, cancelName, cancelCall}
     */
    confirm: function (msg, options) {
        var op = {okName: "ok", okCall: null, cancelName:"quxiao ", cancelCall: null};
        $.extend(op, options);
        var buttons = [
            {name: op.okName, call: op.okCall, keyCode: $sw.keyCode.ENTER},
            {name: op.cancelName, call: op.cancelCall, keyCode: $sw.keyCode.ESC}
        ];
        this._open(this._types.confirm, msg, buttons);
    },
    error: function (msg, options) {
        this._alert(this._types.error, msg, options);
    },
    info: function (msg, options) {

        this._alert(this._types.info, msg, options);
    },
    warn: function (msg, options) {
        this._alert(this._types.warn, msg, options);
    },
    correct: function (msg, options) {
        this._alert(this._types.correct, msg, options);
    }

};