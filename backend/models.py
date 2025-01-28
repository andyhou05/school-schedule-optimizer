from config import db

class Teacher(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), unique=True, nullable=True)
    avg_rating = db.Column(db.Float, unique=False, nullable=True)
    
    def to_json(self):
        return{
            "id":self.id,
            "name":self.name
        }
        
    def __repr__(self):
        return str(self.to_json())
    
class TeacherRatings(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    teacher_id = db.Column(db.Integer, db.ForeignKey("teacher.id"), nullable=True)
    teacher_id_accuracy = db.Column(db.Float, unique=False, nullable=True)
    name = db.Column(db.String(150), unique=False, nullable=True)
    rating = db.Column(db.Float, unique=False, nullable=True)
    link = db.Column(db.String(150), unique=True, nullable=True)
    
    def to_json(self):
        return{
            "id":self.id,
            "teacherId":self.teacher_id,
            "teacherIdAccuracy":self.teacher_id_accuracy,
            "name":self.name,
            "rating":self.rating,
            "link":self.link
        }
        
    def __repr__(self):
        return str(self.to_json())
    
class Period(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    section = db.Column(db.String(5), unique=False, nullable=False)
    course_id = db.Column(db.String(10), unique=False, nullable=False)
    name = db.Column(db.String(100), unique=False, nullable=False)
    seats = db.Column(db.Integer, unique=False, nullable=False)
    teacher_id = db.Column(db.Integer, db.ForeignKey("teacher.id"), nullable=True)
    day = db.Column(db.String(15), unique=False, nullable=False)
    time = db.Column(db.String(50), unique=False, nullable=False)
    intensive = db.Column(db.Boolean(), unique=False, nullable=False)
    semester = db.Column(db.String(10), unique=False, nullable=False)
    
    def to_json(self):
        return {
            "id": self.id,
            "section": self.section,
            "courseId":self.course_id,
            "name":self.name,
            "seats":self.seats,
            "teacherId":self.teacher_id,
            "day":self.day,
            "time":self.time,
            "intensive":self.intensive,
            "semester": self.semester
        }
        
    def __repr__(self):
        return str(self.to_json())