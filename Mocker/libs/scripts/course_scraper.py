from selenium import webdriver
from selenium.webdriver.chrome.webdriver import WebDriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
import time
from pathlib import Path
import sys
path_root = Path(__file__).parents[2]
sys.path.append(str(path_root))
import re

courses = []
def split_general_info(input_string: str):
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
    course_id_pattern = r"\d{3}-(\d|[A-Z]){3}-(\d|[A-Z]){2}"
    course_name_pattern = r"\d{3}-(?:\d|[A-Z]){3}-(?:\d|[A-Z]){2} (.+?)(?:\s+Only for|\s+\d*$|$)"
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

def scrape_page(driver: WebDriver):
    """
    Scrapes a page for course information, this scraper only works for the 
    Vanier course schedule on Chrome as of August 21 2024 and is subject to change
    Currently only saves the information locally, TODO: save the information to a database

    Args:
        driver (WebDriver): Selenium WebDriver, it must follow the link the the Vanier course schedule
    """
    
    # Find list of courses and its general information (section, course ID, title, and seats)
    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CLASS_NAME, "view-grid.table-responsive.has-pagination")))
    general_course_list_info = driver.find_elements(By.XPATH, '//tr[@data-entity="vit_courseinfo"]')
    
    # Find buttons which open up course info
    info = driver.find_elements(By.XPATH, '//a[@class="details-link has-tooltip launch-modal"]')
    
    # Need to click class info to get teachers and time slots
    for i in range(len(info)):
        general_info = split_general_info(general_course_list_info[i].text) # section, course ID, title, seats
        current_course = []
        info[i].click()
        time.sleep(2)
        
        # Switch to iframe to find course's specific information (teachers, time slots)
        iframe = driver.find_elements(By.XPATH, '//iframe[@data-page="/_portal/modal-form-template-path/c7a13072-c94f-ed11-bba3-0022486daee2"]')[2] # there are 4 iframes that fit this XPATH on the page, index 2 is hard-coded
        driver.switch_to.frame(iframe)
        WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, '//tr[@data-entity="vit_meetingtime"]')))
        web_elements = driver.find_elements(By.XPATH, '//tr[@data-entity="vit_meetingtime"]')
        time.sleep(1)
        
        # Save scraped information into different period blocks
        for j in range(len(web_elements)):
            teacher = web_elements[0].find_elements(By.XPATH, '//td[@data-attribute="vit_teacher"]')[j].text
            day = web_elements[0].find_elements(By.XPATH, '//td[@data-attribute="vit_day"]')[j].text
            time_slot = web_elements[0].find_elements(By.XPATH, '//td[@data-attribute="vit_time"]')[j].text
            current_period = general_info + [teacher, day, time_slot]
            current_course.append(current_period)
        
        # Close modal window
        driver.switch_to.default_content()
        driver.find_elements(By.XPATH, '//div[@class="modal-header"]/button[@class="close"]')[2].click() # there are 9 buttons that fit this XPATH on the page, index 2 is hard-coded
        
        print(f"{current_course}\n")
        #courses.append()
        
        # Scroll down
        driver.execute_script( f"window.scrollTo( 0, {(i + 1) * 75} )" )
        
    # TODO: create a function that crawls through every page on the course schedule
    # TODO: print statements and exception handling for saving the information
    
if __name__ == '__main__':
    PATH = r"C:\Program Files (x86)\chromedriver.exe"
    service = Service(executable_path=PATH)
    driver = webdriver.Chrome(service=service)
    driver.get("https://vanierlivecourseschedule.powerappsportals.com/")
    
    scrape_page(driver)
    