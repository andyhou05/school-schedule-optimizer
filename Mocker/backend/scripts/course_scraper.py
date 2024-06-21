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
from backend.models.course import Course

courses = []
def split_info(info: str):
    """
    Custom string splitter to split scraped information about a course into an array
    Example info:   00001 101-101-VA Anatomy and Physiology I Only for 180* 15
    
    Format:       00001      101-101-VA      Anatomy and Physiology I          Only for 180*            15
                 [section]       [id]                 [name]                [program restriction]     [seats]
                 
    The format of the array follows the same format as the input string (see above)
    
    
    Args:
        info (str): The course information to be split
    
    Returns:
        formatted_info (list[str, str, str, int]): The information split into pieces, formatted as follows: section number, course id, course name, number of seats
    """
    
    i = 0
    l = len(info) - 1
    formatted_info = []
    seats = 0
    
    # Find the number of seats available
    while info[l] != ' ':
        l-= 1
    seats = int(info[l:len(info)])
        
    # Remove info about program restriction and seat available from info string
    program_restriction_position = info.find("Only for")
    info = info[0:program_restriction_position] if program_restriction_position != -1 else info[0:info.rfind(seats) - 1]
        
    # Find the course section, id, and name (to finish)
    while i < len(info):
        # Length 2 means that it has the section and course id, we just need the name of the course, which is from i to the end of the string
        if len(formatted_info) == 2:
            formatted_info.append(info[i:-1])
            break
        
        # Loop through the characters until we find a space, append the information
        j = i
        while info[j] != ' ':
            j += 1
        formatted_info.append(info[i:j])
        i = j + 1
        
    # Append seats available
    formatted_info.append(seats)
        
    return formatted_info
    
def scrape_page(driver: WebDriver):
    """
    Scrapes a page for course information, this scraper only works for the 
    Vanier course schedule on Chrome as of August 21 2024 and is subject to change

    Args:
        driver (WebDriver): Selenium WebDriver, it must follow the link the the Vanier course schedule
    """
    
    # Find list of courses
    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CLASS_NAME, "view-grid.table-responsive.has-pagination")))
    course_list = driver.find_elements(By.XPATH, '//tr[@data-entity="vit_courseinfo"]') # Holds section, course ID, title, and seats
    
    # Find buttons which open up course info
    info = driver.find_elements(By.XPATH, '//a[@class="details-link has-tooltip launch-modal"]')
    
    # Need to click class info to get teachers and time slots
    for i in range(len(info)):
        info[i].click()
        time.sleep(2)
        
        # Close modal window
        driver.find_elements(By.XPATH, '//div[@class="modal-header"]/button[@class="close"]')[2].click() # there are 9 buttons that fit this XPATH on the page, index 2 is hard-coded
        
        # Save the scraped information
        current_course_info = split_info(course_list[i].text)
        print(course_list[i].text)
        courses.append()
        
        # Scroll down
        driver.execute_script( f"window.scrollTo( 0, {(i + 1) * 75} )" )
    
if __name__ == '__main__':
    PATH = r"C:\Program Files (x86)\chromedriver.exe"
    service = Service(executable_path=PATH)
    driver = webdriver.Chrome(service=service)
    driver.get("https://vanierlivecourseschedule.powerappsportals.com/")
    
    scrape_page(driver)
    