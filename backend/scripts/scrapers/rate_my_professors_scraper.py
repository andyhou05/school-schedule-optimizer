from selenium.webdriver.chrome.webdriver import WebDriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import StaleElementReferenceException
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from seleniumbase import Driver
from thefuzz import process
from thefuzz import fuzz

import math
import time

from scripts.db_helper import connect_db
from scripts.db_helper import add_entry
from models import Teacher
from models import TeacherRatings

def scrape_info(driver: WebDriver) -> tuple:
    """_summary_

    Args:
        driver (WebDriver): _description_

    Returns:
        tuple: _description_
    """
    teacher_cards = driver.find_elements(By.XPATH, '//a[@class="TeacherCard__StyledTeacherCard-syjs0d-0 dLJIlx"]')
    for teacher_card in teacher_cards:
        rating = teacher_card.find_element(By.XPATH, './/div[contains(@class, "CardNumRating__CardNumRatingNumber-sc-17t4b9u-2")]').text
        name = teacher_card.find_element(By.XPATH, './/div[contains(@class, "CardName__StyledCardName-sc-1gyrgim-0")]').text
        print(f"{name} {rating}")

def scrape_rate_my_professors(driver: WebDriver, create_teachers: bool=False) -> None:
    # Connect to db
    session = connect_db()
    
    show_more_button = driver.find_element(By.XPATH, '//button[@class="Buttons__Button-sc-19xdot-1 PaginationButton__StyledPaginationButton-txi1dr-1 glImpo"]')
    while(True): 
        try:
            time.sleep(1)
            show_more_button.send_keys(Keys.DOWN)
            show_more_button.click()
        except StaleElementReferenceException:
            total_teachers = len(driver.find_elements(By.XPATH, '//div[@class="CardSchool__StyledCardSchool-sc-19lmz2k-2 gSTNdb"]'))
            scrape_info(driver)
            break;
    
def run_scraper():
    driver = Driver(uc=True)
    driver.get("https://www.ratemyprofessors.com/search/professors/15048?q=*")
    scrape_rate_my_professors(driver)