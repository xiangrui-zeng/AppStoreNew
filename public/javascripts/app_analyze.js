/**
 * Created by xiangrui.zeng@gmail.com on 14/01/07.
 */

"use strict";

$(function () {

  events();
});


function events() {
  $("#searchdateNum").bind("click", function () {
    $("#myfirstchart").empty();
    var data = {
      "startDate" :  $("#startdateNum").val()
    , "endDate"   :  $("#enddateNum").val()
    };
    var tmpDateStart = new Date(data.startDate);
    var tmpDateEnd = new Date(data.endDate);
    var dateCount = (tmpDateEnd-tmpDateStart)/86400000+1;
    var dd = new Date();
    dd = tmpDateStart;
    var areaDate = [];

    smart.dopost("/app/analyze.json", data, function(err, result){
      if(err)
      {
        alert("err");
      }else{
        for(var i = 0; i < dateCount; i++){
          var conter = 0;
          var tmpDate = formatDate(dd.getFullYear(), dd.getMonth()+1, dd.getDate());
          for (var j = 0; j < result.data.length; j++){
            if( result.data[j].createAt.substr(0,10) <= tmpDate ){
              conter++;
            } else{
              break;
            }
          }
          var tempData = {
            day: tmpDate
           ,value: conter
          } ;
          areaDate[i] = tempData;
          dd.setDate(dd.getDate() + 1);
        }
        tmpLine = areaDate;
        reloadNum ();
      }

    });
  });

  $("#searchdateOsType").bind("click", function () {
    $("#hero-area").empty();
    var data = {
      "startDate" :  $("#startdateOsTy").val()
    , "endDate"   :  $("#enddateOsTy").val()
    };
    var tmpDateStart = new Date(data.startDate);
    var tmpDateEnd = new Date(data.endDate);
    var dateCount = (tmpDateEnd-tmpDateStart)/86400000+1;
    var dd = new Date();
    dd = tmpDateStart;
    var areaDate = [];

    smart.dopost("/app/analyze.json", data, function(err, result){
      if(err)
      {
        alert("err");
      }else{
        for(var i = 0; i < dateCount; i++){
          var IOSconter = 0
            , Andriodconter = 0
            , Winconter = 0;
          var tmpDate = formatDate(dd.getFullYear(), dd.getMonth()+1, dd.getDate());
          for (var j = 0; j < result.data.length; j++){
            if( result.data[j].createAt.substr(0,10) <= tmpDate ){
              if(result.data[j].appType === "10001"){
                IOSconter++;
              } else if(result.data[j].appType === "10002"){
                Andriodconter++;
              } else if(result.data[j].appType === "10003"){
                Winconter++;
              }
            } else{
              break;
            }
          }
          var tempData = {
            period: tmpDate
           ,IOS: IOSconter
           ,Andriod:Andriodconter
           ,Win: Winconter
          } ;
          areaDate[i] = tempData;
          dd.setDate(dd.getDate() + 1);
        }
        tmpArea = areaDate;
        reloadOsTy ();
      }

    });
  });

  $("#searchdateAppTy").bind("click", function () {
    $("#hero-bar").empty();
    var data = {
      "startDate" :  $("#startdateAppTy").val()
      , "endDate"   :  $("#enddateAppTy").val()
    };

    smart.dopost("/app/analyze.json", data, function(err, result){
      if(err)
      {
        alert("err");
      }else{
        var counter20001 = 0
          , counter20002 = 0
          , counter20003 = 0
          , counter20004 = 0
          , counter20005 = 0
          , counter20006 = 0
          , counter20007 = 0
          , counter20008 = 0
          , counter20009 = 0
          , counter20010 = 0;
        for (var j = 0; j < result.data.length; j++){
          for (var k = 0; k < result.data[j].category.length; k++){
            if(result.data[j].category[k] === "20001"){
              counter20001++;
            } else if(result.data[j].category[k] === "20002"){
              counter20002++;
            } else if(result.data[j].category[k] === "20003"){
              counter20003++;
            }else if(result.data[j].category[k] === "20004"){
              counter20004++;
            }else if(result.data[j].category[k] === "20005"){
              counter20005++;
            }else if(result.data[j].category[k] === "20006"){
              counter20006++;
            }else if(result.data[j].category[k] === "20007"){
              counter20007++;
            }else if(result.data[j].category[k] === "20008"){
              counter20008++;
            }else if(result.data[j].category[k] === "20009"){
              counter20009++;
            }else{
              counter20010++;
            }
          }
        }
        var bardata=  [
          {type: "贩卖", geekbench: counter20001 },
          {type: "制造", geekbench: counter20002 },
          {type: "政府", geekbench: counter20003 },
          {type: "金融", geekbench: counter20004 },
          {type: "运输", geekbench: counter20005 },
          {type: "服务", geekbench: counter20006 },
          {type: "通信", geekbench: counter20007 },
          {type: "电器", geekbench: counter20008 },
          {type: "教育", geekbench: counter20009 },
          {type: "其他", geekbench: counter20010 }
        ];
        tmpBar = bardata;
        reloadAppTy ();
      }

    });
  });


}

function formatDate(year, month, day){

  var newDate= year+"-";
  if (month <= 9){
    newDate = newDate+"0"+month;
  } else{
    newDate = newDate+month;
  }
  if (day <= 9){
    newDate = newDate+"-0"+day;
  } else{
    newDate = newDate+"-"+day;
  }

  return newDate;
}

