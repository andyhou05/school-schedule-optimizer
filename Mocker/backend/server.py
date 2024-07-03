from flask import requests, jsonify
from config import app, db
from models import Course

@app.route("/courses", methods=["GET"])
def get_courses():
    courses = Course.query.all()
    json_courses = map(lambda x : x.to_json(), courses)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)