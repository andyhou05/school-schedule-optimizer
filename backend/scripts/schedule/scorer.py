import math
from backend.models import Course

def time_to_int(time: str) -> int:
    """
    Converts a time to an integer corresponding to its 30 minute block equivalent on a school schedule.
    The earliest block is 8:00 (1) and the latest block is 18:00 (21)

    Args:
        time (str): The time we want to represent as an integer

    Returns:
        int: The 30 minute time block represented.
    """
    
    hour, minutes = time.split(":")
    time_block = (math.floor(int(hour)) - 8) * 2 + 1
    return time_block + 1 if minutes == "30" else time_block
    
def get_latest_course_time(courses: list[Course]) -> int:
    """
    Returns the time block of the class which finishes the latest

    Args:
        courses (list[Course]): _description_

    Returns:
        int: _description_
    """
    latest = 0
    for course in courses:
        finish_time = course.time.split("-")[-1] # Grab the time class finishes
        time_block = time_to_int(finish_time)
        latest = time_block if time_block > latest else latest
    return latest
    
def score_morning_schedule(schedule: list[Course]):
    
    #sort courses by day - course finishing latest - convert time to int - calculate score
    i=0

def score_evening_schedule(schedule: list[Course]):
    i=0

def score_time(courses: list[Course], preference: str):
    return score_morning_schedule(courses) if preference == "morning" else score_evening_schedule(courses)