/**
 * @file 存取分类信息的module
 * @author lizheng
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var Categories = {
  code: 0,
  name: "root",
  items: [
    {
      code: 10000,
      name: "デバイス",
      items: [
        { code: "10001", name: "iOS", icon: "icon-apple"},
        { code: "10002", name: "Android", icon: "icon-android" },
        { code: "10003", name: "Web", icon: "icon-desktop" }
      ]
    },
    {
      code: 20000,
      name: "業種",
      items: [
        { code: "20001", name: "販売", icon: "icon-yen" },           // 贩卖/零售"
        { code: "20002", name: "制造", icon: "icon-tags" },          // 制造
        { code: "20003", name: "政府", icon: "icon-building" },      // 政府部门/事业单位
        { code: "20004", name: "金融", icon: "icon-dollar" },        // 金融
        { code: "20005", name: "運輸", icon: "icon-truck" },         // 运输
        { code: "20006", name: "サービス", icon: "icon-thumbs-up" }, // 服务
        { code: "20007", name: "通信", icon: "icon-bullhorn" },     //信息・通信/广播
        { code: "20008", name: "電気", icon: "icon-fire" },         // 电器煤气
        { code: "20009", name: "教育", icon: "icon-book"},          // 教育
        { code: "20010", name: "その他", icon: "icon-bookmark" }    // 其他
      ]
    }
    ,
    {
      code: 30000,
      name: "規模",
      items: [
        { code: "30001", name: "1000~2000" },
        { code: "30002", name: "500~1000" },
        { code: "30003", name: "100~500" },
        { code: "30004", name: "50~100" },
        { code: "30005", name: "~50" }
      ]
    }
  ]
};

/**
 * 根据分类编码获取分类信息
 * @param {Object} category 分类对象
 * @param {String} code 分类编码
 * @return {Object} 分类信息
 */
function _getByCode(category, code) {
  if (category.code === code) {
    return category;
  }

  if (!category.items) {
    return null;
  }

  for (var i = 0; i < category.items.length; i++) {
    var result = _getByCode(category.items[i], code);
    if (result) {
      return result;
    }
  }

  return null;
}

/**
 * 获取分类信息
 * @return {Object} 分类信息
 */
exports.getCategories = function () {
  return Categories;
};

/**
 * 根据分类编码获取分类信息
 * @param {Object} code 分类编码
 * @return {Object} 分类信息
 */
exports.getByCode = function (code) {
  return _getByCode(exports.getCategories(), code);
};

/**
 * 获取设备分类信息
 * @return {Object} 设备分类信息
 */
exports.getAppTypes = function () {
  return exports.getByCode(10000);
};

/**
 * 获取業種分类信息
 * @return {Object} 業種分类信息
 */
exports.getCategoryTypes = function () {
  return exports.getByCode(20000);
};

/**
 * 检查某个分类是否是设备分类
 * @param {Object} code 分类编码
 * @return {Boolean} 業種分类信息
 */
exports.isAppTypes = function (code) {
  var types = exports.getAppTypes();
  for (var i = 0; i < types.items.length; i++) {
    if (types.items[i].code === code) {
      return true;
    }
  }

  return false;
};
