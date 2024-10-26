from backend.scripts.scrapers import teacher_scraper
from backend.scripts.scrapers import course_scraper
from backend.scripts.schedule import generator
from backend.scripts.schedule import scorer
from backend.scripts.helper import connect_db
from backend.models import Period
from seleniumbase import Driver
import os
            
"""
def merge(nums1: list, nums2: list):
    nums = []
    while len(nums1) > 0 and len(nums2) > 0:
        if nums1[0] < nums2[0]:
            nums.append(nums1[0])
            nums1.pop(0)
        else:
            nums.append(nums2[0])
            nums2.pop(0)
    
    while len(nums1) > 0:
        nums.append(nums1.pop(0))
    while len(nums2) > 0:
        nums.append(nums2.pop(0))
    return nums
    
def merge_sort(nums: list):
    if len(nums) == 1:
        return nums
    middle_index = len(nums) // 2
    nums1, nums2 = nums[:middle_index], nums[middle_index:]
    nums1, nums2 = merge_sort(nums1), merge_sort(nums2)
    return merge(nums1, nums2)
"""
if __name__ == "__main__":
    
    #nums = [23, 7, 15, 42, 8, 19]
    
    session = connect_db()
    #ids = [1800, 3134, 3135, 2832, 2518, 329]
    #schedule = session.query(Course).filter(Course.id.in_(ids)).all()
    #preferences = {"breaks":"short"}
    #print(scorer.score_schedule(schedule, preferences))
    
    courses = ["603-101-MA", "345-102-MQ", "109-101-MQ", "201-NYA-05", "203-NYA-05", "202-NYA-05"]
    preferences = {}
    generator.generate_schedule(courses, preferences)
    
    
    #teacher_scraper.match_all_teacher_id()
    # We will use seleniumbase to avoid bot detection
    #driver = Driver(uc=True)
    #driver.get("https://ratemyteachers.com/ca/quebec/montreal/vanier-college")
    #teacher_scraper.scrape_teachers(driver)
    
    #driver = Driver(uc=True)
    #driver.get("https://vanierlivecourseschedule.powerappsportals.com/")
    #course_scraper.scrape_all_teacher_names(driver)
    #course_scraper.scrape_courses(driver)
    