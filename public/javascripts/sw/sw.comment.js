"use strict";

var $Comment = {
  initialize: function () {
    var self = this;
    self.viewDidload();
  },

  viewDidload: function(){
    var self = this;

    $("#operationarea i").bind("mouseenter", function(){
      self.renderRank($(event.target).attr("rank"));
    });

    $("#operationarea i").bind("mouseleave", function(){
      self.renderRank($("#comment_rank").attr("value"));
    });

    $("#operationarea i").bind("click", function(){
      $("#comment_rank").attr("value", $(event.target).attr("rank"));
      self.toggleBtn();
    });

    $("#comment_text").bind("keyup", function(){
      self.toggleBtn();
    });

    $("#comment_commit").bind("click", function(){
      if(!appDetail.isPreview) {
        self.postComment();
      }
    });

    new ButtonGroup("commentRange", "current", function() {
      self.getComments(1);
    }).init();

    self.getComments(1);
  },

  getComments: function(pageNum){
    var self = this;
    var appId = appDetail.appId;
    var version = appDetail.appVersion;
    var url = "/app/comment/list.json?appId=" + appId + "&version=" + version +
      "&start=" + ((pageNum - 1) * smart.DEFAULT_PAGE_SIZE) + "&count=" +
      smart.DEFAULT_PAGE_SIZE + "&range=" + $("#commentRange").attr("value");
    smart.doget(url, function(err, data){
      self.renderComments(err, data);
      smart.pagination(data.totalItems, smart.DEFAULT_PAGE_SIZE, pageNum, "pagination", function(pageNum) {
        self.getComments(pageNum);
      });
    });
  },

  renderComments:function(err, data){
    var tmpl = $("#comment-template").html()
      , container = $("#comment_list");

    var comments = data.items;

    container.html("");

    _.each(comments, function(comment){
      var rank = comment.rank;
      if(rank>5) {
        rank = 5;
      }
      if(rank<0) {
        rank = 0;
      }

      var rankHtml = "";
      for (var i = 0; i < 5; i++) {
        if (i<rank){
          rankHtml += "<i class='icon-star'></i>";
        } else {
          rankHtml += "<i class='icon-star-empty'></i>";
        }
      }

      container.append(_.template(tmpl, {
          comment: comment.comment
        , rank: rankHtml
        , createBy: comment.user.first
        , createAt: smart.date(comment.createAt)
        , version: comment.version
        }));
    });
  },

  postComment: function(){
    var self = this;
    var appId = appDetail.appId;
    var version = appDetail.appVersion;
    var data = {
        appId: appId
      , version: version
      , comment: $("#comment_text").attr("value")
      , rank: $("#comment_rank").attr("value")
      };

    var url = "/app/comment/create.json";
    smart.dopost(url, data, function(err, result){
      $("#comment_text").attr("value","");
      $("#comment_rank").attr("value",0);
      self.renderRank(0);
      self.toggleBtn();
      self.getComments(1);
    });
  },

  toggleBtn: function(){
    var rank = $("#comment_rank").attr("value")
      , comment = $("#comment_text").attr("value");
    if (comment && comment !== "" && rank !== "0") {
      $("#comment_commit").attr("disabled", false);
    } else {
      $("#comment_commit").attr("disabled", true);
    }
  },

  renderRank: function(rank){
    if (rank > 5) {
      rank = 5;
    }
    if (rank < 0) {
      rank = 0;
    }

    _.each($("#operationarea i"), function (item) {
      if ($(item).attr("rank") > rank) {
        $(item).removeClass("icon-star");
        $(item).addClass("icon-star-empty");
      } else {
        $(item).removeClass("icon-star-empty");
        $(item).addClass("icon-star");
      }
    });
  },

  clear: function() {
    $("#comment_list").html("");
  }
};