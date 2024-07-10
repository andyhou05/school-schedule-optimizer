from config import db

class Teacher(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), unique=True, nullable=True)
    rating = db.Column(db.Float, unique=False, nullable=True)
    courses = db.relationship("Course", backref="teacher", lazy=True)
    link = db.Column(db.String(150), unique=True, nullable=True)
    
    def to_json(self):
        return{
            "name":self.name,
            "rating":self.rating,
            "courses":list(map(lambda x: x.to_json(), self.courses)),
            "link":self.link
        }
    
class Course(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    section = db.Column(db.String(5), unique=False, nullable=False)
    course_id = db.Column(db.String(10), unique=False, nullable=False)
    name = db.Column(db.String(100), unique=False, nullable=False)
    seats = db.Column(db.Integer, unique=False, nullable=False)
    teacher_id = db.Column(db.Integer, db.ForeignKey("teacher.id"), nullable=True)
    day = db.Column(db.String(15), unique=False, nullable=False)
    time = db.Column(db.String, unique=False, nullable=False)
    
    def to_json(self):
        return {
            "id": self.id,
            "section": self.section,
            "courseId":self.course_id,
            "name":self.name,
            "seats":self.seats,
            "teacherId":self.teacher_id,
            "day":self.day,
            "time":self.time
        }