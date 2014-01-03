
/**
 * 导航栏
 */
(function(Menu) {

  Menu.View = Backbone.View.extend({
    
    el: $('#_navbar'),
    
    initialize: function() {
      this.render();
      // 滚动窗口时，固定导航栏
      $(window).bind("scroll", this.onWindowScroll);

    },

    render: function () {
      smart.doget("/app/category.json", function (err, data) {

        if(data && data.items){
          var tmpl = $('#template_category_list').html();
          var resultlist = $('#category_list');
          resultlist.empty();

          _.each(data.items, function(category){
            var item_tag = "";
            _.each(category.items, function(item){
              var name = category.name +">"+item.name;
              item_tag += "<a href=\"javascript:filterCategory("+item.code+", '"+name;
              item_tag += "');\"> <i class=\"pull-right "+item.icon+"\"></i>"+item.name+"</a>";
            });console.log(item_tag);

            resultlist.append(_.template(tmpl, {
              "code": category.code
              , "name": category.name
              , "count" : category.items.length
              , "item": item_tag
            }));
          });
        }
      });
    },


    /**
     * 滚动窗口时，固定导航栏
     */
    onWindowScroll: function() {

      var offset = 0;
      $("#_navbar").css("top", offset);
      $('#_searchresult').css("top", offset + 38);

      // 关闭消息提示Popover
      if (offset == 0) {
        $('#_popover').hide();
      }
    }


  });
  
})(smart.view("menu"));
