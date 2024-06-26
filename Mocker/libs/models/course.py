class Course:
    def __init__(self, section: str, code: str, title: str, seats: int, teacher: list[str], date:str):
        self.section = section
        self.code = code
        self.title = title
        self.seats = seats
        self.teacher = teacher
        self.date = date
        