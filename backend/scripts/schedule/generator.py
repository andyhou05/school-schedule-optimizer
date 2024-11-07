from backend.models import Period
from backend.scripts.helper import connect_db
from backend.scripts.schedule import group
from backend.scripts.schedule import scorer
from sqlalchemy.orm import Session

def filter_day_off(courses: list[list[Period]], day_off: str | None) -> list[list[Period]]:
    """ Filters courses based on a preference of a day off.

    Args:
        courses (list[list[Period]]): List of courses, the inner lists are the periods that represent the course's schedule.
        day_off (str | None): The preference on which day off the user wants, None if no preference.

    Returns:
        list[list[Period]]: Filtered courses that do not contain any periods on the requested day off.
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

def is_time_conflict(schedule: list[Period], period_to_check: Period) -> bool:
    """ Returns whether or not there is a time conflict between a schedule and a period.

    Args:
        schedule (list[Period]): Partial schedule whose periods we want to look for a conflict.
        period_to_check (Period): The period we want to check for a conflict.

    Returns:
        bool: Returns True if there is a time conflict, else False.
    """
    
    start, end = scorer.get_earliest_course_time([period_to_check]), scorer.get_latest_course_time([period_to_check])
    for period in schedule:
        if period.day == period_to_check.day:
            current_start, current_end = scorer.get_earliest_course_time([period]), scorer.get_latest_course_time([period])
            if start < current_end and end > current_start:
                return True
    return False 
        

def generate_schedule(requested_course_ids: list[str], preferences: dict, session: Session, n_results: int = 5) -> list[dict]:
    """ Generates n_result schedules based on a beam search algorithm using user preferences to return close optimal results.

    Args:
        requested_classes (list[str]): List of course ids the user wants to have.
        preferences (dict): User preferences for schedule generation, can include dayOff, time, and breaks. If the user has no preferences, an empty dict can be used as input.
        session (Session): Session object used to connect to the database.
        n_results (int, optional): Number of schedules generated. Defaults to 5.

    Returns:
        list[dict]: List of dictionaries containing the schedules (key: "periods") and their scores (key: "scores)
    """
    
    schedules = [{"periods": [], "score": 0}]
    periods = session.query(Period).filter(Period.course_id.in_(requested_course_ids)).all()
    
    # Filter courses by user day off preference
    possible_courses = list(group.group_periods(periods).values())
    filtered_day_off_courses = filter_day_off(possible_courses, preferences.get("day off"))
    
    # Group courses by their course ids and find the occurences to optimize for beam search
    grouped_courses, course_frequencies = group.group_courses(filtered_day_off_courses)
    
    # Beam Search:
    # - Start filling the schedule with the course with the least amount of occurences
    course_order = sorted(course_frequencies, key = course_frequencies.get)
    
    # We keep track of the course_number to make sure all requested courses get added.
    for course_number, course_id in enumerate(course_order):
        course_options = grouped_courses.get(course_id)
        
        # temp_schedules is used to keep track of all possible schedules when looking at any given course, we will keep the top 'n_result' schedules
        temp_schedules = []
        for course_option in course_options:
            for schedule in schedules:
                
                # We try to add every course_option of a given course to every schedules cached
                current_periods = schedule["periods"].copy()
                for new_period in course_option:
                    if is_time_conflict(current_periods, new_period):
                        current_periods = None
                        break
                    current_periods.append(new_period)
                        
                if current_periods is not None:
                    score = scorer.score_schedule(current_periods, course_number/len(requested_course_ids), preferences, session) 
                    temp_schedules.append({"periods": current_periods, "score": score})
                   
        schedules = sorted(temp_schedules, key = lambda x: x["score"], reverse=True)[:n_results]
        
    return schedules
        