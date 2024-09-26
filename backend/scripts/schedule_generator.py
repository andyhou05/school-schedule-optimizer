from backend.models import Course
from backend.scripts.helper import connect_db

def generate_course(courses: list[str], preferences: list[str]):
    session = connect_db()
    possible_courses = session.query(Course).filter(Course.course_id.in_(courses)).all()
    
    