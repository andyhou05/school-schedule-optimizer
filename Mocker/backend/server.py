from flask import request, jsonify
from config import app, db
from models import Course

@app.route("/courses", methods=["GET"])
def get_courses():
    courses = Course.query.all()
    json_courses = list(map(lambda x : x.to_json(), courses))
    return jsonify({"courses": json_courses})

@app.route("/create_course", methods=["POST"])
def create_course():
    section = request.json.get("section")
    course_id = request.json.get("courseId")
    name = request.json.get("name")
    seats = request.json.get("seats")
    
    if not section or not course_id or not name or not seats:
        return (jsonify({"message":"You must enter a section, course id, name, and number of seats"}), 400)
    
    new_course = Course(section=section, course_id=course_id, name=name, seats=seats)
    try:
        db.session.add(new_course)
        db.session.commit()
    except Exception as e:
        return jsonify({"message":str(e)}), 400
    
    return jsonify({"message":"Course created"}), 201

@app.route("/update_course/<int:id>", methods = ["PATCH"])
def update_course(id):
    course = Course.query.get(id)
    
    if not course:
        return jsonify({"message": "Course not found"}), 404
    
    data = request.json
    course.section = data.get("section", course.section)
    course.course_id = data.get("courseId", course.course_id)
    course.name = data.get("name", course.name)
    course.seats = data.get("seats", course.seats)
    
    db.session.commit()
    return jsonify({"message":"Course updates"}), 200

@app.route("/delete_course/<int:id>", methods=["DELETE"])
def delete_course(id):
    course = Course.query.get(id)
    
    if not course:
        return jsonify({"message":"Course not found"}), 404
    db.session.delete(course)
    db.session.commit()
    
    return jsonify({"message":"Course deleted"}), 200

@app.route("/")
def hello():
    return "Hello"

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)