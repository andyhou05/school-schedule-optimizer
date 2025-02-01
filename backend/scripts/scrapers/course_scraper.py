from selenium.webdriver.chrome.webdriver import WebDriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from seleniumbase import Driver
from sqlalchemy.orm import Session
from thefuzz import process

import re
import time

from scripts.db_helper import connect_db
from scripts.db_helper import add_entry
from models import Period
from models import Teacher
from config import db, SEMESTER

def split_general_info(input_string: str) -> list:
    """
    Custom string splitter to split scraped general information about a course into a list using regex patterns
    
    Example info:   00001 101-101-VA Anatomy and Physiology I Only for 180* 15
    
    Format:       00001      101-101-VA      Anatomy and Physiology I          Only for 180*                  15
                 [section]       [id]                 [name]                [program restriction]     [optional: seats]
                 
    The format of the array follows the same format as the input string (see above)
    
    
    Args:
        info (str): The general course information to be split
    
    Returns:
        The information split into pieces, formatted as follows: section number, course id, course name, number of seats
    """
    
    # Define regex patterns to match the different parts of the input string
    section_number_pattern = r"^\d+"
    course_id_pattern = r"(\d|[A-Z]){3}-(\d|[A-Z]){3}-(\d|[A-Z]){2}"
    course_name_pattern = r"(?:\d|[A-Z]){3}-(?:\d|[A-Z]){3}-(?:\d|[A-Z]){2} (.+?)(?:\s+Only for|\s+\d*$|$)"
    seats_available_pattern = r"(\d+)$"
    
    # Extract the section number
    section_number_match = re.search(section_number_pattern, input_string)
    section_number = section_number_match.group() if section_number_match else ""
    
    # Extract the course id
    course_id_match = re.search(course_id_pattern, input_string)
    course_id = course_id_match.group() if course_id_match else ""
    
    # Extract the course name
    course_name_match = re.search(course_name_pattern, input_string)
    course_name = course_name_match.group(1).strip() if course_name_match else ""
    
    # Extract the seats available
    seats_available_match = re.search(seats_available_pattern, input_string)
    seats_available = int(seats_available_match.group()) if seats_available_match else 0
    
    return [section_number, course_id, course_name, seats_available]

def name_reformat(name: str) -> str:
    """
    Reformats a name from LastName, FirstName to FirstName LastName

    Args:
        name (str): The name to be reformated

    Returns:
        str: The reformated name
    """
    last_first_names = name.split(',')
    return f"{last_first_names[1]} {last_first_names[0]}"

def scrape_no_pages(driver: WebDriver) -> int:
    """
    Returns the total number of course pages

    Args:
        driver (WebDriver): Selenium WebDriver, it must follow the link to the Vanier course schedule.

    Returns:
        int: Number of pages of courses.
    """
    
    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, '//ul[@class="pagination"]/li/a')))
    pages = driver.find_elements(By.XPATH, '//ul[@class="pagination"]/li/a')
    return int(pages[-2].text)

def match_teacher_id(teacher_name: str, course: Period, names: list[str], session: Session) -> None:
    """
    Matches the teacher_id of teacher_to_match (which is a foreign key) to the id in Teacher table.

    Args:
        teacher_to_match (str): The name of the teacher to match
        course (Course): The Course instance whose teacher_id we want to match
        names (list[str]): A list of all the teacher names in Teacher table.
        threshold (int): The accepted threshold for name ressemblance, from 0 - 100
        save_new_teacher (bool): True if we want to save a Teacher into database that is below the threshold
    """
    
    # TODO Edge case: teacher is TBA
    
    match = process.extractOne(teacher_name, names)
    
    # Link teacher_id
    teacher_id = session.query(Teacher).filter(Teacher.name == match[0])[0].to_json()['id']
    course.teacher_id = teacher_id
    session.commit()
    print(f"Saved {teacher_name} to match {match[0]} with a score of {match[1]}")

def scrape_courses(driver: WebDriver, link: str, start_page: int = 1):
    """
    Scrapes a page for course information, this scraper only works for the 
    Vanier course schedule on Chrome as of September 13 2024 and is subject to change

    Args:
        driver (WebDriver): Selenium WebDriver, it must follow the link to the Vanier course schedule
        start_page (int, optional): Optional starting page number. Defaults to 1.
    """
    driver.maximize_window()
    # Connect to db
    session = connect_db()
    
    # Number of pages
    number_of_pages = scrape_no_pages(driver)
    
    # Go to page we want to start at
    current_page = 1
    while current_page != start_page:
        time.sleep(1)
        driver.execute_script( f"window.scrollTo( 0, document.body.scrollHeight )" )
        min_difference = float("inf")
        page_numbers = driver.find_elements(By.XPATH, '//ul[@class="pagination"]/li/a')
        best_page = page_numbers[1]
        for page_number in page_numbers:
            try:
                current_difference = abs(start_page - int(page_number.text))
                if min_difference > current_difference:
                    best_page = page_number
      
                    min_difference = current_difference
            except:
                continue
        current_page = int(best_page.text)
        best_page.click()
    
    # Go through every page
    for page in range(number_of_pages):
        
        try:
            # Wait for course table to load
            WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CLASS_NAME, "view-grid.table-responsive.has-pagination")))
            
            # Find list of courses and its general information (section, course ID, title, and seats)
            general_course_list_info = driver.find_elements(By.XPATH, '//tr[@data-entity="vit_courseinfo"]')
            
            # Find buttons which open up course info
            course_info_buttons = driver.find_elements(By.XPATH, '//a[@class="details-link has-tooltip launch-modal"]')
            
            for i in range(len(course_info_buttons)):
                general_info = split_general_info(general_course_list_info[i].text) # section, course ID, title, seats
                
                # Scroll down
                driver.execute_script( f"window.scrollTo( 0, {(i + 1) * 50} )" )
                
                # Need to click class info to get teachers and time slots
                course_info_buttons[i].click()
                
                # Switch to iframe to find course's specific information (teachers, time slots)
                iframe = driver.find_elements(By.XPATH, '//iframe[@data-page="/_portal/modal-form-template-path/c7a13072-c94f-ed11-bba3-0022486daee2"]')[2] # there are 4 iframes that fit this XPATH on the page, index 2 is hard-coded
                driver.switch_to.frame(iframe)
                WebDriverWait(driver, 60).until(EC.presence_of_element_located((By.XPATH, '//tr[@data-entity="vit_meetingtime"]')))
                time.sleep(0.5)
                periods = driver.find_elements(By.XPATH, '//tr[@data-entity="vit_meetingtime"]')
                
                # Save scraped information into different period blocks
                for j in range(len(periods)):
                    teacher_name = name_reformat(periods[0].find_elements(By.XPATH, '//td[@data-attribute="vit_teacher"]')[j].text)
                    try:
                        day = periods[0].find_elements(By.XPATH, '//td[@data-attribute="vit_day"]')[j].text
                    except:
                        print("There was an issure getting the class day.")
                    try:
                        time_slot = periods[0].find_elements(By.XPATH, '//td[@data-attribute="vit_time"]')[j].text
                    except:
                        print("There was an issue getting the class time.")
                    teacher_query = session.query(Teacher).filter(Teacher.name == teacher_name).all()
                    
                    if len(teacher_query) == 0:
                        new_teacher = Teacher(name=teacher_name)
                        add_entry(session, new_teacher)
                        teacher_id = new_teacher.id
                    else:
                        teacher_id = teacher_query[0].to_json()['id']
                        
                    current_page = page + start_page
                    print(f"page {current_page}")
                    course = Period(section=general_info[0], course_id=general_info[1], name=general_info[2], seats=general_info[3], day=day, time=time_slot, teacher_id = teacher_id, intensive = "intensive" in general_info[2].lower(), page_number = current_page, semester=SEMESTER)
                    add_entry(session, course)
                
                # Close modal window
                driver.switch_to.default_content()
                driver.find_elements(By.XPATH, '//div[@class="modal-header"]/button[@class="close"]')[2].click() # there are 9 buttons that fit this XPATH on the page, index 2 is hard-coded
            
            # Refind the pagination to avoid StaleElementException
            pages = driver.find_elements(By.XPATH, '//ul[@class="pagination"]/li/a')
            pages[-1].click()
            
        except TimeoutException:
            session.query(Period).filter(Period.page_number == current_page).delete()
            session.commit()
            driver.close()
            driver = Driver(uc=True)
            driver.get(link) # MAKE THE WINDOW LONG TO AVOID UNCLICKABLE ELEMENT
            scrape_courses(driver, link, start_page=current_page)
            break
            
    
def run_scraper(link: str, page: int = 1):
    driver = Driver(uc=True)
    driver.get(link) # MAKE THE WINDOW LONG TO AVOID UNCLICKABLE ELEMENT
    scrape_courses(driver, link, start_page=page)
    


    """
    To check for dupe entries
    WITH CTE AS (
    SELECT 
        course_id,
        ROW_NUMBER() OVER (PARTITION BY course_id, section, name, teacher_id, day, time, semester ORDER BY course_id) AS row_num
    FROM period
    )
    SELECT * FROM period
    WHERE id IN (
        SELECT id FROM CTE WHERE row_num > 1
    );
    
    To check for number of courses
    SELECT course_id, section, name, semester, COUNT(*) as count
    FROM period
    GROUP BY course_id, section, name, semester

    """