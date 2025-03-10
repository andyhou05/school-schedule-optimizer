from selenium.webdriver.chrome.webdriver import WebDriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from seleniumbase import Driver

import math

from scripts.scrapers.teachers import helper
from scripts.db_helper import connect_db
from scripts.db_helper import add_entry
from models import TeacherRatings


def scrape_no_pages(driver: WebDriver) -> int:
    """
    Scrapes a ratemyteacher.com school page to find the total number of pages of teachers
    Works for any school directory in montreal, https://ratemyteachers.com/ca/quebec/montreal/school-name

    Args:
        driver (WebDriver): Selenium WebDriver, it must follow the ratemyteachers link of the school
    """
    teachers_pagination = driver.find_elements(By.XPATH, '//div[@class="row d-flex align-items-center my-3 my-md-4"]/div[@class="col "]/b')
    total_teachers = teachers_pagination[1].text
    pagination_text = teachers_pagination[0].text
    pagination_limit = pagination_text[pagination_text.find("-") + 2:len(pagination_text)]
    return math.ceil(int(total_teachers)/int(pagination_limit))

def scrape_teacher_links(driver: WebDriver) -> list[str]:
    """
    Scrapes a ratemyteacher.com school page to find all the teacher links.
    Works for any school directory in montreal, https://ratemyteachers.com/ca/quebec/montreal/school-name

    Args:
        driver (WebDriver): Selenium WebDriver, it must follow the ratemyteachers link of the school
        
    Returns:
        list[str]: All links on the current page.
    """
    
    elements = driver.find_elements(By.XPATH, '//h5[@class="card-title"]/a')
    return [element.get_attribute('href') for element in elements]

def scrape_name_rating(driver: WebDriver) -> tuple:
    """
    Scrapes a ratemyteacher.com teacher page to find the name and the rating.
    Works for any school directory in montreal, https://ratemyteachers.com/ca/quebec/montreal/school-name

    Args:
        driver (WebDriver): Selenium WebDriver, it must follow the ratemyteachers link of the school

    Returns:
        tuple: Name and rating of the teacher (name, rating)
    """
    
    name = driver.find_element(By.XPATH, '//section[@class="teacher-profile-first-section"]/div[@class="container"]/div[@class="row"]/div[@class="col-12"]/div[@class="d-md-flex align-items-center justify-content-between"]/div[@class="heading-wrap"]/h2[@class="mb-3"]').text
    try:
        rating = driver.find_element(By.XPATH, '//div[@class="col-6 text-right"]').text
        rating = float(rating[len("Overall Rating: "): len("Overall Rating: ") + 3]) # Indexing to find the rating of the teacher, ratings are always 3 characters long (ex: 2.0)
    except:
        rating = None
        
    return (name, rating)
            
    
def scrape_rate_my_teachers(driver: WebDriver, start_page: int = 1) -> None:
    """
    Scrapes a ratemyteacher.com school page for every teacher and their corresponding rating, if a teacher doesnt have a rating it will be None
    Works for any school directory in montreal, https://ratemyteachers.com/ca/quebec/montreal/school-name

    Args:
        driver (WebDriver): Selenium WebDriver, it must follow the ratemyteachers link of the school
        start_page (int, optional): Optional starting page number. Defaults to 1.
    """
    driver.maximize_window()
    # Find the total number of pages of teachers
    number_of_pages = scrape_no_pages(driver)
    
    # Connect to db
    session = connect_db()
    
    school_url = driver.current_url
    
    for i in range(start_page, number_of_pages + 1):
        # Go through all the pages
        driver.get(f"{school_url}/page/{i}")
        teacher_links = scrape_teacher_links(driver)
        
        for link in teacher_links:
            # Open a new tab and go to the current teacher link
            driver.find_element(By.TAG_NAME, 'body').send_keys(Keys.CONTROL + 't')
            driver.switch_to.window(driver.window_handles[-1])
            driver.get(link)
            
            # Scrape the teacher's name and rating
            name, rating = scrape_name_rating(driver)
            if rating is None:
                continue
                
            # Add to to TeacherRatings table
            new_teacher_rating = TeacherRatings(name=name, rating=rating, link=link)
            
            # We need to match the teacher_id (foreign key) in TeacherRatings to the appropriate id in Teacher
            add_new_rating = helper.check_existing_teacher(new_teacher_rating, 85)
            
            if add_new_rating:
                add_entry(session, new_teacher_rating)
            
            
                
        """
        IMPORTANT: We will manually update the Teacher table to make sure the names are consistent
        
        After we will match all the teacher_rating ids and teacher ids by running match_all_teacher_id()
        
        Then we need to manually change the teacher_id in the teacher_ratings table for some entries since fuzzy matching doesn't always score correctly
        To view the entries, enter this SQL query:
        
        SELECT 
            teacher_ratings.id, 
            teacher_ratings.name as teacher_ratings_name, 
            teacher.name as teacher_name,
            teacher_ratings.teacher_id_accuracy,
            teacher_ratings.teacher_id
        FROM 
            teacher_ratings
        INNER JOIN 
            teacher ON teacher_ratings.teacher_id = teacher.id
        WHERE
            teacher_ratings.teacher_id IN (
                SELECT teacher_id
                FROM teacher_ratings
                GROUP BY teacher_id
                HAVING COUNT(*) > 1 
                AND teacher_ratings.teacher_id_accuracy < 100
            );
            
            
        To change the teacher_id to null, the following:
        
        UPDATE teacher_ratings
        SET teacher_id = NULL
        WHERE id = 1167;
        
        After that, we will create new entries in Teacher table with the new null values in teacher_id
        """
        
def run_scraper(start_page: int = 1):
    driver = Driver(uc=True)
    driver.get("https://ratemyteachers.com/ca/quebec/montreal/vanier-college")
    scrape_rate_my_teachers(driver, start_page=start_page)