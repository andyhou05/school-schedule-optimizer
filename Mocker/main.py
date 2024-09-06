from backend.scripts import teacher_scraper
from seleniumbase import Driver

if __name__ == "__main__":
    # We will use seleniumbase to avoid bot detection
    driver = Driver(uc=True)
    driver.get("https://ratemyteachers.com/ca/quebec/montreal/vanier-college")
    teacher_scraper.scrape_teachers(driver)