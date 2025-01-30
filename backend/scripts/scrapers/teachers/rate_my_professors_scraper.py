from selenium.webdriver.chrome.webdriver import WebDriver
from selenium.common.exceptions import StaleElementReferenceException
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from seleniumbase import Driver

import time

from scripts.scrapers.teachers import helper
from scripts.db_helper import connect_db
from scripts.db_helper import add_entry
from models import TeacherRatings

def scrape_info(driver: WebDriver) -> list[tuple]:
    """
    Returns the rating, name, and link of every professor on rate my professor that has a rating at a given school.

    Args:
        driver (WebDriver): Selenium WebDriver, it must follow the ratemyprofessor link of the school

    Returns:
        list[tuple]: List of all teacher information (rating, name, link)
    """
    teacher_cards = driver.find_elements(By.XPATH, '//a[@class="TeacherCard__StyledTeacherCard-syjs0d-0 dLJIlx"]')
    professor_info_list = []
    for teacher_card in teacher_cards:
        rating = float(teacher_card.find_element(By.XPATH, './/div[contains(@class, "CardNumRating__CardNumRatingNumber-sc-17t4b9u-2")]').text)
        name = teacher_card.find_element(By.XPATH, './/div[contains(@class, "CardName__StyledCardName-sc-1gyrgim-0")]').text
        link = teacher_card.get_attribute("href")
        if rating > 0:
            professor_info_list.append((rating, name, link))
    
    print(f"Saved {len(professor_info_list)}/{len(teacher_cards)} teachers from {driver.current_url}")
    return professor_info_list

def scrape_rate_my_professors(driver: WebDriver) -> None:
    # Connect to db
    session = connect_db()
    
    show_more_button = driver.find_element(By.XPATH, '//button[@class="Buttons__Button-sc-19xdot-1 PaginationButton__StyledPaginationButton-txi1dr-1 glImpo"]')
    while(True): 
        try:
            time.sleep(1)
            show_more_button.send_keys(Keys.DOWN)
            show_more_button.click()
        except StaleElementReferenceException:
            professor_info_list = scrape_info(driver)
            for professor in professor_info_list:
                new_teacher_rating = TeacherRatings(rating = professor[0], name = professor[1], link = professor[2])
                helper.check_existing_teacher(new_teacher_rating, 85)
                add_entry(session, new_teacher_rating)
            break
    
def run_scraper():
    driver = Driver(uc=True)
    driver.get("https://www.ratemyprofessors.com/search/professors/15048?q=*")
    scrape_rate_my_professors(driver)