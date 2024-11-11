from backend.scripts.scrapers import teacher_scraper
from backend.scripts.scrapers import course_scraper
from backend.scripts.schedule import generator
from backend.scripts.schedule import scorer
from backend.scripts.db_helper import connect_db
from backend.models import Period
from seleniumbase import Driver
import os
            
"""
def partition(nums: list, low: int, high: int):
    i = low
    pivot = nums[high]
    for j in range(low, high):
        if nums[j] <= pivot:
            nums[i], nums[j] = nums[j], nums[i]
            i += 1
    nums[high], nums[i] = nums[i], nums[high]    
    return i

def quicksort(nums: list, low: int, high: int):
    if low < high:
        partition_index = partition(nums, low, high)
        quicksort(nums, low, partition_index - 1)
        quicksort(nums, partition_index + 1, high)
    """

if __name__ == "__main__":
    print("hi")
    
    #nums = [23, 7, 15, 42, 8, 19]
    #quicksort(nums, 0, len(nums) - 1)
    #print(nums)
    
    #session = connect_db()
    
    # SCORER TESTS
    #ids = [1800, 3134, 3135, 2832, 2518, 329]
    #schedule = session.query(Course).filter(Course.id.in_(ids)).all()
    #preferences = {"breaks":"short"}
    #print(scorer.score_schedule(schedule, preferences))
    
    
    
    # SCHEDULE GENERATION TESTS
    #courses = ["603-101-MA", "345-102-MQ", "109-101-MQ", "201-NYB-05", "203-SN1-RE", "202-SN1-RE"]
    #courses = ["603-101-MA", "109-101-MQ"]
    #preferences = {"day off": "Mon.", "breaks":" regular", "time": "morning"}
    #preferences = {}
    #print(generator.generate_schedule(courses, preferences))
    
    
    
    # ID MATCHING
    #teacher_scraper.match_all_teacher_id()
    
    
    
    # TEACHER SCRAPER
    # We will use seleniumbase to avoid bot detection
    #driver = Driver(uc=True)
    #driver.get("https://ratemyteachers.com/ca/quebec/montreal/vanier-college")
    #teacher_scraper.scrape_teachers(driver)
    
    
    
    # COURSE SCRAPER
    #driver = Driver(uc=True)
    #driver.get("https://vanierlivecourseschedule.powerappsportals.com/") # MAKE THE WINDOW LONG TO AVOID UNCLICKABLE ELEMENT
    #course_scraper.scrape_courses(driver, start_page=35)
    