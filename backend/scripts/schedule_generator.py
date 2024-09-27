from backend.models import Course
from backend.scripts.helper import connect_db

def group_periods(periods: list[Course]):
    grouped_periods = {}
    for period in periods:
        key = (period.course_id, period.section)
        if key not in grouped_periods:
            grouped_periods[key] = []
        grouped_periods[key].append(period)
    return grouped_periods

def generate_schedule(grouped_periods: list[str], preferences: dict):
    # breaks, time, day off
    session = connect_db()
    periods = session.query(Course).filter(Course.course_id.in_(grouped_periods)).all()
    
    # Need to group periods together by id and section number
    grouped_periods = group_periods(periods)
    
    print(list(grouped_periods.values())[55])