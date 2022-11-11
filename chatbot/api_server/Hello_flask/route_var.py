from flask import Flask
app = Flask(__name__)

@app.route('/')
def hello():
    return 'Hello Flask'

@app.route('/info/<name>')
def get_name(name):
    return "hello {}".format(name)

@app.route('/user/<int:id>')
def get_user(id):
    return f"user id {id}"

# 복수개 routing 지정 가능
@app.route('/json/<int:dest_id>/<message>')
@app.route('/JSON/<int:dest_id>/<message>')
def send_message(dest_id, message):
    json = {
        "bot_id": dest_id,
        "message": message
    }
    return json  # dict 를 리턴하면 정말 application/json 으로 response 된다!!




if __name__ == "__main__":
    app.run(debug=True)