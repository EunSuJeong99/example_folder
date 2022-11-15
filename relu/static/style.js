
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

}  // end 챗봇 인사


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
} // end 버튼 부르는 함수

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
            $chatbox = $("#chatbox");

            // 답변 출력
            bottext = "<div style='margin:15px 0;padding-left:5px;text-align:left;'><span style='padding:3px 10px;background-color:#DDD;border-radius:3px;'>" + response.Answer + "</span></div>";
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
} // end send message 함수

