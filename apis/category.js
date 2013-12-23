var category = require('../modules/mod_category')
  , util = smart.framework.util
  , response  = smart.framework.response;
//获取种类信息
exports.getCategory = function (req_, res_) {

 // return res_.send(json.dataSchema(category.getCategories()));
  response.send(res_, "", category.getCategories());
};
