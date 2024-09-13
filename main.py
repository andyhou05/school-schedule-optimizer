from backend.scripts import teacher_scraper
from backend.scripts import course_scraper
from seleniumbase import Driver
import os

if __name__ == "__main__":
    
    # We will use seleniumbase to avoid bot detection
    #driver = Driver(uc=True)
    #driver.get("https://ratemyteachers.com/ca/quebec/montreal/vanier-college")
    #teacher_scraper.scrape_teachers(driver)
    
    driver = Driver(uc=True)
    driver.get("https://vanierlivecourseschedule.powerappsportals.com/")
    #course_scraper.scrape_all_teacher_names(driver)
    #course_scraper.scrape_courses(driver)