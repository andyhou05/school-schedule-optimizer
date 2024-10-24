from backend.models import Course
from backend.scripts.helper import connect_db
from backend.scripts.schedule import group

def filter_day_off(courses: list[list[Course]], day_off: str | None) -> list[list[Course]]:
    """ Filters courses based on a preference of a day off.

    Args:
        courses (list[list[Course]]): List of courses, the inner lists are the periods that represent the course's schedule.
        day_off (str | None): The preference on which day off the user wants, None if no preference.

    Returns:
        list[list[Course]]: Filtered courses that do not contain any periods on the requested day off.
    """
    
    if day_off is None:
        return courses
    
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
    

def generate_schedule(requested_classes: list[str], preferences: dict):
    # breaks, time
    session = connect_db()
    periods = session.query(Course).filter(Course.course_id.in_(requested_classes)).all()
    
    # Filter courses by user day off preference
    possible_courses = list(group.group_periods(periods).values())
    filtered_day_off_courses = filter_day_off(possible_courses, preferences.get("day off"))
    grouped_courses = group.group_courses(filtered_day_off_courses)
    course_occurences = group.find_occurences(grouped_courses)
    
    print(course_occurences)
    
    # Beam Search
    