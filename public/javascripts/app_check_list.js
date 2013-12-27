/**
 * Created by xiangrui.zeng@gmail.com on 13/12/26.
 */

$(function () {

  'use strict';
  $("#image1").bind("click",function(){
    $("#appModal").modal("show");
  });
  $("#image2").bind("click",function(){
    $("#appModal").modal("show");
  });
  $("#image3").bind("click",function(){
    $("#appModal").modal("show");
  });
  $("#apply").bind("click",function(){
    $("#applyModal").modal("show");
  });
  $("#reject").bind("click",function(){
    $("#rejectModal").modal("show");
  });
  $("#confirmApply").bind("click",function(){
    $("#applyModal").modal("hide");
  });
  events();
});


function events() {


}

