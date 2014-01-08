/**
 * Created by xiangrui.zeng@gmail.com on 14/01/07.
 */


$(function () {

  'use strict';
  events();
});


function events() {

  var jsonUrl = "/app/category.json";


  smart.doget(jsonUrl, function(e, result){
    if (smart.error(e, i18n["js.common.search.error"], true)) {
      return;
    }
  });


  function test1 () {
    setTimeout(function(){
      new Morris.Line({
        // ID of the element in which to draw the chart.
        element: 'myfirstchart',
        // Chart data records -- each entry in this array corresponds to a point on
        // the chart.
        data: [
          { year: '2008', value: 20 },
          { year: '2009', value: 10 },
          { year: '2010', value: 5 },
          { year: '2011', value: 5 },
          { year: '2012', value: 20 }
        ],
        // The name of the data record attribute that contains x-values.
        xkey: 'year',
        // A list of names of data record attributes that contain y-values.
        ykeys: ['value'],
        // Labels for the ykeys -- will be displayed when you hover over the
        // chart.
        labels: ['Value']
      });
    },50);
    $("#myfirstchart").empty();

  }

}

