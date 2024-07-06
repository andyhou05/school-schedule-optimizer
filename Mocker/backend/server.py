from flask import request, jsonify
from config import app, db
from models import Course
from models import Teacher

@app.route("/teachers", methods=["GET"])
def get_teachers():
    teachers = Teacher.query.all()
    json_teachers = list(map(lambda x: x.to_json(), teachers))
    return jsonify({"teachers":json_teachers}), 200

@app.route("/create_teacher", methods=["POST"])
def create_teacher():
    first_name = request.json.get("firstName")
    last_name = request.json.get("lastName")
    rating = request.json.get("rating")
    link = request.json.get("link")
    
    if not first_name or not last_name:
        return jsonify({"message":"You must enter a first name and a last name"}), 400
    new_teacher = Teacher(first_name=first_name, last_name=last_name, rating=rating, link=link)
    try:
        db.session.add(new_teacher)
        db.session.commit()
    except Exception as e:
        return jsonify({"message":str(e)}), 400
    return jsonify({"message":"Teacher created"}), 201

@app.route("/update_teacher/<int:id>", methods=["PATCH"])
def update_teacher(id):
    teacher = Teacher.query.get(id)
    
    if not teacher:
        return jsonify({"message":"Teacher not found"}), 404
    
    data = request.json
    teacher.first_name = data.get("firstName", teacher.first_name)
    teacher.last_name = data.get("lastName", teacher.last_name)
    teacher.rating = data.get("rating", teacher.rating)
    db.session.commit()
    return jsonify({"message":"Teacher updated"}), 200

@app.route("/delete_teacher/<int:id>", methods=["DELETE"])
def delete_teacher(id):
    teacher = Teacher.query.get(id)
    
    if not teacher:
        return jsonify({"message":"Teacher not found"}), 404
    
    db.session.delete(teacher)
    db.session.commit()
    return jsonify({"message":"Teacher deleted"}), 200
    
@app.route("/courses", methods=["GET"])
def get_courses():
    courses = Course.query.all()
    json_courses = list(map(lambda x : x.to_json(), courses))
    return jsonify({"courses": json_courses}), 200

@app.route("/create_course", methods=["POST"])
def create_course():
    section = request.json.get("section")
    course_id = request.json.get("courseId")
    name = request.json.get("name")
    seats = request.json.get("seats")
    teacher_id = request.json.get("teacherId")
    time = request.json.get("time")
    
    if not section or not course_id or not name or not seats or not time:
        return (jsonify({"message":"You must enter a section, course id, name, time slot, and number of seats"}), 400)
    
    new_course = Course(section=section, course_id=course_id, name=name, seats=seats, teacher_id=teacher_id, time=time)
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
    return jsonify({"message":"Course updated"}), 200

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