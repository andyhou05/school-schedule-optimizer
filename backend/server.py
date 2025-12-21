import json
import hashlib

from flask import request, jsonify
from sqlalchemy import and_
from sqlalchemy import tuple_

from scripts.schedule.generator import generate_schedule
from models import Period
from models import Teacher
from models import TeacherRatings
from config import app, db, cache


@app.route("/teacher_ratings", methods=["GET"])
def get_teacher_ratings():
    teachers = TeacherRatings.query.all()
    json_teachers = list(map(lambda x: x.to_json(), teachers))
    return jsonify({"teachers":json_teachers}), 200

@app.route("/get_teacher_rating/<int:teacher_id>", methods=["GET"])
def get_teacher_rating(teacher_id):
    teacher_ratings = TeacherRatings.query.filter(TeacherRatings.teacher_id == teacher_id).all()
    
    if not teacher_ratings:
        return jsonify({"message": "Teacher Rating not found"}), 404
    json_teacher_ratings = list(map(lambda x: x.to_json(), teacher_ratings))
    return jsonify({"teacherRatings": json_teacher_ratings}), 200

@app.route("/teachers", methods=["GET"])
def get_teachers():
    teachers = Teacher.query.all()
    json_teachers = list(map(lambda x: x.to_json(), teachers))
    return jsonify({"teachers":json_teachers}), 200

@app.route("/courses", methods=["GET"])
def get_courses():
    courses = Period.query.all()
    json_courses = list(map(lambda x : x.to_json(), courses))
    return jsonify({"courses": json_courses}), 200

@app.route("/courses/<semester>", methods=["GET"])
def get_courses_semester(semester):
    courses = Period.query.filter(Period.semester == semester).all()
    json_courses = list(map(lambda x : x.to_json(), courses))
    return jsonify({"courses": json_courses}), 200

# Route to check for time conflicts (overlap)
@app.route("/check_conflicts", methods=["POST"])
def check_conflicts():
    data = request.get_json()
    courses = data.get("courses", [])
    
    # Get all course IDs and sections
    course_filters = [(course["courseId"], course["section"]) for course in courses]

    # Query all relevant periods in one go and sort in the DB
    periods = db.session.query(Period).filter(
        tuple_(Period.course_id, Period.section).in_(course_filters)
    ).order_by(Period.day, Period.start_time).all()

    conflicts = []
    pairs = set()
    
    # Check for overlapping periods
    for i in range(len(periods)):
        for j in range(i + 1, len(periods)):
            if periods[i].day != periods[j].day:
                break  # Since they are sorted by day, no need to continue
            
            if periods[i].end_time > periods[j].start_time:
                conflicts.append([periods[i], periods[j]])
                pairs.add((
                    (periods[i].course_id, periods[i].section),
                    (periods[j].course_id, periods[j].section)
                ))
    
    json_conflicts = [[period.to_json() for period in conflict_periods] for conflict_periods in conflicts]
    json_pairs = [[{"courseId": course[0], "section": course[1]} for course in pair] for pair in pairs]
    
    return jsonify({"conflicts": json_conflicts, "pairs": json_pairs}), 200

def make_cache_key(*args, **kwargs):
    """
    Generate a cache key based on the POST request payload.
    """
    payload = request.get_json()
    payload['courses'].sort()
    payload_string = json.dumps(payload, sort_keys=True) # Sort keys to ensure consistency if parameters are not in order
    return hashlib.sha256(payload_string.encode("utf-8")).hexdigest()

# Route to generate schedule
@app.route("/generate_schedule", methods=["POST"])
@cache.cached(timeout=300, make_cache_key=make_cache_key)
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
                teacher = Teacher.query.filter(Teacher.id == period["teacherId"]).first()
                
                # Avg teacher rating across all instances
                avg_rating = teacher.avg_rating * 20 if (teacher.avg_rating is not None) else None # we want it as a %
                
                # All RateMyTeacher links
                links = [teacher.link for teacher in current_ratings]
                
                teacher_ratings[period["teacherId"]] = {"name": teacher.name, "avgRating": avg_rating, "links": links}
            
    return jsonify({"schedules": schedules, "teacherRatings": teacher_ratings}), 200
    

@app.route("/")
def hello():
    return "Hello"


# Create database tables and run server locally
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(host='0.0.0.0', port=5000, debug=True)
