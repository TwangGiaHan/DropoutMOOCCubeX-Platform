from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class CourseBase(BaseModel):
    course_id: str
    course_name: Optional[str] = None
    school_name: Optional[str] = None
    class_start: Optional[datetime] = None
    class_end: Optional[datetime] = None
    user_count: Optional[int] = None
    class_duration_days: Optional[int] = None
    video_count: Optional[int] = None
    exercise_count: Optional[int] = None

class CourseResponse(CourseBase):
    id: int

    class Config:
        from_attributes = True

class StudentCourseStatBase(BaseModel):
    user_id: str
    course_id: str
    enroll_time: Optional[datetime] = None
    label: Optional[int] = None
    predict: Optional[int] = None

class StudentCourseStatResponse(StudentCourseStatBase):
    id: int

    class Config:
        from_attributes = True
