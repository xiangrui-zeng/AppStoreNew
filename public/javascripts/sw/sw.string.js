$sw.string = {
    copyByLeft: function(left, right) {
        if(!right)
            return;
        for(var key in left) {
            if(right[key])
                left[key] = right[key];
        }
    }
    ,bytesToSize: function (bytes) {
        bytes = bytes || 0;
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes == 0) return '0';
        var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    },equalsIgnoreCase: function (str1, str2) {
        if(this.isEmpty(str1) && this.isEmpty(str2))
            return true;
        if(this.isEmpty(str1) || this.isEmpty(str2))
            return false;
        return str1.toLowerCase() == str2.toLowerCase();
    }
    ,isEmpty: function(str) {
        if(str === undefined || str === "" || str === null)
            return true;
        return false;
    }
};