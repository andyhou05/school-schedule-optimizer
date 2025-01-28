from thefuzz import process
from thefuzz import fuzz

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

def check_existing_teacher(teacher_to_match: TeacherRatings, threshold: int) -> None:
    """
    Check if a teacher with similar name already exists in Teacher table.

    Args:
        teacher_to_match (TeacherRatings): The TeacherRatings instance whose teacher_id we need to match.
        threshold (int): The accepted threshold for name ressemblance, from 0 - 100
        save_new_teacher (bool): True if we want to save a Teacher into database that is below the threshold
    """
    
    # Load all the saved teachers in Teacher table (Teacher contains no duplicate teachers as opposed to TeacherRatings)
    session = connect_db()
    teachers = session.query(Teacher).all()
    teacher_names = [teacher.to_json()["name"] for teacher in teachers]
    teacher_name = teacher_to_match.name
    
    match = process.extractOne(teacher_name, teacher_names, scorer=fuzz.token_set_ratio)
    if match is None or float(match[1]) < threshold:
        # If there is no match or does not pass the threshold, add a new teacher to Teacher table
        new_teacher = Teacher(name=teacher_name)
        add_entry(session, new_teacher)
        teacher_to_match.teacher_id = new_teacher.id
        teacher_to_match.teacher_id_accuracy = 100
        session.commit()
    else:
        teacher_to_match.teacher_id = session.query(Teacher).filter(Teacher.name == match[0])[0].to_json()['id']
        teacher_to_match.teacher_id_accuracy = match[1]
        session.commit()
        print(f"Saved {teacher_to_match.to_json()['name']} to match {match[0]} with a score of {match[1]}")
            
def match_all_teacher_id():
    """
    Matches all TeacherRatings teacher_id with its corresponding id from Teacher
    """
    
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