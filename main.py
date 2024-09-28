from backend.scripts.scrapers import teacher_scraper
from backend.scripts.scrapers import course_scraper
from backend.scripts import schedule_generator
from seleniumbase import Driver
import os

if __name__ == "__main__":
    courses = ["603-101-MA", "345-102-MQ", "109-101-MQ", "201-NYA-05", "203-NYA-05", "202-NYA-05"]
    preferences = {"day off": "Mon."}
    schedule_generator.generate_schedule(courses, preferences)
    
    
    #teacher_scraper.match_all_teacher_id()
    # We will use seleniumbase to avoid bot detection
    #driver = Driver(uc=True)
    #driver.get("https://ratemyteachers.com/ca/quebec/montreal/vanier-college")
    #teacher_scraper.scrape_teachers(driver)
    
    #driver = Driver(uc=True)
    #driver.get("https://vanierlivecourseschedule.powerappsportals.com/")
    #course_scraper.scrape_all_teacher_names(driver)
    #course_scraper.scrape_courses(driver)