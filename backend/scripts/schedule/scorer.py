import math
from backend.models import Course
from backend.scripts.schedule import group

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
    
def get_latest_course_time(courses: list[Course]) -> int:
    """
    Returns the time block of the class which finishes the latest

    Args:
        courses (list[Course]): List of courses

    Returns:
        int: Time block representing the time of the class that finishes latest
    """
    latest = 0
    for course in courses:
        finish_time = course.time.split("-")[-1] # Grab the time class finishes
        time_block = time_to_int(finish_time)
        latest = time_block if time_block > latest else latest
    return latest

def get_earliest_course_time(courses: list[Course]) -> int:
    """
    Returns the time block of the class which starts the earliest

    Args:
        courses (list[Course]): List of courses

    Returns:
        int: Tune block representing the time of the class that starts the earliest
    """
    earliest = float("inf")
    for course in courses:
        start_time = course.time.split("-")[0] # Grab the time class starts
        time_block = time_to_int(start_time)
        earliest = time_block if time_block < earliest else earliest
    return earliest
    
def score_morning_schedule(schedule: list[Course]) -> float:
    
    #sort courses by day - course finishing latest - convert time to int - calculate score
    
    # Earliest class finishes at 9:30 (4), latest at 18:00 (21)
    earliest_finish, latest_finish = 4, 21
    
    # When scoring, we need to scale to the numbers between the difference
    max_difference = latest_finish - earliest_finish
    
    weekly_schedule = group.group_days(schedule)
    weekly_morning_score = []
    for courses_in_day in weekly_schedule:
        # If there are no classes in the day, score is 100
        if len(courses_in_day) == 0:
            weekly_morning_score.append(100)
            continue
        
        latest = get_latest_course_time(courses_in_day)
        daily_score = ((max_difference - (latest - earliest_finish))/max_difference) * 100
        weekly_morning_score.append(daily_score)
    
    return weekly_morning_score

def score_evening_schedule(schedule: list[Course]):
    # Latest class starts at 16:30 (18), earliest at 8:00 (1)
    latest_start, earliest_start = 18, 1
    
    # When scoring, we need to scale to the numbers between the difference
    max_difference = latest_start - earliest_start
    
    weekly_schedule = group.group_days(schedule)
    weekly_morning_score = []
    for courses_in_day in weekly_schedule:
        # If there are no classes in the day, score is 100
        if len(courses_in_day) == 0:
            weekly_morning_score.append(100)
            continue
        
        earliest = get_earliest_course_time(courses_in_day)
        daily_score = ((max_difference - (latest_start - earliest))/max_difference) * 100
        weekly_morning_score.append(daily_score)
    
    return weekly_morning_score
    
def score_time(courses: list[Course], preference: str):
    return score_morning_schedule(courses) if preference == "morning" else score_evening_schedule(courses)