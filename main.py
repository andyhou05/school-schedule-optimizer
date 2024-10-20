from backend.scripts.scrapers import teacher_scraper
from backend.scripts.scrapers import course_scraper
from backend.scripts.schedule import generator
from backend.scripts.schedule import scorer
from backend.scripts.helper import connect_db
from backend.models import Course
from seleniumbase import Driver
import os

if __name__ == "__main__":
    session = connect_db()
    ids = [1800, 3134, 3135, 2832, 2518, 329]
    schedule = session.query(Course).filter(Course.id.in_(ids)).all()
    preferences = {"time":"evening"}
    print(scorer.score_schedule_time(schedule, preferences['time']))
    print(scorer.score_schedule_preferences(schedule, preferences))
    
    
    #courses = ["603-101-MA", "345-102-MQ", "109-101-MQ", "201-NYA-05", "203-NYA-05", "202-NYA-05"]
    #preferences = {"day off": "Mon."}
    #generator.generate_schedule(courses, preferences)
    
    
    #teacher_scraper.match_all_teacher_id()
    # We will use seleniumbase to avoid bot detection
    #driver = Driver(uc=True)
    #driver.get("https://ratemyteachers.com/ca/quebec/montreal/vanier-college")
    #teacher_scraper.scrape_teachers(driver)
    
    #driver = Driver(uc=True)
    #driver.get("https://vanierlivecourseschedule.powerappsportals.com/")
    #course_scraper.scrape_all_teacher_names(driver)
    #course_scraper.scrape_courses(driver)