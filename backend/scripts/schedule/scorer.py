import math
from backend.models import Course
from backend.models import TeacherRatings
from backend.scripts.schedule import group
from backend.scripts.helper import connect_db

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

def get_course_length(course: Course) -> int:
    """ Returns the length of a given course in its 30 minute block equivalent.
    Example: if a course lasts 2 hours, returns 4.

    Args:
        course (Course): Course whose length we want to find

    Returns:
        int: 30 minute block equivalent of the course time length.
    """
    
    start = get_earliest_course_time([course])
    end = get_latest_course_time([course])
    return end - start

def get_avg_teacher_rating(id: int) -> float | None:
    """ Returns the avrage rating (0-5) of a teacher based on all reviews from RateMyTeacher.

    Args:
        id (int): ID of the teacher

    Returns:
        float | None: Score between 0-5 of the teacher, returns None if id has no reviews.
    """
    
    session = connect_db()
    ratings = [teacher_rating.rating for teacher_rating in session.query(TeacherRatings).filter(TeacherRatings.teacher_id == id).all() if teacher_rating.rating is not None]
    return sum(ratings)/len(ratings) if (len(ratings) != 0) else None

def score_short_breaks(schedule: list[Course]) -> float:
    """ Returns a score between 0 and 100 to rate a schedule based on how little breaks there are.
    The less amount of breaks there are the better the schedule will score
    
    Args:
        schedule (list[Course]): List of courses we want to rate.

    Returns:
        float: Score between 0 and 100.
    """
    
    weekly_schedule = group.group_days(schedule)
    scores = []
    for courses_in_day in weekly_schedule:
        if len(courses_in_day) == 0:
            continue
        earliest = get_earliest_course_time(courses_in_day)
        latest = get_latest_course_time(courses_in_day)
        
        # Find the time in school
        school_hours = latest - earliest
        
        # Find the time in class
        class_hours = sum([get_course_length(course) for course in courses_in_day])
        
        # Find the time in breaks
        break_hours = school_hours - class_hours
        
        # Calculate score as a percentage
        current_score = 100 - (break_hours/school_hours)
        scores.append(current_score)
    return sum(scores)/len(scores)

def score_regular_breaks(schedule: list[Course]) -> float:
    """ Returns a score between 0 and 100 to rate a schedule based on how many breaks there are.
    The schedule will score better when there is an adequate amount of breaks/class-time (15 min/hour).
    Example: a day with 4 hours of class and 1 hour break will score better than a day with 4 hours of class and 4 hours break.
    
    Args:
        schedule (list[Course]): List of courses we want to rate.

    Returns:
        float: Score between 0 and 100.
    """
    
    ideal_break_to_course_ratio = 0.5
    weekly_schedule = group.group_days(schedule)
    scores = []
    for courses_in_day in weekly_schedule:
        if len(courses_in_day) < 2:
            continue
        earliest = get_earliest_course_time(courses_in_day)
        latest = get_latest_course_time(courses_in_day)
        
        # Find the time in school
        school_hours = latest - earliest
        
        # Find the time in class
        class_hours = sum([get_course_length(course) for course in courses_in_day])
        
        # Find the time in breaks
        break_hours = school_hours - class_hours
        
        # Calculate score
        current_break_to_course_ratio = break_hours/class_hours
        score = 100 - abs((ideal_break_to_course_ratio - current_break_to_course_ratio)/ideal_break_to_course_ratio) * 100
        scores.append(score)
    return sum(scores)/len(scores)
        
def score_schedule_teachers(schedule: list[Course]) -> float:
    """ Returns a score between 0 and 100 to rate a schedule based on how good the teachers are.
    The schedule will score better when the teacher ratings are higher.
    
    Args:
        schedule (list[Course]): List of courses we want to rate.

    Returns:
        float: Score between 0 and 100.
    """
    
    session = connect_db()
    total_class_time = 0
    score = 0
    
    # Find the total class time for teachers with a rating
    for course in schedule:
        teacher_rating = get_avg_teacher_rating(course.teacher_id)
        total_class_time += get_course_length(course) if teacher_rating is not None else 0 
    
    # Calculate the score of each class based on the teacher ratings
    for course in schedule:
        course_length = get_course_length(course)
        teacher_rating = get_avg_teacher_rating(course.teacher_id)
        name = session.query(TeacherRatings).filter(TeacherRatings.teacher_id == course.teacher_id).first().name
        if teacher_rating is None:
            continue
        
        # Calculate its weight proportional to the class length
        teacher_score = teacher_rating/5 * 100
        score += teacher_score * (course_length/total_class_time)
    return score
    
def score_schedule_time(schedule: list[Course], preference: str):
    # Latest class starts at 16:30 (18), earliest at 8:00 (1)
    latest_start, earliest_start = 18, 1
    
    # Earliest class finishes at 9:30 (4), latest at 18:00 (21)
    earliest_finish, latest_finish = 4, 21
    
    # When scoring, we need to scale to the numbers between the difference
    max_difference = latest_start - earliest_start
    
    weekly_schedule = group.group_days(schedule)
    weekly_morning_score = []
    for courses_in_day in weekly_schedule:
        # If there are no classes in the day, score is 100
        if len(courses_in_day) == 0:
            weekly_morning_score.append(100)
            continue
        
        if preference == 'evening':
            earliest = get_earliest_course_time(courses_in_day)
            daily_score = ((max_difference - (latest_start - earliest))/max_difference) * 100
            weekly_morning_score.append(daily_score)
            
        elif preference == "morning":
            latest = get_latest_course_time(courses_in_day)
            daily_score = ((max_difference - (latest - earliest_finish))/max_difference) * 100
            weekly_morning_score.append(daily_score)
    
    return weekly_morning_score

def score_schedule(courses: list[Course], preferences: dict):
    i = 0