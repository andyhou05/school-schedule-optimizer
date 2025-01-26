from selenium.webdriver.chrome.webdriver import WebDriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from seleniumbase import Driver
from thefuzz import process
from thefuzz import fuzz

import math

from scripts.db_helper import connect_db
from scripts.db_helper import add_entry
from models import Teacher
from models import TeacherRatings

        
def average(nums: list[float]) -> float:
    """
    Finds the average of a list, can contain null values (these will be ignored)

    Args:
        nums (list[float]): List that we want to find the average of.

    Returns:
        float: Average of nums
    """
    
    length = 0
    sum = 0
    for num in nums:
        if num is not None:
            length += 1
            sum += num
    return sum/length if length != 0 else 0
        
def get_avg_rating(id: int) -> float:
    """
    Returns the average rating of the specified teacher.

    Args:
        id (int): ID number of the teacher in the database.

    Returns:
        float: Average rating of the teacher, between 0 and 5. If there are no ratings, returns None.
    """
    
    session = connect_db()
    teacher_ratings = session.query(TeacherRatings).filter(TeacherRatings.teacher_id == id) # This returns the TeacherRatings objects, we need to specifically select the ratings column
    ratings = [teacher_rating.to_json()["rating"] for teacher_rating in teacher_ratings]
    return average(ratings)
    
def get_links(id: int) -> list[str]:
    """
    Returns all the ratemyteacher.com links of a teacher.

    Args:
        id (int): ID number of the teacher in the database.

    Returns:
        list[str]: List of ratemyteacher.com links.
    """
    
    session = connect_db()
    teacher_ratings = session.query(TeacherRatings).filter(TeacherRatings.teacher_id == id)
    return [teacher_rating.to_json()["link"] for teacher_rating in teacher_ratings]

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

def check_existing_teacher(teacher_to_match: TeacherRatings, names: list[str], threshold: int) -> None:
    """
    Check if a teacher with similar name already exists in Teacher table.

    Args:
        teacher_to_match (TeacherRatings): The TeacherRatings instance whose teacher_id we need to match.
        names (list[str]): A list of all the teacher names in Teacher table.
        threshold (int): The accepted threshold for name ressemblance, from 0 - 100
        save_new_teacher (bool): True if we want to save a Teacher into database that is below the threshold
    """
    
    teacher_name = teacher_to_match.name
    session = connect_db()
    
    match = process.extractOne(teacher_name, names, scorer=fuzz.token_set_ratio)
    if match is None or float(match[1]) < threshold:
        # If there is no match or does not pass the threshold, add a new teacher to Teacher table
        new_teacher = Teacher(name=teacher_name)
        add_entry(session, new_teacher)
        session.commit()
    else:
        teacher_to_match.teacher_id = session.query(Teacher).filter(Teacher.name == match[0])[0].to_json()['id']
        teacher_to_match.teacher_id_accuracy = match[1]
        session.commit()
        print(f"Saved {teacher_to_match.to_json()['name']} to match {match[0]} with a score of {match[1]}")
            
def match_all_teacher_id(): #change this
    session = connect_db()
    teacher_ratings = session.query(TeacherRatings).all()
    teacher_names = [teacher.to_json()['name'] for teacher in session.query(Teacher).all()]
    for teacher_rating in teacher_ratings:
        match = process.extractOne(teacher_rating.to_json()['name'], teacher_names, scorer=fuzz.token_set_ratio)
        if float(match[1]) > 85:
            teacher_rating.teacher_id = session.query(Teacher).filter(Teacher.name == match[0])[0].to_json()['id']
            teacher_rating.teacher_id_accuracy = match[1]
            session.commit()
            print(f"Saved {teacher_rating.to_json()['name']} to match {match[0]} with a score of {match[1]}")
            
    
def scrape_teachers(driver: WebDriver, start_page: int = 1) -> None:
    """
    Scrapes a ratemyteacher.com school page for every teacher and their corresponding rating, if a teacher doesnt have a rating it will be None
    Works for any school directory in montreal, https://ratemyteachers.com/ca/quebec/montreal/school-name

    Args:
        driver (WebDriver): Selenium WebDriver, it must follow the ratemyteachers link of the school
        start_page (int, optional): Optional starting page number. Defaults to 1.
    """
    
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
            
            # Load all the saved teachers in Teacher table (Teacher contains no duplicate teachers as opposed to TeacherRatings)
            saved_teachers = session.query(Teacher).all()
            saved_teachers_names = [teacher.to_json()["name"] for teacher in saved_teachers]
            
            # We need to match the teacher_id (foreign key) in TeacherRatings to the appropriate id in Teacher
            check_existing_teacher(new_teacher_rating, saved_teachers_names, threshold=85)
            
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
    scrape_teachers(driver, start_page=start_page)