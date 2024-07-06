from config import db

class Teacher(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), unique=False, nullable=True)
    last_name = db.Column(db.String(50), unique=False, nullable=True)
    rating = db.Column(db.Float, unique=False, nullable=True)
    courses = db.relationship("Course", backref="teacher", lazy=True)
    link = db.Column(db.String(150), unique=True, nullable=True)
    
    def to_json(self):
        return{
            "id":self.id,
            "firstName":self.first_name,
            "lastName":self.last_name,
            "rating":self.rating,
            "courses":self.courses,
            "link":self.courses
        }
    
class Course(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    section = db.Column(db.String(5), unique=False, nullable=False)
    course_id = db.Column(db.String(10), unique=False, nullable=False)
    name = db.Column(db.String(100), unique=False, nullable=False)
    seats = db.Column(db.Integer, unique=False, nullable=False)
    teacher_id = db.Column(db.Integer, db.ForeignKey("teacher.id"))
    time = db.Column(db.String(150), unique=False, nullable=False)
    
    def to_json(self):
        return {
            "id": self.id,
            "section": self.section,
            "courseId":self.course_id,
            "name":self.name,
            "seats":self.seats,
            "teacherId":self.teacher_id,
            "time":self.time
        }