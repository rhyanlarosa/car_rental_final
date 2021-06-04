import sentimentAnalysis
from flask import Flask
from flask_jsonpify import jsonify
from flask_restful import Resource, Api
from flask_cors import CORS, cross_origin

app = Flask(__name__)
api = Api(app)
CORS(app)

class Analyze(Resource):
    def get(self, sentence):
        try:
            model = sentimentAnalysis.generate_model()
            sentiment = sentimentAnalysis.analyze(sentence, model)
            print(f"Sentiment: {sentiment}")
            return jsonify({"sentiment":sentiment})
        except Exception as e:
            print(e)
            return jsonify ({"sentiment" : "Error at exception "+ e})


api.add_resource(Analyze, '/sentiment-analysis/<path:sentence>') #Route 2

if __name__ == "__main__":
    app.run(port=5002)