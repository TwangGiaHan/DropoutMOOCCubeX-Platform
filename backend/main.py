from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

import models, crud, schemas
from database import engine, get_db

app = FastAPI(title="BI MOOCCubeX API", version="1.0.0", description="Backend API for MOOCCubeX Dropout Prediction")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to BI MOOCCubeX API! The Database is successfully connected."}

@app.get("/api/courses", response_model=List[schemas.CourseResponse])
def read_courses(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Fetch all courses with pagination."""
    courses = crud.get_courses(db, skip=skip, limit=limit)
    return courses

@app.get("/api/courses/{course_id}", response_model=schemas.CourseResponse)
def read_course(course_id: str, db: Session = Depends(get_db)):
    """Fetch a specific course by its course_id."""
    db_course = crud.get_course_by_id(db, course_id=course_id)
    if db_course is None:
        raise HTTPException(status_code=404, detail="Course not found")
    return db_course

@app.get("/api/students/stats", response_model=List[schemas.StudentCourseStatResponse])
def read_student_stats(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Fetch general student enrollment features."""
    stats = crud.get_student_stats(db, skip=skip, limit=limit)
    return stats

@app.get("/api/courses/{course_id}/students", response_model=List[schemas.StudentCourseStatResponse])
def read_course_students(course_id: str, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Fetch students and predictions belonging to a specific course."""
    stats = crud.get_student_stats_by_course(db, course_id=course_id, skip=skip, limit=limit)
    return stats

@app.get("/api/dashboard/overview")
def read_overview(db: Session = Depends(get_db)):
    """Fetch aggregated data for the Overview dashboard."""
    return crud.get_overview_stats(db)

@app.get("/api/dashboard/phase/{phase}")
def read_phase_stats(phase: int, db: Session = Depends(get_db)):
    """Fetch stats specifically for a given phase 1..5"""
    return crud.get_phase_stats(db, phase)

@app.get("/api/courses/{course_id}/stats")
def read_course_detail_stats(course_id: str, db: Session = Depends(get_db)):
    result = crud.get_course_stats(db, course_id)
    if not result:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Course not found")
    return result

@app.get("/api/students/{user_id}/stats")
def read_user_detail_stats(user_id: str, db: Session = Depends(get_db)):
    return crud.get_user_stats(db, user_id)

