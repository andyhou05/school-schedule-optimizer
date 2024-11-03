from backend.scripts.scrapers import teacher_scraper
from backend.scripts.scrapers import course_scraper
from backend.scripts.schedule import generator
from backend.scripts.schedule import scorer
from backend.scripts.helper import connect_db
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
    
    #nums = [23, 7, 15, 42, 8, 19]
    #quicksort(nums, 0, len(nums) - 1)
    #print(nums)
    
    session = connect_db()
    #ids = [1800, 3134, 3135, 2832, 2518, 329]
    #schedule = session.query(Course).filter(Course.id.in_(ids)).all()
    #preferences = {"breaks":"short"}
    #print(scorer.score_schedule(schedule, preferences))
    
    courses = ["603-101-MA", "345-102-MQ", "109-101-MQ", "201-NYA-05", "203-NYA-05", "202-NYA-05"]
    courses = ["603-101-MA", "345-102-MQ"]
    preferences = {}
    generator.generate_schedule(courses, preferences, session)
    
    
    #teacher_scraper.match_all_teacher_id()
    # We will use seleniumbase to avoid bot detection
    #driver = Driver(uc=True)
    #driver.get("https://ratemyteachers.com/ca/quebec/montreal/vanier-college")
    #teacher_scraper.scrape_teachers(driver)
    
    #driver = Driver(uc=True)
    #driver.get("https://vanierlivecourseschedule.powerappsportals.com/")
    #course_scraper.scrape_all_teacher_names(driver)
    #course_scraper.scrape_courses(driver)
    