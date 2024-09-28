from backend.models import Course
from backend.scripts.helper import connect_db

def group_periods(periods: list[Course]) -> dict:
    grouped_periods = {}
    for period in periods:
        key = (period.course_id, period.section)
        if key not in grouped_periods:
            grouped_periods[key] = []
        grouped_periods[key].append(period)
    return grouped_periods

def filter_day_off(courses: list[list[Course]], day_off: str):
    filtered = []
    for course in courses:
        period_on_day_off = False
        for period in course:
            if period.day == day_off:
                period_on_day_off = True
                break
        if not period_on_day_off:
            filtered.append(course)
    return filtered
    

def generate_schedule(grouped_periods: list[str], preferences: dict):
    # breaks, time, day off
    session = connect_db()
    periods = session.query(Course).filter(Course.course_id.in_(grouped_periods)).all()
    possible_courses = list(group_periods(periods).values())
    filtered_courses = filter_day_off(possible_courses, preferences["day off"])
    
    print(filtered_courses)
        