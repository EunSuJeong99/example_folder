class FindYN:
    
    def __init__(self, db):
        self.db = db
        
    def searchYN(self, label):
        sql = "select answer from answer "
            
        sql = sql + f"where ner = {label}"

        answer = self.db.select_one(sql)

        return (answer['answer'])