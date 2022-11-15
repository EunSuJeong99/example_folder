import threading
import json
import os

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
from utils.FindFood import FindFood
from utils.FindMoney import FindMoney


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
        
        # 의도 파악
        intent_predict = intent.predict_class(query)
        intent_name = intent.labels[intent_predict]

        # 개체명 파악
        ner_predicts = ner.predict(query)
        ner_tags = ner.predict_tags(query)


        # 기분, 날씨, 상황일 때 여기 들어온다
        if intent_name == '기분' or intent_name == '날씨' or intent_name == '상황':
            # 기분, 날씨, 상황 가져오기
            if intent_name == '기분':
                si_label = feel.predict_class(query)
            elif intent_name == '날씨':
                si_label = weather.predict_class(query)
            elif intent_name == '상황':
                si_label = situation.predict_class(query)

            # 음식 검색해오기
            try:
                findfood = FindFood(db)
                answer = findfood.searchFood(intent_name, si_label)      
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

        # 예산에 대한 음식 가져오기
        if query.isdigit():
            query = int(query)

            # 음식 검색해오기
            try:
                fintmoney = FindMoney(db)
                answer = fintmoney.searchMoney(query)      
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
