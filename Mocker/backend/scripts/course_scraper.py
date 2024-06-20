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

def scrape_page(driver: WebDriver):
    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CLASS_NAME, "view-grid.table-responsive.has-pagination")))
    course_list = driver.find_elements(By.XPATH, '//tr[@data-entity="vit_courseinfo"]') # Holds section, course ID, title, and seats
    # Need to click class info to get teachers and time slots
    info = driver.find_elements(By.XPATH, '//a[@class="details-link has-tooltip launch-modal"]')
    for i in range(len(info)):
        info[i].click()
        time.sleep(2)
        driver.find_elements(By.XPATH, '//div[@class="modal-header"]/button[@class="close"]')[2].click() # there are 9 buttons that fit this XPATH on the page, index 2 is hard-coded
        driver.execute_script( f"window.scrollTo( 0, {(i + 1) * 75} )" )
    
if __name__ == '__main__':
    PATH = r"C:\Program Files (x86)\chromedriver.exe"
    service = Service(executable_path=PATH)
    driver = webdriver.Chrome(service=service)
    driver.get("https://vanierlivecourseschedule.powerappsportals.com/")
    
    scrape_page(driver)