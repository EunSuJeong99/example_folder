class FindStore:
    
    def __init__(self, db):
        self.db = db
        
    def searchStore(self, intent_name, label):
        sql = "select s_food from store "
        
        if intent_name == '기분':
            col = "s_feel"
        elif intent_name == '날씨':
            col = "s_weather"
        elif intent_name == '상황':
            col = "s_situation"
            
        sql = sql + "where " + col + f" like '%{label}%'"
        
        # 동일한 답변이 2개 이상인 경우, 랜덤으로 선택
        sql = sql + " order by rand() limit 1"  

        answer = self.db.select_one(sql)

        return (answer['s_food'])