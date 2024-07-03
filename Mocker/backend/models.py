from config import db

class Course(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    section = db.Column(db.String(5), unique=False, nullable=False)
    course_id = db.Column(db.String(10), unique=False, nullable=False)
    name = db.Column(db.String(100), unique=False, nullable=False)
    seats = db.Column(db.Integer)
    
    def to_json(self):
        return {
            "id": self.id,
            "section": self.section,
            "courseId":self.course_id,
            "name":self.name,
            "seats":self.seats
        }