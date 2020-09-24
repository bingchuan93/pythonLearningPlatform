import flask
from flask import request
import sys
import ast

app = flask.Flask(__name__)
app.config["DEBUG"] = True

@app.route('/', methods=['GET'])
def home():
    print('Testing console')
    return "<h1>Flask Server is UP!</h1>"

@app.route('/testCode', methods=['POST'])
def test_code():
    print('TEST')
    if request.method == 'POST':
        posted_data = request.get_json()
        test_cases = posted_data["testCases"]
        for test_case in test_cases:
            print(test_case)
            try:
                testing_value = ast.literal_eval(test_case["content"])
                exec(posted_data["function"], globals())
                result_value = yourFunction(testing_value)
                test_case['result'] = result_value
                test_case['runSuccess'] = True
            except:
                print(sys.exc_info()[0])
                test_case['runSuccess'] = False
        return {
            'success': True,
            'testCaseResults': test_cases
        }
    return {
        'succes': False
    }

app.run(port=7000)