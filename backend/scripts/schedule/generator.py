from backend.models import Course
from backend.scripts.helper import connect_db
from backend.scripts.schedule import group
from backend.scripts.schedule import scorer

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

def is_time_conflict(schedule: list[Course], period_to_check: Course) -> bool:
    """ Returns whether or not there is a time conflict between a schedule and a period.

    Args:
        schedule (list[Course]): Partial schedule whose courses we want to look for a conflict.
        course (Course): The period we want to check for a conflict.

    Returns:
        bool: Returns True if there is a time conflict, else False.
    """
    
    start, end = scorer.get_earliest_course_time(period_to_check), scorer.get_latest_course_time(period_to_check)
    for period in schedule:
        if period.day == period_to_check.day:
            current_start, current_end = scorer.get_earliest_course_time([period]), scorer.get_latest_course_time([period])
            if start < current_end and end > current_start:
                return True
    return False 
        

def generate_schedule(requested_classes: list[str], preferences: dict):
    # breaks, time
    session = connect_db()
    periods = session.query(Course).filter(Course.course_id.in_(requested_classes)).all()
    
    # Filter courses by user day off preference
    possible_courses = list(group.group_periods(periods).values())
    filtered_day_off_courses = filter_day_off(possible_courses, preferences.get("day off"))
    
    # Group courses by their course ids and find the occurences to optimize for beam search
    grouped_courses, occurences = group.group_courses(filtered_day_off_courses)
    
    # Beam Search
    course_order = sorted(occurences, key = occurences.get) # Start filling the schedule with the course with the least amount of occurences
    
    