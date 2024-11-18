from models import Period

def group_periods(periods: list[Period]) -> dict:
    """
    Returns the group of period blocks which represent the classes.
    Courses are grouped when they have the same course id and are of the same section.

    Args:
        periods (list[Period]): List of Period we want to group by course

    Returns:
        dict: The groups of classes
    """
    
    grouped_periods = {}
    for period in periods:
        key = (period.course_id, period.section)
        if key not in grouped_periods:
            grouped_periods[key] = []
        grouped_periods[key].append(period)
    return grouped_periods

def group_days(periods: list[Period]) -> list:
    """
    Returns a list of periods where the index represents the day of the week.

    Args:
        periods (list[Period]): The list of periods we want to group.

    Returns:
        list: The weekly schedule of courses.
    """
    
    weekly_schedule = [[], [], [], [], [], [], []]
    days = {"Mon.":0, "Tue.": 1, "Wed.": 2, "Thu.": 3, "Fri.": 4, "Sat.": 5, "Sun.": 6}
    for period in periods:
        day_index = days[period.day]
        weekly_schedule[day_index].append(period)
    return weekly_schedule

def group_courses(courses: list[list[Period]]) -> tuple:
    """ Groups courses by their course id as well as their occurences.

    Args:
        courses (list[list[Period]]): list of courses, each course contains a list[Period]
    Returns:
        tuple: Tuple of length 2, first item is a dict {course_id (int): courses (list[list[Period]])}, second item is a dict {coufse_id (int): course_occurences (int)}
    """
    
    grouped_courses = {}
    occurences = {}
    for course in courses:
        id = course[0].course_id
        if id not in grouped_courses:
            grouped_courses[id] = []
        grouped_courses[id].append(course)
        
    for course_id, course in grouped_courses.items():
        occurences[course_id] = len(course)
    return (grouped_courses, occurences)
