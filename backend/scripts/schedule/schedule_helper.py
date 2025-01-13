from sqlalchemy.orm import Session

import math
from functools import lru_cache

from models import Period
from models import TeacherRatings
from scripts.schedule import scorer
from config import SEMESTER

@lru_cache()
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
    
    return max(time_to_int(course.time.split("-")[-1]) for course in courses)


def get_earliest_course_time(courses: list[Period]) -> int:
    """
    Returns the time block of the class which starts the earliest

    Args:
        courses (list[Period]): List of courses

    Returns:
        int: Time block representing the time of the class that starts the earliest
    """
    
    return min(time_to_int(course.time.split("-")[0]) for course in courses)

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
    
    return [
        course for course in courses
        if not any(period.day == day_off for period in course)
    ]
    
def filter_intensive(courses: list[list[Period]], intensive: bool) -> list[list[Period]]:
    """ Filters courses based on a preference for intensive courses.

    Args:
        courses (list[list[Period]]): List of courses, the inner lists are the periods that represent the course's schedule.
        intensive (bool): The preference on whether the user wants to include intensive courses.

    Returns:
        list[list[Period]]: Filtered courses that do not contain any periods on the requested day off.
    """
    if intensive:
        return courses
    
    return [course for course in courses
            if not any(bool(period.intensive) for period in course)]
    

def is_time_conflict(schedule: list[Period], period_to_check: Period) -> bool:
    """ Returns whether or not there is a time conflict between a schedule and a period.

    Args:
        schedule (list[Period]): Partial schedule whose periods we want to look for a conflict.
        period_to_check (Period): The period we want to check for a conflict.

    Returns:
        bool: Returns True if there is a time conflict, else False.
    """
    
    start, end = get_earliest_course_time([period_to_check]), get_latest_course_time([period_to_check])
    for period in schedule:
        if period.day == period_to_check.day:
            current_start, current_end = get_earliest_course_time([period]), get_latest_course_time([period])
            if start < current_end and end > current_start:
                return True
    return False 

def add_specific_courses(specific_courses: list[dict], session: Session, total_number_of_courses: int, preferences: dict) -> list[dict]:
    """ Adds courses with sepcific sections to a list. 

    Args:
        specific_courses (list[dict]): List of specific courses and sections {"course_id": , "section": }
        session (Session): DB connection session
        total_number_of_courses (int): total number of requested courses, used for scoring
        preferences (dict): User preferences for schedule.

    Returns:
        list[dict]: List of periods and score of the specific courses.
    """
    
    periods = []
    for course_dict in specific_courses:
        course_id = course_dict["course_id"]
        section = course_dict["section"]
        periods.extend(session.query(Period).filter(Period.course_id == course_id, Period.section == section, Period.semester == SEMESTER).all())
    return [{"periods": periods, "score": scorer.score_schedule(periods, len(specific_courses)/total_number_of_courses, preferences, session) }]