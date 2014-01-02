/**
 * @file 存取评论的api
 * @author lizheng
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var context  = smart.framework.context
  , response = smart.framework.response
  , comment  = require("../controllers/ctrl_comment");

/**
 * 创建评论
 * @param req 请求对象
 * @param res 响应对象
 * @returns {*} 无
 */
exports.add = function (req, res) {

  var handler = new context().bind(req, res);

  comment.add(handler, function (err, result) {
    return response.send(res, err, result);
  });
};

/**
 * 查询评论列表
 * @param req 请求对象
 * @param res 响应对象
 * @returns {*} 无
 */
exports.getList = function (req, res) {

  var handler = new context().bind(req, res);

  comment.getList(handler, function (err, result) {
    return response.send(res, err, result);
  });
};

/**
 * 获取评价的总和及评价人数（用于计算平均评价值）
 * @param req 请求对象
 * @param res 响应对象
 * @returns {*} 无
 */
exports.getRankTotal = function (req, res) {

  var handler = new context().bind(req, res);

  comment.getRankTotal(handler, function (err, result) {
    return response.send(res, err, result);
  });
};