var Categories = {
  id: undefined
  ,code: 0
  ,name: "root"
  ,items: [
    {
      id: undefined
      ,code: 10000
      ,name: "デバイス"
      ,items: [
        {  id: undefined, code: "10001" ,name: "iOS", icon:"icon-apple"}
        ,{ id: undefined, code: "10002" ,name: "Android", icon:"icon-android" }
        ,{ id: undefined, code: "10003" ,name: "Web", icon:"icon-desktop" }
      ]
    }
    ,{
      id: undefined
      ,code: 20000
       ,name: "業種"
      ,items: [
        {  id: undefined, code: "20001" ,name: "販売", icon:"icon-yen" } // 贩卖/零售"
        ,{ id: undefined, code: "20002" ,name: "制造", icon:"icon-tags" }  // 制造
        ,{ id: undefined, code: "20003" ,name: "政府", icon:"icon-building" } // 政府部门/事业单位
        ,{ id: undefined, code: "20004" ,name: "金融", icon:"icon-dollar" } // 金融
        ,{ id: undefined, code: "20005" ,name: "運輸", icon:"icon-truck" } // 运输
        ,{ id: undefined, code: "20006" ,name: "サービス", icon:"icon-thumbs-up" } // 服务
        ,{ id: undefined, code: "20007" ,name: "通信", icon:"icon-bullhorn" } //信息・通信/广播
        ,{ id: undefined, code: "20008" ,name: "電気", icon:"icon-fire" } // 电器煤气
        ,{ id: undefined, code: "20009" ,name: "教育", icon:"icon-book"} // 教育
        ,{ id: undefined, code: "20010" ,name: "その他", icon:"icon-bookmark" } // 其他
      ]
    }
     ,{
      id: undefined
      ,code: 30000
       ,name: "規模"
      ,items: [
          {  id: undefined, code: "30001" ,name: "2000人以下" }
          ,{ id: undefined, code: "30002" ,name: "1000人以下" }
          ,{ id: undefined, code: "30003" ,name: "500人以下" }
          ,{ id: undefined, code: "30004" ,name: "100人以下" }
          ,{ id: undefined, code: "30005" ,name: "50人以下" }
      ]
    }
  ]
};

//获取Categories
exports.getCategories = function () {
    return Categories;
}

//获取Categories中的code类型
exports.getByCode = function (code) {
    return _getByByCode(exports.getCategories(), code);
}

function _getByByCode(category, code) {
    if (category.code == code)
        return category;

    if (!category.items)
        return null;

    for (var i in category.items) {
        var result = _getByByCode(category.items[i], code);
        if (result)
            return result;
    }

    return null;
}

exports.getAppTypes = function () {
    return exports.getByCode(10000);
}
exports.getCategoryTypes = function () {
    console.log("getCategoryTypes");
    return exports.getByCode(20000);
}

exports.isAppTypes = function (category) {
    var code = category;
    var c_types = exports.getAppTypes();
    for (var i in c_types.items) {
        if(c_types.items[i].code == code)
            return true;
    }

    return false;
}

exports.getAppTypeName = function (category) {
  if(category) {
    var code = category;
    var c_types = exports.getAppTypes();
    for (var i in c_types.items) {
      if(c_types.items[i].code == code)
        return c_types.items[i].name;
    }
  }
  return "";
}

exports.getAppTypeName = function (category) {
    if(category) {
        var code = category;
        var c_types = exports.getAppTypes();
        for (var i in c_types.items) {
            if(c_types.items[i].code == code)
                return c_types.items[i].name;
        }
    }
    return "";
}