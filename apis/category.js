/**
 * @file 查询分类信息的api
 * @author lizheng
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var response  = smart.framework.response
  , handler   = smart.framework.context
  , category = require("../modules/mod_category");

/**
 * 查询分类
 * @param req 请求对象
 * @param res 响应对象
 * @returns {*} 无
 */
exports.getCategory = function (req_, res_) {
  response.send(res_, null, category.getCategories());
};
