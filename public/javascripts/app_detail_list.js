/**
 * Created by xiangrui.zeng@gmail.com on 13/12/27.
 */


$(function () {

  'use strict';

  events();
});


function events() {
  $("#image1").bind("click",function(){
    $("#appModal").modal("show");
  });
  $("#image2").bind("click",function(){
    $("#appModal").modal("show");
  });
  $("#image3").bind("click",function(){
    $("#appModal").modal("show");
  });

}