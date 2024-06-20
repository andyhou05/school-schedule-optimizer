from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
#from backend.models.course import Course

def scrape_page(driver):
    driver.get("https://vanierlivecourseschedule.powerappsportals.com/")
    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CLASS_NAME, "view-grid.table-responsive.has-pagination")))
    print(driver.find_elements(By.XPATH, '//tr[@data-entity="vit_courseinfo"]')[4].text)
    
if __name__ == '__main__':
    PATH = r"C:\Program Files (x86)\chromedriver.exe"
    service = Service(executable_path=PATH)
    driver = webdriver.Chrome(service=service)
    
    scrape_page(driver)