var devices = [
    {code: 1, name: '手机'}
    ,{code: 2, name: '平板'}
];

exports.getList = function() {
    return devices;
}

exports.getDevice = function(code) {
    for (var i in devices) {
        if(devices[i].code == code)
            return devices[i];
    }
    return null;
}