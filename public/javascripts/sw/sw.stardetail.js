"use strict";

var appDetail = {

  appId: null,
  isPreview: null,

  show: function(appId, isPreview) {
    this.appId = appId;
    this.isPreview = isPreview;

    this.clear();
    this.initialize();
    $("#appModal").modal("show");
  },

  clear: function() {
    $Comment.clear();

    $("#appIcon").attr("src", null);
    $("#appName").html("");
    $("#appVersion").html("");
    $("#appScore i").remove();
    $("#userCount").html("");
    $("#appCategory").html("");
    $("#devicetType").html("");
    $("#gallery").html("");
    $("#lastUpdate").html("");
    $("#copyRight").html("");
    $("#appSize").html("");
    $("#downloadCount").html("");
  },

  initialize: function() {
    // 初始化评价框
    $Comment.initialize();

    // 获取分类，渲染画面
    this.fetchCategory();
  },

  fetchCategory: function() {
    var self = this;
    smart.doget("/app/category.json", function(err, category){

      var device = [], industry = [];
      _.each(category.items, function(item){
        if (item.code === 10000) { // 设备
          device = item.items;
        }
        if (item.code === 20000) { // 业种
          industry = item.items;
        }
      });

      self.render(device, industry);
    });
  },

  render: function(device, industry) {
    var self = this;

    // 获取详细信息，显示
    smart.doget("/app/info.json?app_id=" + self.appId, function(err, app) {

      // 头部
      // 图标
      $("#appIcon").attr("src", "/picture/" + app.icon.small);
      // 应用名
      $("#appName").html(_.escape(app.name));
      // 版本号
      $('#appVersion').html("v" + app.version);
      // 评价等级
      smart.doget("/app/comment/ranktotal.json?appId=" + self.appId, function(err, rank) {

        var avg = rank ? rank.sum / rank.count : 0
          , count = rank ? rank.count : 0;

        var tmpl = $("#score-template").html();
        $("#appScore").html(_.template(tmpl, {"avg": avg}));
        $("#userCount").html("(" + count + ")");
      });
      // 分类
      if (app.category && app.category.length > 0) {
        var category = [];
        _.each(app.category, function(item){
          category.push(self.codeName(industry, item));
        });
        $("#appCategory").html(category.join(","));
      }
      // 设备种类
      $("#devicetType").html(self.codeName(device, app.appType));

      // 概要
      // 截图
      var gallery = $("#gallery");
      var tmpl = $("#gallery-template").html();
      _.each(app.screenshot, function(imgId){
        gallery.append(_.template(tmpl, {"imgId": imgId}));
      });

      // 最终更新日
      $("#lastUpdate").html(smart.date(app.updateAt).substr(2, 8));
      // 版权所有
      // TODO
      // 应用大小
      $("#appSize").html(app.size);
      // 下载量
      // TODO

//      // 产品概要
//      var tmpl = $("#attach-template").html()
//        , descriptionValue = _.escape(app.description).replace(new RegExp("\r?\n", "g"), "<br />")
//        , description = $("#description");
//      description.html(descriptionValue);
//      if (app.pptfile) {
//        description.append(_.template(tmpl, {fileid: app.pptfile, filename: "説明資料"}));
//      }
//
//      // Release Note
//      var releasenoteValue = app.release_note.replace(new RegExp("\r?\n", "g"), "<br />");
//      $("#releasenote").html(_.escape(releasenoteValue));
//
//      // 支持
//      var supportValue = app.support.replace(new RegExp("\r?\n", "g"), "<br />");
//      $("#support").html(_.escape(supportValue));
//
//      // 注意事项
//      var precautionsValue = app.notice.replace(new RegExp("\r?\n", "g"), "<br />");
//      $("#precautions").html(_.escape(precautionsValue));

      // 下载按钮
//      var download = $("#download");
//      if (app.downloadURL) {
//        download.attr("href", app.downloadURL);
//      } else {
//        download.hide();
//      }
    });
  },

  codeName: function (map, code) {// 获取指定分类的名称
    var result = "";
    _.each(map, function (item) {
      if (item.code === code) {
        result = item.name;
      }
    });

    return result;
  }
};
