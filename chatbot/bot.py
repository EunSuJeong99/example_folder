# bot.py
import threading
import json
import os
import random

from config.DatabaseConfig import *
from utils.Database import Database
from utils.BotServer import BotServer
from utils.Preprocess import Preprocess
from models.intent.IntentModel import IntentModel
from models.intent.FeelModel import FeelModel
from models.intent.WeatherModel import WeatherModel
from models.intent.SituationModel import SituationModel
from models.intent.YNModel import YNModel
from models.ner.NerModel import NerModel
from utils.FindAnswer import FindAnswer
from utils.FindMoney import FindMoney
from utils.FindFood import FindFood
from utils.FindYN import FindYN
from utils.FindStore import FindStore


# 전처리 객체 생성
p = Preprocess(word2index_dic='train_tools/dict/chatbot_dict.bin', userdic='utils/user_dic.tsv')

# 의도 파악 모델
intent = IntentModel(model_name='models/intent/intent_model.h5', preprocess=p)

# 감정 파악 모델
feel = FeelModel(model_name='models/intent/feel_model.h5', preprocess=p)

# 날씨 파악 모델
weather = WeatherModel(model_name='models/intent/weather_model.h5', preprocess=p)

# 상황 파악 모델
situation = SituationModel(model_name='models/intent/situation_model.h5', preprocess=p)

# YN 파악 모델
yn = YNModel(model_name='models/intent/yn_model.h5', preprocess=p)

# 개체명 인식 모델
ner = NerModel(model_name='models/ner/ner_model.h5', preprocess=p)

# 클라리언트 요청을 수행하는 쓰레드 (에 담을) 함수
def to_client(conn, addr, params):
    db = params['db']
    
    try:
        db.connect()  
        
        # 데이터 수신
        read = conn.recv(2048)   # 수신 데이터가 있을 때까지 블로킹
        print('==='*20)
        print('Connection from: %s' % str(addr))      
        
        if read is None or not read:
            # 클라이언트 연결이 끊어지거나, 오류가 있는 경우
            print('클라이언트 연결 끊어짐')
            exit(0)  # Thread 종료    
        
        # json 데이터로 변환
        recv_json_data = json.loads(read.decode())
        print("데이터 수신 : ", recv_json_data)
        query = recv_json_data['Query']  # 클라이언트로부터 전송된 질의어
        btntype = recv_json_data['BtnType']
        
        # 의도 파악
        intent_predict = intent.predict_class(query)
        intent_name = intent.labels[intent_predict]
        print("의도 파악: "+ intent_name)

        # 개체명 파악
        ner_predicts = ner.predict(query)
        ner_tags = ner.predict_tags(query)

        print(ner_tags)


        # 추가정보❗
        plus = recv_json_data['Plus']
        print(plus)

        if plus.isdigit():
            plus_money = int(plus)    # 추가 money에 관한 정보
            plus_intent_name = ""
        
        else:   # 추가 상황별에 관한 정보
            plus_intent_predict = intent.predict_class(plus)
            plus_intent_name = intent.labels[plus_intent_predict]
            plus_money = ""

            print(f"상황별의 추가 의도 파악: {ner_tags}")



        # if intent_name == "추가":
        #     yn_label = yn.predict_class(query)
        #     try:
        #         find = FindYN(db)
        #         answer = find.searchYN(yn_label)     
        #     except:
        #         answer = "에러"
            
        #     sent_json_data_str = {    # response 할 JSON 객체 준비
        #         "Query" : query,
        #         'Answer' : answer
        #     }
            
        #     message = json.dumps(sent_json_data_str)
        #     conn.send(message.encode())  # responses

        #     return


        # 룰렛일때 여기 들어온다
        if btntype == 'roulette':
            if intent_name == '음식':
                if len(ner_tags) < 2 or len(ner_tags) > 5:

                    answer = "음식을 2개 이상 5개 이하로 입력해주세요"

                    sent_json_data_str = {    # response 할 JSON 객체 준비
                    "Query" : query,
                    "Answer": answer,
                    "Intent": intent_name
                    }
                    
                    message = json.dumps(sent_json_data_str)
                    conn.send(message.encode())  # responses

                    return
                
                else:
                    food_list = query.split(',')

                    print(food_list)

                    random.shuffle(food_list)   # 원본 변화?

                    print(food_list)

                    return_food = food_list[0]

                    answer = return_food + "(이)가 당첨!! 맛있게 드세요😊😊"

                    sent_json_data_str = {    # response 할 JSON 객체 준비
                        "Query" : query,
                        "Answer": answer,
                        "Intent": intent_name,
                        "Img": 'thank_you.gif'
                    }
                    
                    message = json.dumps(sent_json_data_str)
                    conn.send(message.encode())  # responses

                    return



        # 기분, 날씨, 상황일때 여기 들어온다
        if btntype == 'three_situ' or btntype == 'store':
            if intent_name == '기분' or intent_name == '날씨' or intent_name == '상황':
                # 기분, 날씨, 상황 가져오기
                if intent_name == '기분':
                    si_label = feel.predict_class(query)
                elif intent_name == '날씨':
                    si_label = weather.predict_class(query)
                elif intent_name == '상황':
                    si_label = situation.predict_class(query)

                print(intent_name)

                # 음식 검색해오기
                try:
                    if btntype == 'three_situ':
                        findfood = FindFood(db)
                        answer = findfood.searchFood(intent_name, si_label)      
                        answer = answer + "는(은) 어떠세요?"
                    elif btntype == 'store':
                        findstore = FindStore(db)
                        answer = findstore.searchStore(intent_name, si_label)
                        answer = answer + "는(은) 어떠세요?"
                except:
                    answer = "밥은...그냥 아무거나 먹어요"
                
                sent_json_data_str = {    # response 할 JSON 객체 준비
                    "Query" : query,
                    "Answer": answer,
                    "Intent": intent_name
                }
                
                message = json.dumps(sent_json_data_str)
                conn.send(message.encode())  # responses

                return

        if btntype == 'plus' or btntype == 'money_plus':   # 추천한 음식이 맘에 안들때
            print("여기에 들어왔다")

            yn_label = yn.predict_class(query)
            str_yn_label = str(yn_label)

            print('추가 라벨: ' + str(str_yn_label))
            
            if str_yn_label == '0':
                print('라벨이 0이야')

                # 예산 추천에서 다시 추천
                if type(plus_money) == int:

                    # 음식 검색해오기
                    try:
                        findmoney = FindMoney(db)
                        answer = findmoney.searchMoney(plus_money)
                        answer = "그럼 " + answer + "는(은) 어떠세요?"
                    except:
                        answer = "돈이 없어요?"
                    
                    sent_json_data_str = {    # response 할 JSON 객체 준비
                        "Query" : query,
                        "Answer": answer
                    }
                    
                    message = json.dumps(sent_json_data_str)
                    conn.send(message.encode())  # responses
                    return

                # 상황별에서의 다시 추천
                elif plus_intent_name == '기분' or plus_intent_name == '날씨' or plus_intent_name == '상황':
                    # 기분, 날씨, 상황 가져오기
                    if plus_intent_name == '기분':
                        si_label = feel.predict_class(query)
                    elif plus_intent_name == '날씨':
                        si_label = weather.predict_class(query)
                    elif plus_intent_name == '상황':
                        si_label = situation.predict_class(query)

                    print(intent_name)

                    # 음식 검색해오기
                    try:
                        findfood = FindFood(db)
                        answer = findfood.searchFood(plus_intent_name, si_label)      
                        answer = "그럼 " + answer + "는(은) 어떠세요?"
                    except:
                        answer = "찾기 힘드네요"
                    
                    sent_json_data_str = {    # response 할 JSON 객체 준비
                        "Query" : query,
                        "Answer": answer,
                        "Intent": intent_name
                    }
                    
                    message = json.dumps(sent_json_data_str)
                    conn.send(message.encode())  # responses

                    return

            
            elif str_yn_label == '1':

                answer = "맛있게 드세요!!!😊😊"

                sent_json_data_str = {    # response 할 JSON 객체 준비
                    "Query" : query,
                    "Answer": answer,
                    "Intent": intent_name,
                    "Img": 'thank_you.gif'
                }
                
                message = json.dumps(sent_json_data_str)
                conn.send(message.encode())  # responses

                return

  
        # 예산에 대한 음식 가져오기
        if btntype == 'money':
            if query.isdigit():
                query = int(query)

                # 음식 검색해오기
                try:
                    findmoney = FindMoney(db)
                    answer = findmoney.searchMoney(query)
                    answer = answer + "는(은) 어떠세요?"
                except:
                    answer = "돈이 없어요?"
                
                sent_json_data_str = {    # response 할 JSON 객체 준비
                    "Query" : query,
                    "Answer": answer
                }
                
                message = json.dumps(sent_json_data_str)
                conn.send(message.encode())  # responses
                return



        # 답변 검색
        try:
            f = FindAnswer(db)
            answer_text = f.search(intent_name, ner_tags)
            answer = f.tag_to_word(ner_predicts, answer_text)            
        except:
            answer = "죄송해요 무슨 말인지 모르겠어요. 조금 더 공부 할게요."
            
        sent_json_data_str = {    # response 할 JSON 객체 준비
            "Query" : query,
            "Answer": answer,
            "Intent": intent_name,
            "NER": str(ner_predicts)            
        }
        
        message = json.dumps(sent_json_data_str)
        conn.send(message.encode())  # responses
        
    except Exception as ex:
        print(ex)
        
    finally:
        if db is not None:
            db.close()
        conn.close()   # 응답이 끝나면 클라이언트와의 연결(클라이언트 소켓) 도 close 해야 한다
    
if __name__ == '__main__':

    # 질문/답변 학습 디비 연결 객체 생성
    db = Database(
        host=DB_HOST, user=DB_USER, password=DB_PASSWORD, db_name=DB_NAME
    )
    print("DB 접속")

    # ① 챗봇 소켓 서버 생성
    port = 5050     # 서버의 통신포트
    listen = 100    # 최대 클라이언트 연결수

    # 봇 서버 동작
    bot = BotServer(port, listen)
    bot.create_sock()
    print("bot start")
    
    while True:
        conn, addr = bot.ready_for_client()  # client 요청 대기하다가 연결 수락!
        
        params = {
            "db": db,
        }
        
        client = threading.Thread(target=to_client, args=(conn, addr, params))
        client.start()   # 쓰레드 시작