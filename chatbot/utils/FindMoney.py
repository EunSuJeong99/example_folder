class FindMoney:
    
    def __init__(self, db):
        self.db = db
        
    def searchMoney(self, query):
        sql = "select m_food from menu "
        
        if query >= 5000:
            start_money = int(query) - 5000
            end_money = int(query) + 1000
            
            where = f"where m_money >= {start_money} and m_money <= {end_money}"

            # 동일한 답변이 2개 이상인 경우, 랜덤으로 선택
            sql = sql + where + " order by rand() limit 1"  

            cc = self.db.select_all(sql)

            print(cc)

            answer = ""

            for i in cc:
                pp = i['m_food']
                answer = answer + pp + "  "

            print(answer)

            return (answer)
        
        else:
            answer = "예산이 너무 적습니다"