import flask
from flask import request, jsonify
import sys
import ast

app = flask.Flask(__name__)
app.config["DEBUG"] = True

books = [
    {'id': 0,
     'title': 'A Fire Upon the Deep',
     'author': 'Vernor Vinge',
     'first_sentence': 'The coldsleep itself was dreamless.',
     'year_published': '1993'},
    {'id': 1,
     'title': 'The Ones Who Walk Away From Omelas',
     'author': 'Ursula K. Le Guin',
     'first_sentence': 'With a clamor of bells that set the swallows soaring, the Festival of Summer came to the city Omelas, bright-towered by the sea.',
     'published': '1973'},
    {'id': 2,
     'title': 'Dhalgren',
     'author': 'Samuel R. Delany',
     'first_sentence': 'to wound the autumnal city.',
     'published': '1975'}
]

@app.route('/', methods=['GET'])
def home():
    print('Testing console')
    return "<h1>BEE BAA BOO</h1>"

@app.route('/books/all', methods=['GET'])
def api_all():
	code = """
x = 2
y = 3
z = 3 * 2
txt = input('Type:')
print(z)
	"""
	exec(code)
	return jsonify(books)

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