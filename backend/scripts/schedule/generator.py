from models import Period
from config import SEMESTER
from scripts.db_helper import connect_db
from scripts.schedule import group
from scripts.schedule import scorer
from scripts.schedule import schedule_helper
        

def generate_schedule(requested_course_ids: list[str], preferences: dict, specific_courses: list[dict],  n_results: int = 5) -> list[dict]:
    """ Generates n_result schedules based on a beam search algorithm using user preferences to return close optimal results.
     The algorithm tries to add courses starting with those with the lowest frequencies. It tries to add every course option
     to every current schedule and keeps the 'n_result' schedules with the highest scores for the next course iteration.

    Args:
        requested_course_ids (list[str]): List of course ids the user wants to have.
        preferences (dict): User preferences for schedule generation, can include dayOff (Mon., Tue., etc.), time (morning, evening), and breaks (short, regular). If the user has no preferences, an empty dict can be used as input.
        specific_courses (list[dict]): List of dictionnaries ({"course_id": , "section":}) containing a course with a specific section number.
        n_results (int, optional): Number of schedules generated. Defaults to 5.


    Returns:
        list[dict]: List of dictionaries containing the schedules (key: "periods") and their scores (key: "scores)
    """
    
    session = connect_db()
    
    schedules = [{"periods": [], "score": 0}] if len(specific_courses) == 0 else schedule_helper.add_specific_courses(specific_courses, session, len(requested_course_ids) + len(specific_courses), preferences)
    periods = session.query(Period).filter(Period.course_id.in_(requested_course_ids), Period.semester == SEMESTER).all() # add Period.seats > 0 for deployment
    
    # Filter courses by user intensive preference
    possible_courses = list(group.group_periods(periods).values())
    filtered_intensive_courses = schedule_helper.filter_intensive(possible_courses, bool(preferences.get("intensive")))
    
    # Filter courses by user day off preference
    filtered_day_off_courses = schedule_helper.filter_day_off(filtered_intensive_courses, preferences.get("dayOff"))
    
    # Group courses by their course ids and find the occurences to optimize for beam search
    grouped_courses, course_frequencies = group.group_courses(filtered_day_off_courses)
    
    # Beam Search:
    # - Start filling the schedule with the course with the least amount of occurences
    course_order = sorted(course_frequencies, key = course_frequencies.get)
    
    # - We keep track of the course_number to make sure all requested courses get added.
    for course_number, course_id in enumerate(course_order, start=1):
        course_options = grouped_courses.get(course_id)
        
        # temp_schedules is used to keep track of all possible schedules when looking at any given course, we will keep the top 'n_result' schedules
        temp_schedules = []
        for course_option in course_options:
            for schedule in schedules:
                
                # - We try to add every course_option of a given course to every schedule that has been cached previously
                current_periods = schedule["periods"].copy()
                for new_period in course_option:
                    if schedule_helper.is_time_conflict(current_periods, new_period):
                        current_periods = None
                        break
                    current_periods.append(new_period)
                        
                if current_periods is not None:
                    score = scorer.score_schedule(current_periods, course_number/len(requested_course_ids), preferences, session) 
                    temp_schedules.append({"periods": current_periods, "score": score})
                   
        schedules = sorted(temp_schedules, key = lambda x: x["score"], reverse=True)[:n_results]
        
    return [{"periods": [period.to_json() for period in schedule["periods"]], "score": schedule["score"]} for schedule in schedules]
        