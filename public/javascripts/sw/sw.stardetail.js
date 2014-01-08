"use strict";

var appDetail = {

  appId: null,
  appVersion: null,
  isPreview: null,

  show: function(appId, isPreview) {
    this.appId = appId;
    this.isPreview = isPreview;

    this.clear();
    this.initialize();
    $("#appModal").modal("show");
    $("#profileTab").tab("show");
  },

  clear: function() {
    $("#appIcon").attr("src", null);
    $("#appName").html("");
    $("#appVersion").html("");
    $("#appScore i").remove();
    $("#userCount").html("");
    $("#appCategory").html("");
    $("#devicetType").html("");
    $("#gallery").html("");
    $("#lastUpdate").html("");
    $("#copyright").html("");
    $("#appSize").html("");
    $("#downloadCount").html("");
    $Comment.clear();
  },

  initialize: function() {
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

      self.appVersion = app.version;

      // 头部
      // 图标
      $("#appIcon").attr("src", "/picture/" + app.icon.small);
      // 应用名
      $("#appName").html(_.escape(app.name));
      // 版本号
      $('#appVersion').html("v" + app.version);
      // 评价等级
      var scoreTmpl = $("#score-template").html();
      $("#appScore").html(_.template(scoreTmpl, {"avg": app.rank}));
      $("#userCount").html("(" + app.rankcount + ")");
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
      var galleryTmpl = $("#gallery-template").html();
      _.each(app.screenshot, function(imgId){
        gallery.append(_.template(galleryTmpl, {"imgId": imgId}));
      });

      // 最终更新日
      $("#lastUpdate").html(smart.date(app.updateAt).substr(2, 8));
      // 版权所有
      $("#copyright").html(app.copyright);
      // 应用大小
      $("#appSize").html(app.size);
      // 下载量
      $("#downloadCount").html(app.downloadCount);
      // 详细信息
      $("#detailContent").html(_.escape(app.description).replace(new RegExp("\r?\n", "g"), "<br />"));
      // 系统要求
      var requireInfo = _.template($("#require-template").html(), {
          requireOS: _.escape(app.require.os)
        , requireDevice: _.escape(app.require.device)
        });
      $("#requireContent").html(requireInfo);
      // 更新履历
      $("#updateContent").html(_.escape(app.releaseNote).replace(new RegExp("\r?\n", "g"), "<br />"));

      // 初始化评价框
      $Comment.initialize();

      if(!self.isPreview) {
        // 安装按钮
        $("#downloadBtn").attr("href", app.downloadURL);
        // 分享按钮
        $("#shareBtn").attr("href", "mailto:");
      } else {
        // 安装按钮
        $("#downloadBtn").attr("href", undefined);
        // 分享按钮
        $("#shareBtn").attr("href", undefined);
      }
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
