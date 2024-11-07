import math
from backend.models import Period
from backend.models import TeacherRatings
from sqlalchemy.orm import Session
import scorer

def time_to_int(time: str) -> int:
    """
    Converts a time to an integer corresponding to its 30 minute block equivalent on a school schedule.
    The earliest block is 8:00 (1) and the latest block is 18:00 (21)

    Args:
        time (str): The time we want to represent as an integer

    Returns:
        int: The 30 minute time block represented.
    """
    
    hour, minutes = time.strip().split(":")
    time_block = (math.floor(int(hour)) - 8) * 2 + 1
    time_block = time_block + 1 if minutes == "30" else time_block
    return time_block
    
def get_latest_course_time(courses: list[Period]) -> int:
    """
    Returns the time block of the class which finishes the latest

    Args:
        courses (list[Period]): List of periods

    Returns:
        int: Time block representing the time of the class that finishes latest
    """
    
    latest = 0
    for course in courses:
        finish_time = course.time.split("-")[-1] # Grab the time class finishes
        time_block = time_to_int(finish_time)
        latest = time_block if time_block > latest else latest
    return latest

def get_earliest_course_time(courses: list[Period]) -> int:
    """
    Returns the time block of the class which starts the earliest

    Args:
        courses (list[Period]): List of courses

    Returns:
        int: Tune block representing the time of the class that starts the earliest
    """
    
    earliest = float("inf")
    for course in courses:
        start_time = course.time.split("-")[0] # Grab the time class starts
        time_block = time_to_int(start_time)
        earliest = time_block if time_block < earliest else earliest
    return earliest

def get_period_length(period: Period) -> int:
    """ Returns the length of a given course in its 30 minute block equivalent.
    Example: if a course lasts 2 hours, returns 4.

    Args:
        course (Period): Course whose length we want to find

    Returns:
        int: 30 minute block equivalent of the course time length.
    """
    
    start = get_earliest_course_time([period])
    end = get_latest_course_time([period])
    return end - start

def get_avg_teacher_rating(id: int, session: Session) -> float | None:
    """ Returns the avrage rating (0-5) of a teacher based on all reviews from RateMyTeacher.

    Args:
        id (int): ID of the teacher
        session (Session): DB connection session

    Returns:
        float | None: Score between 0-5 of the teacher, returns None if id has no reviews.
    """
    
    ratings = [teacher_rating.rating for teacher_rating in session.query(TeacherRatings).filter(TeacherRatings.teacher_id == id).all() if teacher_rating.rating is not None]
    return sum(ratings)/len(ratings) if (len(ratings) != 0) else None

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