from backend.models import Course

def group_periods(periods: list[Course]) -> dict:
    """
    Returns the group of period blocks which represent the classes.
    Courses are grouped when they have the same course id and are of the same section.

    Args:
        periods (list[Course]): List of Courses (periods) we want to group by class

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

def group_days(periods: list[Course]) -> list:
    """
    Returns a list of courses where the index represents the day of the week.

    Args:
        periods (list[Course]): The list of courses we want to group.

    Returns:
        list: The weekly schedule of courses.
    """
    
    weekly_schedule = [[], [], [], [], [], [], []]
    days = {"Mon.":0, "Tue.": 1, "Wed.": 2, "Thu.": 3, "Fri.": 4, "Sat.": 5, "Sun.": 6}
    for period in periods:
        day_index = days[period.day]
        weekly_schedule[day_index].append(period)
    return weekly_schedule