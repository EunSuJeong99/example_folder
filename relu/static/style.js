
$(function(){

    $(document).click(function(event){
        let txt=event.pageX + ' ' + event.pageY;
        $circle=$('#circle')
        $circle.css({ 
          'left':event.pageX - ($circle.outerWidth(true)/2),
          'top':event.pageY - ($circle.outerHeight(true)/2)
        });
        $circle.stop(true).fadeIn(100,function(){
          $circle.fadeOut(150)
        });
      });

    // SEND 버튼을 누르거나
    $("#sendbtn").click(function(){
        send_message();
    });

    // ENTER key 가 눌리면
    $("#chattext").keyup(function(event){
        if(event.keyCode == 13){
            send_message();
        }
    });

});

// 챗봇 인사
function onload() {
    $chatbox = $("#chatbox");

    firstTxt = "안녕하세요 relu 챗봇입니다."

    // 인사, 이미지 출력
    helloImg = "<img style='margin:0;' src='/static/img/hello.gif'>";
    bottext = "<div style='margin:15px 0;padding-left:5px;text-align:left;'><span style='padding:3px 10px;background-color:#DDD;border-radius:3px;'>" + firstTxt + "</span></div>";
    $chatbox.append(helloImg);
    $chatbox.append(bottext);

    btnCall()

    // 스크롤 조정하기
    $chatbox.animate({scrollTop: $chatbox.prop('scrollHeight')});

    // 먼저 입력했던 내용은 지우기
    $("#chattext").val("");
    $("#chattext").focus();
}

// 기능 버튼 부르는 함수
function btnCall() {
    bottextStart = "<div style='margin:15px 0;padding-left:5px;text-align:left;'><span style='padding:3px 10px;background-color:#DDD;border-radius:3px;'>";
    bottextEnd = "</span></div>";

    $chatbox.append("<button id='btn1' class='button'>" + '메뉴추천' + "</button>");
    $chatbox.append("<button id='btn2' class='button'>" + '주변가게' + "</button>");
    $chatbox.append("<button id='btn3' class='button'>" + '룰렛' + "</button>");
    $chatbox.append("<button id='btn4' class='button'>" + '예산추천' + "</button>");
    $chatbox.append("<button id='btn5' class='button'>" + '레시피' + "</button>");
    $chatbox.append("<br>");
    $chatbox.append("<br>");

    $("#btn1").click(function(){
        bottext = "메뉴추천 기능을 시작하겠습니다.";

        $chatbox.append(bottextStart + bottext + bottextEnd);
    });

    $("#btn2").click(function(){
        bottext = "주변가게 기능을 시작하겠습니다.";

        $chatbox.append(bottextStart + bottext + bottextEnd);
    });

    $("#btn3").click(function(){
        bottext = "룰렛 기능을 시작하겠습니다.";

        $chatbox.append(bottextStart + bottext + bottextEnd);
    });

    $("#btn4").click(function(){
        bottext = "예산추천 기능을 시작하겠습니다.";

        $chatbox.append(bottextStart + bottext + bottextEnd);
    });

    $("#btn5").click(function(){
        bottext = "레시피 기능을 시작하겠습니다.";

        $chatbox.append(bottextStart + bottext + bottextEnd);
    });
}

function send_message(){
    const chattext = $("#chattext").val().trim();

    // 입력한 메세지가 없으면 리턴
    if(chattext == ""){
        $("#chattext").focus();
        return;
    }

    // 입력한 채팅 출력
    addtext = "<div style='margin:15px 0;text-align:right;'> <span style='padding:3px 10px;background-color:#3388cc;border-radius:3px;'>" + chattext + "</span></div>";
    $("#chatbox").append(addtext);    

    // API 서버에 보낼 데이터 준비
    const jsonData = {
        query: chattext,
        bottype: "WebClient",
    };

    $.ajax({
        url: 'http://127.0.0.10:5000/query/TEST',
        type: "POST",
        data: JSON.stringify(jsonData),
        dataType: "JSON",  // 응답받을 데이터 타입
        contentType: "application/json; charset=utf-8",  
        crossDomain: true,
        success: function(response){
            // response.Answer 에 챗봇의 응답메세지가 담겨 있다
            console.log(response)
            $chatbox = $("#chatbox");

            // 답변 출력
            bottext = "<div style='margin:15px 0;text-align:left;'><span style='padding:3px 10px;background-color:#DDD;border-radius:3px;'>" + response.Answer + "</span></div>";
            $chatbox.append(bottext);
            

            // 스크롤 조정하기
            $chatbox.animate({scrollTop: $chatbox.prop('scrollHeight')});

            // 먼저 입력했던 내용은 지우기
            $("#chattext").val("");
            $("#chattext").focus();
        },
    });


    
    let $chat=$('#chat');
    function chat(){
        $chat
            .animate({'bottom':'15px'},500)
            .animate({'bottom':'25px'},500,loopBoat);
    }




    if (chattext.indexOf("식") != -1){
        categorychat = chattext
    }


    if (chattext.indexOf("역") != -1){
        locationchat = chattext
        initTmap(categorychat, locationchat)
    }else if (chattext.indexOf("동") != -1){
        locationchat = chattext
        initTmap(categorychat, locationchat)
    }


} // end 




var map, marker;
var markerArr = [];

function initTmap(category, location){

   callTmp(category, location)

    // 1. 지도 띄우기
   map = new Tmapv2.Map("map_div", {
       center: new Tmapv2.LatLng(37.4995811, 127.0338292),   // 역삼역
       width : "300px",
       height : "800px",
       zoom : 17,
       zoomControl : true,
       scrollwheel : true
       
   });
   
   // 2. POI 통합 검색 API 요청
   $("#btn_select").click(function(){
       
       var searchKeyword = $('#searchKeyword').val();
       $.ajax({
           method:"GET",
           url:"https://apis.openapi.sk.com/tmap/pois?version=1&format=json&callback=result",
           async:false,
           data:{
               "appKey" : "api key 가 필요한 부분!!!!!!!!!",
               "searchKeyword" : searchKeyword,
               "resCoordType" : "EPSG3857",
               "reqCoordType" : "WGS84GEO",
               "count" : 10
           },
           success:function(response){
               var resultpoisData = response.searchPoiInfo.pois.poi;
               
               // 기존 마커, 팝업 제거
               if(markerArr.length > 0){
                   for(var i in markerArr){
                       markerArr[i].setMap(null);
                   }
               }
               var innerHtml ="";	// Search Reulsts 결과값 노출 위한 변수
               var positionBounds = new Tmapv2.LatLngBounds();		//맵에 결과물 확인 하기 위한 LatLngBounds객체 생성
               
               for(var k in resultpoisData){
                   
                   var noorLat = Number(resultpoisData[k].noorLat);
                   var noorLon = Number(resultpoisData[k].noorLon);
                   var name = resultpoisData[k].name;
                   
                   var pointCng = new Tmapv2.Point(noorLon, noorLat);
                   var projectionCng = new Tmapv2.Projection.convertEPSG3857ToWGS84GEO(pointCng);
                   
                   var lat = projectionCng._lat;
                   var lon = projectionCng._lng;
                   
                   var markerPosition = new Tmapv2.LatLng(lat, lon);
                   
                   marker = new Tmapv2.Marker({
                        position : markerPosition,
                        //icon : "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_b_m_a.png",
                        icon : "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_b_m_" + k + ".png",
                       iconSize : new Tmapv2.Size(24, 38),
                       title : name,
                       map:map
                    });
                   
                   innerHtml += "<li><img src='http://tmapapi.sktelecom.com/upload/tmap/marker/pin_b_m_" + k + ".png' style='vertical-align:middle;'/><span>"+name+"</span></li>";
                   
                   markerArr.push(marker);
                   positionBounds.extend(markerPosition);	// LatLngBounds의 객체 확장
               }
               
               $("#searchResult").html(innerHtml);	//searchResult 결과값 노출
               map.panToBounds(positionBounds);	// 확장된 bounds의 중심으로 이동시키기
               map.zoomOut();
               
           },
           error:function(request,status,error){
               console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
           }
       });
   });

}


function callTmp(category, location){

    m1 = "<div><input type='text' class='text_custom' id='searchKeyword' name='searchKeyword' value="+ location + category +"><button id='btn_select'>적용하기</button></div>"+"<div><div style='width: 30%; float:left;''><div class='title'><strong>Search</strong> Results</div><div class='rst_wrap'><div class='rst mCustomScrollbar' style='background-color : rgb(209, 209, 19)'><ul id='searchResult' name='searchResult'><li>검색결과</li></ul></div></div></div><div id='map_div' class='map_wrap' style='float:left'></div></div>"


    $result_form = $("#result_form");

    $result_form.append(m1)
    // $result_form.append(m2)

}