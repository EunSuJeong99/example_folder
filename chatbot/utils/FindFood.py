class FindFood:
    
    def __init__(self, db):
        self.db = db
        
    def searchFood(self, intent_name, label):
        sql = "select m_food from menu "
        
        if intent_name == '기분':
            col = "m_feel"
        elif intent_name == '날씨':
            col = "m_weather"
        elif intent_name == '상황':
            col = "m_situation"
            
        sql = sql + "where " + col + f" like '%{label}%'"
        
        # 동일한 답변이 2개 이상인 경우, 랜덤으로 선택
        sql = sql + " order by rand() limit 1"  

        answer = self.db.select_one(sql)

        return (answer['m_food'])