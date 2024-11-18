from backend.scripts.scrapers import teacher_scraper
from backend.scripts.scrapers import course_scraper
from backend.scripts.schedule import generator
from backend.scripts.schedule import scorer
from backend.scripts.db_helper import connect_db
from backend.models import Period
            

if __name__ == "__main__":
    
    session = connect_db()
    
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
    # teacher_scraper.run_scraper()
    
    
    
    # COURSE SCRAPER
    # course_scraper.run_scraper()
    