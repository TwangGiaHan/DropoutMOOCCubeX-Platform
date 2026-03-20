from sqlalchemy import Column, Integer, String, Float, DateTime
from database import Base

class Course(Base):
    __tablename__ = "courses"
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(String, unique=True, index=True)
    course_name = Column(String)
    school_name = Column(String)
    class_start = Column(DateTime)
    class_end = Column(DateTime)
    user_count = Column(Integer)
    class_duration_days = Column(Integer)
    video_count = Column(Integer)
    exercise_count = Column(Integer)

class StudentCourseStat(Base):
    __tablename__ = "student_course_stats"
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True)
    course_id = Column(String, index=True)
    enroll_time = Column(DateTime)
    label = Column(Integer)
    predict = Column(Integer)
