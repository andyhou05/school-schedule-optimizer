from scripts.scrapers import teacher_scraper
from scripts.scrapers import course_scraper
from scripts.schedule import generator
from scripts.schedule import scorer
from scripts.db_helper import connect_db
from scripts.schedule import schedule_helper
from models import Period
            

if __name__ == "__main__":
    
    session = connect_db()
    
    # SCORER TESTS
    #ids = [1800, 3134, 3135, 2832, 2518, 329]
    #schedule = session.query(Course).filter(Course.id.in_(ids)).all()
    #preferences = {"breaks":"short"}
    #print(scorer.score_schedule(schedule, preferences))
    
    
    
    # SCHEDULE GENERATION TESTS
    #courses = ["603-101-MA", "345-102-MQ", "109-101-MQ", "201-NYB-05", "203-SN1-RE", "202-SN1-RE"]
    #courses = ["109-101-MQ"]
    #preferences = {"day off": "Mon.", "breaks":" regular", "time": "morning"}
    #print(generator.generate_schedule(courses, {"intensive":False}, [], 1))
    
    # SCHEDULE HELPER TESTS
    #print(schedule_helper.add_specific_courses(specific_courses=[{"course_id": "603-101-MA", "section": "00021"}], session=session, total_number_of_courses=1, preferences={}))
    
    # ID MATCHING
    #teacher_scraper.match_all_teacher_id()
    
    
    
    # TEACHER SCRAPER
    # teacher_scraper.run_scraper()
    
    
    
    # COURSE SCRAPER
    course_scraper.run_scraper(page=20)
    