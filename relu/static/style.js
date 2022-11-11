
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
} // end 

