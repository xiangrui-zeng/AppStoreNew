
// 从URL获取应用ID
var app_id = window.location.href.split("/")[4];

$(function () {

  // 初始化评价框
  $Comment.initialize();

  // 获取分类，渲染画面
  smart.doget("/app/category.json", function(err, category){

    var device = [], industrie = [], scale = [];
    _.each(category.items, function(item){
      if (item.code == 10000) { // 设备
        device = item.items;
      }
      if (item.code == 20000) { // 业种
        industrie = item.items;
      }
      if (item.code == 30000) { // 规模
        scale = item.items;
      }
    });

    rander(device, industrie);
  });

  // 分享按钮点击事件
  $("#share").bind("click", function () {
    location.href = 'mailto:';
  });

});

// 用code获取指定的code名称
function codeName(map, code) {
  var result = "";
  _.each(map, function(item){
    if (item.code == code) {
      result = item.name;
    }
  });

  return result;
}

// 填充画面
function rander(device, industrie) {

  // 获取详细信息，显示
  smart.doget("/app/info.json?app_id=" + app_id, function(err, star){

    // 侧栏
    $("#app_name").html(_.escape(star.name));
    $('#version').html(star.version);
    $('#lastupdate').html(smart.date(star.update_date).substr(2, 8));
    $("#info_icon_big").attr("src", "/picture/" + star.icon.big);

    // 应用大小
    if (star.size) {
      $('#appsize').html(star.size);
    } else {
      $('#appsize').parent().hide();
    }

    // 设备种类
    if (star.appType) {
      $("#apptype").html(codeName(device, star.appType));
    } else {
      $("#apptype").parent().hide();
    }

    // 分类
    if (star.category && star.category.length > 0) {
      var category = [];
      _.each(star.category, function(item){
        category.push(codeName(industrie, item));
      });
      $("#category").html(category.join(","));
    } else {
      $("#category").parent().hide();
    }

    // 产品概要
    var tmpl = $('#attach-template').html()
      , descriptionValue = _.escape(star.description).replace(new RegExp('\r?\n', 'g'), '<br />')
      , description = $('#description');
    description.html(descriptionValue);
    if (star.pptfile) {
      description.append(_.template(tmpl, {fileid: star.pptfile, filename: "説明資料"}));
    }

    // Release Note
    var releasenoteValue = star.release_note.replace(new RegExp('\r?\n', 'g'), '<br />');
    $('#releasenote').html(_.escape(releasenoteValue));

    // 支持
    var supportValue = star.support.replace(new RegExp('\r?\n', 'g'), '<br />');
    $('#support').html(_.escape(supportValue));

    // 注意事项
    var precautionsValue = star.notice.replace(new RegExp('\r?\n', 'g'), '<br />');
    $('#precautions').html(_.escape(precautionsValue));

    // 截图
    var gallery = $('#gallery');
    tmpl = $('#gallery-template').html();
    _.each(star.screenshot, function(imgid){
      gallery.append(_.template(tmpl, {'imgid': imgid}));
    });

    // 下载按钮
    var download = $("#download");
    if (star.downloadURL) {
      download.attr("href", star.downloadURL);
    } else {
      download.hide();
    }
  });

  // 获取评价等级
  smart.doget("/app/comment/ranktotal.json?appId=" + app_id, function(err, rank) {

    var avg = rank ? rank.sum / rank.count : 0
      , count = rank ? rank.count : 0;

    var tmpl = $('#score-template').html();
    $('#score').html(_.template(tmpl, {'avg': avg}));
    $('#commenter').html(count);

  });
}