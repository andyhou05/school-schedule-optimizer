from scripts.scrapers.teachers import rate_my_teachers_scraper
from scripts.scrapers.teachers import rate_my_professors_scraper
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
    courses = ["109-101-MQ"]
    #preferences = {"day off": "Mon.", "breaks":" regular", "time": "morning"}
    #print(generator.generate_schedule(courses, {}, []))
    
    # SCHEDULE HELPER TESTS
    #print(schedule_helper.add_specific_courses(specific_courses=[{"course_id": "603-101-MA", "section": "00021"}], session=session, total_number_of_courses=1, preferences={}))
    
    # ID MATCHING
    #teacher_scraper.match_all_teacher_id()
    
    
    # COURSE SCRAPER (ALWAYS START WITH THIS)
    #course_scraper.run_scraper(link="https://vanierlivecourseschedule.powerappsportals.com/", page=17)
    
    # TEACHER SCRAPER
    #rate_my_teachers_scraper.run_scraper(start_page=48)
    #rate_my_teachers_scraper.match_all_teacher_id() # Fix Teacher table before running
    #rate_my_professors_scraper.run_scraper()
    
    print(course_scraper.convert_time_block("10:00 - 12:00"))
    
    
    
    