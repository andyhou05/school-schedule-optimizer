from flask import request, jsonify

from scripts.schedule.generator import generate_schedule
from models import Period
from models import Teacher
from models import TeacherRatings
from config import app, db

# CRUD operations for TeacherRatings

@app.route("/teacher_ratings", methods=["GET"])
def get_teacher_ratings():
    teachers = TeacherRatings.query.all()
    json_teachers = list(map(lambda x: x.to_json(), teachers))
    return jsonify({"teachers":json_teachers}), 200

@app.route("/create_teacher_rating", methods=["POST"])
def create_teacher_rating():
    name = request.json.get("name")
    rating = request.json.get("rating")
    link = request.json.get("link")
    
    if not name:
        return jsonify({"message":"You must enter a name"}), 400
    new_teacher_rating = TeacherRatings(name=name, rating=rating, link=link)
    try:
        db.session.add(new_teacher_rating)
        db.session.commit()
    except Exception as e:
        return jsonify({"message":str(e)}), 400
    return jsonify({"message":"Teacher Rating created"}), 201

@app.route("/update_teacher_rating/<int:id>", methods=["PATCH"])
def update_teacher_rating(id):
    teacher = TeacherRatings.query.get(id)
    
    if not teacher:
        return jsonify({"message":"Teacher Rating not found"}), 404
    
    data = request.json
    teacher.name = data.get("name", teacher.name)
    teacher.link = data.get("link", teacher.link)
    teacher.rating = data.get("rating", teacher.rating)
    db.session.commit()
    return jsonify({"message":"Teacher Rating updated"}), 200

@app.route("/delete_teacher_rating/<int:id>", methods=["DELETE"])
def delete_teacher_rating(id):
    teacher = TeacherRatings.query.get(id)
    
    if not teacher:
        return jsonify({"message":"Teacher Rating not found"}), 404
    
    db.session.delete(teacher)
    db.session.commit()
    return jsonify({"message":"Teacher Rating deleted"}), 200

@app.route("/get_teacher_rating/<int:teacher_id>", methods=["GET"])
def get_teacher_rating(teacher_id):
    teacher_ratings = TeacherRatings.query.filter(TeacherRatings.teacher_id == teacher_id).all()
    
    if not teacher_ratings:
        return jsonify({"message": "Teacher Rating not found"}), 404
    json_teacher_ratings = list(map(lambda x: x.to_json(), teacher_ratings))
    return jsonify({"teacherRatings": json_teacher_ratings}), 200

# CRUD operations for Teacher

@app.route("/teachers", methods=["GET"])
def get_teachers():
    teachers = Teacher.query.all()
    json_teachers = list(map(lambda x: x.to_json(), teachers))
    return jsonify({"teachers":json_teachers}), 200

@app.route("/create_teacher", methods=["POST"])
def create_teacher():
    name = request.json.get("name")
    
    if not name:
        return jsonify({"message":"You must enter a name"}), 400
    new_teacher = Teacher(name=name)
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
    teacher.name = data.get("name", teacher.name)
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
    
# CRUD operations for Courses

@app.route("/courses", methods=["GET"])
def get_courses():
    courses = Period.query.all()
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
    intensive = request.json.get("intensive")
    
    if not section or not course_id or not name or not seats or not time:
        return (jsonify({"message":"You must enter a section, course id, name, time slot, and number of seats"}), 400)
    
    new_course = Period(section=section, course_id=course_id, name=name, seats=seats, teacher_id=teacher_id, time=time, intensive=intensive)
    try:
        db.session.add(new_course)
        db.session.commit()
    except Exception as e:
        return jsonify({"message":str(e)}), 400
    
    return jsonify({"message":"Course created"}), 201

@app.route("/update_course/<int:id>", methods = ["PATCH"])
def update_course(id):
    course = Period.query.get(id)
    
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
    course = Period.query.get(id)
    
    if not course:
        return jsonify({"message":"Course not found"}), 404
    db.session.delete(course)
    db.session.commit()
    
    return jsonify({"message":"Course deleted"}), 200

# Route to generate schedule
@app.route("/generate_schedule", methods=["POST"])
def generate_schedules():
    data = request.get_json()
    selected_courses = data.get("courses")
    specific_courses = data.get("specificCourses", [])
    preferences = data.get("preferences", {})
    
    if not selected_courses and not specific_courses:
        return jsonify({"message":"Invalid request, you must enter a course."}), 400
    
    schedules = generate_schedule(requested_course_ids=selected_courses, preferences=preferences, specific_courses=specific_courses)
    
    # Return teacher information for frontend
    teacher_ratings = {}
    for schedule in schedules:
        for period in schedule["periods"]:
            if teacher_ratings.get(period["teacherId"]) is None:
                current_ratings = TeacherRatings.query.filter(TeacherRatings.teacher_id == period["teacherId"]).all()
                
                # Avg teacher rating across all instances
                ratings_list = [teacher.rating for teacher in current_ratings if teacher.rating is not None]
                avg_rating = sum(ratings_list)/len(ratings_list) if (len(ratings_list) != 0) else None
                
                # All RateMyTeacher links
                links = [teacher.link for teacher in current_ratings]

                teacher_ratings[period["teacherId"]] = {"avgRating": avg_rating, "links": links}
            
    return jsonify(schedules, {"teacherRatings": teacher_ratings}), 200
    

@app.route("/")
def hello():
    return "Hello"

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)