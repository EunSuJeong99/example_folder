

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
    $result_form = $("#result_from");
    $chatbot=$("#chatbot");
    $gk=$("#gk");

    firstTxt = "안녕하세요 ReLu 챗봇입니다."

    // 인사, 이미지 출력
    helloImg = "<img style='margin:0;' src='/static/img/hello.gif'>";
    bottext = "<div style='margin:15px 0;padding-left:5px;text-align:left;'><span style='padding:3px 10px;background-color:#DDD;border-radius:3px;'>" + firstTxt + "</span></div>";
    backimg="<img style='margin:0;width:100%;height:800px;border-radius:2%' src='/static/back_img/fd.gif'>";
    
    $gk.append(backimg);
    $chatbox.append(helloImg);
    $chatbox.append(bottext);

    btnCall()

    // 스크롤 조정하기
    $chatbox.animate({scrollTop: $chatbox.prop('scrollHeight')});

    // 먼저 입력했던 내용은 지우기
    $("#chattext").val("");
    $("#chattext").focus();

}  // end 챗봇 인사


var bottext1

var rebtncall

// 기능 버튼 부르는 함수
function btnCall() {

    $btntype = "";
    $plus = "";    // 이전에 입력한 것을 기억하기 위해

    bottextStart = "<div style='margin:15px 0;padding-left:5px;text-align:left;'><span style='padding:3px 10px;background-color:#DDD;border-radius:3px;'>";
    bottextEnd = "</span></div>";

    $chatbox.append("<button id='btn1' class='button'>" + '메뉴추천' + "</button>");
    $chatbox.append("<button id='btn2' class='button'>" + '주변가게' + "</button>");
    $chatbox.append("<button id='btn3' class='button'>" + '복볼복' + "</button>");
    $chatbox.append("<button id='btn4' class='button'>" + '예산추천' + "</button>");
    $chatbox.append("<button id='btn5' class='button'>" + '레시피' + "</button>");
    $chatbox.append("<button id='btn6' class='button'>" + '상황별' + "</button>");
    $chatbox.append("<br>");
    $chatbox.append("<br>");

    $("#btn1").click(function(){
        bottext = "메뉴추천 기능을 시작하겠습니다.";

        $btntype = 'category';

        $chatbox.append(bottextStart + bottext + bottextEnd);

        bottext2 = "1.양식 2.중식 3.한식 4.일식 5.디저트  / 1~5번에서 하나를 입력해주세요."
        bottext3 = "ex)양식  /  양식 추천해줘"
        setTimeout(function() {
            $chatbox.append(bottextStart + bottext2 + bottextEnd);
        }, 1000);
        setTimeout(function() {
            $chatbox.append(bottextStart + bottext3 + bottextEnd);
        }, 1000);

        bottext1 = bottext
    });

    $("#btn2").click(function(){
        bottext = "주변가게 기능을 시작하겠습니다.";
        $btntype = 'store';
        $chatbox.append(bottextStart + bottext + bottextEnd);
        bottext = "현재 위치가 어디신가요?";
        setTimeout(function() {
            $chatbox.append(bottextStart + bottext + bottextEnd);
        }, 1000);
    });

    $("#btn3").click(function(){
        bottext = "복불복 기능을 시작하겠습니다.";

        $btntype = 'roulette';

        $chatbox.append(bottextStart + bottext + bottextEnd);
    });

    $("#btn4").click(function(){
        bottext = "예산추천 기능을 시작하겠습니다.";
        
        $btntype = 'money';

        $chatbox.append(bottextStart + bottext + bottextEnd);
        
        bottext2 = "1인당 예산을 입력해주세요. ex)10000"
        setTimeout(function() {
            $chatbox.append(bottextStart + bottext2 + bottextEnd);
        }, 1000);
    });

    $("#btn5").click(function(){
        bottext = "레시피 기능을 시작하겠습니다.";

        $chatbox.append(bottextStart + bottext + bottextEnd);

        
        bottext2 = "원하는 레시피의 음식명을 입력해주세요!"
        setTimeout(function() {
            $chatbox.append(bottextStart + bottext2 + bottextEnd);
        }, 1000);
        bottext1="원하는 레시피의 음식명을 입력해주세요!"
    });

    $("#btn6").click(function(){
        bottext = "상황별 추천을 시작하겠습니다.";
        $chatbox.append(bottextStart + bottext + bottextEnd);
        
        bottext2 = "기분, 날씨 또는 상황을 입력해주세요!"
        $chatbox.append(bottextStart + bottext2 + bottextEnd);

        $btntype = 'three_situ';
    });
} // end 버튼 부르는 함수

function send_message(){
    const chattext = $("#chattext").val().trim();

    rebtncall = chattext

    // 입력한 메세지가 없으면 리턴
    if(chattext == ""){
        $("#chattext").focus();
        return;
    }

    // 입력한 채팅 출력
    addtext = "<div style='margin:15px 0;text-align:right;'> <span style='padding:3px 10px;background-color:#3388cc;border-radius:3px;'>" + chattext + "</span></div>";
    $("#chatbox").append(addtext);    


    // 상황별 기능에서 사용
    if($btntype == 'three_situ' && $plus != "" && isNaN($plus)) {
        $btntype = 'plus';

    }else if($btntype == 'three_situ') {
        $plus = $("#chattext").val();  // 상황별에서 기억될 챗 따로 담음
    }

    // 예산 추천기능에서 사용
    if($btntype == 'money' && $plus != "" && !isNaN($plus)) {
        $btntype = 'money_plus';

    } else if($btntype == 'money') {
        $plus = $("#chattext").val();
    }



    // API 서버에 보낼 데이터 준비
    const jsonData = {
        query: chattext,
        bottype: "WebClient",
        btntype: $btntype,
        plus: $plus   // 상황별, 예산별의 추가정보
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
            bottext = "<div style='margin:15px 0;padding-left:5px;text-align:left;'><span style='padding:3px 10px;background-color:#DDD;border-radius:3px;'>" + response.Answer + "</span></div>";
            $chatbox.append(bottext);
            
            if ($btntype == 'store' && response.Intent == '위치') {
                bottext = "드시고 싶은 음식이 있으신가요?";
                setTimeout(function() {
                    $chatbox.append(bottextStart + bottext + bottextEnd);
                }, 1600);        
                loc = response.NER.split(',')[0].slice(3,-1)
                console.log(loc)
            } else if ($btntype == 'store' && response.Intent == '음식') {
                console.log(response.NER.split(',')[0].slice(3,-1))
                initTmap(response.NER.split(',')[0].slice(3,-1), loc)
            } else if ($btntype == 'store' && (response.Intent == '기분' || response.Intent == '상황' || response.Intent == '날씨')) {
                console.log(response.Answer.slice(0,-10))
                a = response.Answer.slice(0,-10)
            } else if ($btntype == 'store' && response.Answer == '이에 맞는 음식을 추천해드릴게요!') {
                initTmap(a, loc)
            }

            // 맛있게드세요할때 gif 출력
            if (response.Img) {
                img_src = "/static/img/" + response.Img;
                helloImg = `<img style='margin:0;' src='${img_src}'>`;

                $chatbox.append(helloImg)
            }

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

    if (bottext1 == "메뉴추천 기능을 시작하겠습니다."){
        mapt(chattext)
    }else if (bottext1=="원하는 레시피의 음식명을 입력해주세요!"){
        recipe()
    }

    if (rebtncall=="버튼"){ // 버튼 다시 불러오기
        rebtn(bottext1)
        btnCall()
    }

} // end 



function rebtn(chattext){ // 기존 버튼 삭제
    
    $("#btn1").attr('id','btnx');
    $("#btn2").attr('id','btnx');
    $("#btn3").attr('id','btnx');
    $("#btn4").attr('id','btnx');
    $("#btn5").attr('id','btnx');
    $("#btn6").attr('id','btnx');
    
    
    // 단순한 버튼의 새로운 생성이 아닌 btnCall 에 있는 다른 함수와 연계된 것도 고려해야한다.
}





function mapt(chattext){
    if (chattext.indexOf("식") != -1){
        categorychat = chattext
    }else if (chattext.indexOf("디저트") != -1){
        categorychat = chattext
    }


    if (chattext.indexOf("역") != -1){
        locationchat = chattext
        initTmap(categorychat, locationchat)
    }else if (chattext.indexOf("동") != -1){
        locationchat = chattext
        initTmap(categorychat, locationchat)
    }else if (chattext.indexOf("시") != -1){
        locationchat = chattext
        initTmap(categorychat, locationchat)
    }
}




var map, marker;
var markerArr = [];

function initTmap(category, location){

    $("#result_form").html("");
    
   callTmp(category, location)

    // 1. 지도 띄우기
   map = new Tmapv2.Map("map_div", {
       center: new Tmapv2.LatLng(37.4995811, 127.0338292),   // 역삼역
       width : "100%",
       height : "450px",
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
               "appKey" : "l7xx9d2797cd120541969ed28d3107a096d1",
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
               var innerHtml ="";   // Search Reulsts 결과값 노출 위한 변수
               var positionBounds = new Tmapv2.LatLngBounds();      //맵에 결과물 확인 하기 위한 LatLngBounds객체 생성
               
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
                   positionBounds.extend(markerPosition);   // LatLngBounds의 객체 확장
               }
               
               $("#searchResult").html(innerHtml);   //searchResult 결과값 노출
               map.panToBounds(positionBounds);   // 확장된 bounds의 중심으로 이동시키기
               map.zoomOut();
               
           },
           error:function(request,status,error){
               console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
           }
       });nbsp
   });

   
    // 결과 자동클릭
    $(document).ready(function(){
		$("#btn_select").trigger('click');

	});

}


function callTmp(category, location){

    m1 = m1 = "<div><input type='text' class='text_custom' id='searchKeyword' name='searchKeyword' value="+ location + "&nbsp;"+ category +"><button style='border:0;background-color:violet' id='btn_select'>적용하기</button></div>"+"<div id='map_div' class='map_wrap' style='float:left'></div><div><div style='width: 30%; float:left;''><div class='title'><strong>Search Results</strong></div></div></div>"+"<div class='rst_wrap'  style='height: 300px; overflow: auto; position: relative; width: 100%'><div class='rst mCustomScrollbar'><ul id='searchResult' name='searchResult'><li>검색결과</li></ul></div></div>"


    $result_form = $("#result_form");

    $result_form.append(m1)
    

}


// -----------------------------------------------------------------------


function popOpen() {

    var modalPop = $('.modal-wrap');
    var modalBg = $('.modal-bg'); 

    $(modalPop).show();
    $(modalBg).show();

}

 function popClose() {
   var modalPop = $('.modal-wrap');
   var modalBg = $('.modal-bg');

   $(modalPop).hide();
   $(modalBg).hide();

}

function recipe(){
    var pageNum = 1;
    $("#result_form").html("");
    $.ajax({
        method: "GET",
        url: "https://dapi.kakao.com/v2/search/vclip",
        data: { query: $("#chattext").val()+'레시피', page: pageNum},
        headers: {Authorization: "KakaoAK c271c8053e77f9a25128d1dca2d53523"}
    }).done(function (msg) {
        console.log(msg);
        for (var i = 0; i < 10; i++){
            $("#result_form").append('<strong>제목 : </strong>'
            + msg.documents[i].title +'<br>');
            $("#result_form").append("<strong>저자 : </strong> "
            + msg.documents[i].author + "<br>");
            $("#result_form").append("<a href='"+ msg.documents[i].url +"'>"
            +"<img src='" + msg.documents[i].thumbnail + "'/><br><hr>");
        }
    });
}


$(function(){
$("#confirm").click(function(){
modalClose(); //모달 닫기 함수 호출

//컨펌 이벤트 처리
});
$("#modal-open").click(function(){        
$("#popup").css('display','flex').hide().fadeIn();
//팝업을 flex속성으로 바꿔준 후 hide()로 숨기고 다시 fadeIn()으로 효과
});
$("#close").click(function(){
modalClose(); //모달 닫기 함수 호출
});
function modalClose(){
$("#popup").fadeOut(); //페이드아웃 효과
}
});