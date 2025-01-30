from thefuzz import process
from thefuzz import fuzz

from scripts.db_helper import connect_db
from models import Teacher
from models import TeacherRatings

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
    if match is not None and float(match[1] > threshold):
        teacher_to_match.teacher_id = session.query(Teacher).filter(Teacher.name == match[0])[0].to_json()['id']
        teacher_to_match.teacher_id_accuracy = match[1]
        session.commit()
        print(f"Saved {teacher_to_match.to_json()['name']} to match {match[0]} with a score of {match[1]}")
        return True

    return False
            
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