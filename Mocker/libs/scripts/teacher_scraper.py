from selenium import webdriver
from selenium.webdriver.chrome.webdriver import WebDriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
import math

def scrape_teachers(driver: WebDriver):
    """
    Scrapes a school page for every teacher and their corresponding rating, if a teacher doesnt have a rating they receive 'NA'
    Works for any school directory in montreal, https://ratemyteachers.com/ca/quebec/montreal/school-name

    Args:
        driver (WebDriver): Selenium WebDriver, it must follow the ratemyteachers link of the school
    """
    # Find the school for the URL
    school = driver.current_url.split('/')[-1]
    
    # Find the total number of pages
    teachers_pagination = driver.find_elements(By.XPATH, '//div[@class="row d-flex align-items-center my-3 my-md-4"]/div[@class="col "]/b')
    total_teachers = teachers_pagination[1].text
    pagination_text = teachers_pagination[0].text
    pagination_limit = pagination_text[pagination_text.find("-") + 2:len(pagination_text)]
    pages = math.ceil(int(total_teachers)/int(pagination_limit))
    
    for i in range(1, pages):
        # Find all the links
        driver.get(f"https://ratemyteachers.com/ca/quebec/montreal/{school}/page/{i}")
        elements = driver.find_elements(By.XPATH, '//h5[@class="card-title"]/a')
        teacher_links = [element.get_attribute('href') for element in elements]
        
        for link in teacher_links:
            # Open a new tab and go to the current link
            driver.find_element(By.TAG_NAME, 'body').send_keys(Keys.CONTROL + 't')
            driver.switch_to.window(driver.window_handles[-1])
            driver.get(link)
            
            try:
                rating = driver.find_element(By.XPATH, '//div[@class="col-6 text-right"]').text
                rating = rating[len("Overall Rating: "): len(rating)]
            except:
                rating = 'NA'
            print(f"{link}: {rating}\n")

if __name__ == '__main__':
    PATH = r"C:\Program Files (x86)\chromedriver.exe"
    service = Service(executable_path=PATH)
    driver = webdriver.Chrome(service=service)
    driver.get("https://ratemyteachers.com/ca/quebec/montreal/vanier-college")
    
    scrape_teachers(driver)