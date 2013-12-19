
/**
 * 导航栏
 */
(function(Menu) {

  Menu.View = Backbone.View.extend({
    
    el: $('#_navbar'),
    
    initialize: function() {

      // 滚动窗口时，固定导航栏
      $(window).bind("scroll", this.onWindowScroll);

    },

    render: function () {
    },


    /**
     * 滚动窗口时，固定导航栏
     */
    onWindowScroll: function() {
      
      var offset = 50 - $(document).scrollTop();
      offset = offset > 0 ? offset : 0;
      offset = offset > 50 ? 50 : offset;

      $("#_navbar").css("top", offset);
      $('#_searchresult').css("top", offset + 38);
      // $('#_findresult').css("top", offset + 28);

      // 关闭消息提示Popover
      if (offset == 0) {
        $('#_popover').hide();
      }
    }


  });
  
})(smart.view("menu"));
