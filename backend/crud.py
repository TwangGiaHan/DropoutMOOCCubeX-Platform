from sqlalchemy.orm import Session
from sqlalchemy import text
import models

# Global filter to only count the unified true dataset population (prevent duplicate counting from phase test chunks)
BASE_SRC = "source_file IN ('train_validate', 'test_P5_pred')"

def get_courses(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Course).offset(skip).limit(limit).all()

def get_course_by_id(db: Session, course_id: str):
    return db.query(models.Course).filter(models.Course.course_id == course_id).first()

def get_student_stats(db: Session, skip: int = 0, limit: int = 100):
    return db.execute(text(f"SELECT * FROM student_course_stats WHERE {BASE_SRC} LIMIT {limit} OFFSET {skip}")).fetchall()

def get_overview_stats(db: Session):
    total_students = db.execute(text(f"SELECT COUNT(DISTINCT user_id) FROM student_course_stats WHERE {BASE_SRC}")).scalar() or 0
    total_courses = db.execute(text(f"SELECT COUNT(DISTINCT course_id) FROM courses")).scalar() or 0
    total_enrollments = db.execute(text(f"SELECT COUNT(*) FROM student_course_stats WHERE {BASE_SRC}")).scalar() or 0
    
    dropout_rows = db.execute(text(f"SELECT COUNT(*) FROM student_course_stats WHERE label = 1 AND {BASE_SRC}")).scalar() or 0
    dropout_rate = (dropout_rows / total_enrollments * 100) if total_enrollments else 0

    trend_result = db.execute(text(f"""
        SELECT start_year, start_month, COUNT(*) as cnt 
        FROM student_course_stats 
        WHERE {BASE_SRC}
        GROUP BY start_year, start_month 
        ORDER BY start_year, start_month
    """)).fetchall()
    
    trend = [{"date": f"{int(row[0])}-{int(row[1]):02d}", "count": row[2]} for row in trend_result if row[0] is not None]

    top_courses_result = db.execute(text(f"""
        SELECT s.course_id, c.course_name, COUNT(*) as cnt 
        FROM student_course_stats s
        LEFT JOIN courses c ON s.course_id = c.course_id
        WHERE s.label = 1 AND {BASE_SRC.replace('source_file', 's.source_file')}
        GROUP BY s.course_id, c.course_name 
        ORDER BY cnt DESC LIMIT 5
    """)).fetchall()
    top_courses = [{"course_id": row[0], "course_name": row[1] or "Unknown", "dropout_count": row[2]} for row in top_courses_result]

    return {
        "total_students": total_students,
        "total_courses": total_courses,
        "total_enrollments": total_enrollments,
        "dropout_rate": dropout_rate,
        "trend": trend,
        "top_courses": top_courses
    }

def get_phase_stats(db: Session, phase: int):
    vcol = f'"num_videos_P{phase}"'
    acol = f'"n_attempts_P{phase}"'
    
    try:
        videos = db.execute(text(f"SELECT SUM({vcol}) FROM student_course_stats WHERE {BASE_SRC}")).scalar() or 0
        attempts = db.execute(text(f"SELECT SUM({acol}) FROM student_course_stats WHERE {BASE_SRC}")).scalar() or 0
    except Exception:
        db.rollback()
        videos, attempts = 0, 0

    total_all_videos = db.execute(text("SELECT SUM(video_count) FROM courses")).scalar() or 0
    total_all_exercises = db.execute(text("SELECT SUM(exercise_count) FROM courses")).scalar() or 0

    chart_data = []
    for p in range(1, phase + 1):
        if p < phase:
            c = db.execute(text(f"SELECT COUNT(*) FROM student_course_stats WHERE source_file = 'test_P{p}_pred' AND label = 1")).scalar() or 0
            chart_data.append({"name": f"Phase {p}", "Actual Dropouts": c})
        else:
            c = db.execute(text(f"SELECT COUNT(*) FROM student_course_stats WHERE source_file = 'test_P{p}_pred' AND predict = 1")).scalar() or 0
            chart_data.append({"name": f"Phase {p}", "Predicted Dropouts": c})

    return {
        "phase": phase,
        "videos": videos,
        "attempts": attempts,
        "total_all_videos": total_all_videos,
        "total_all_exercises": total_all_exercises,
        "chart_data": chart_data
    }

def get_course_stats(db: Session, course_id: str):
    course = db.query(models.Course).filter(models.Course.course_id == course_id).first()
    if not course:
        return None
    
    total_enrollments = db.execute(text(f"SELECT COUNT(*) FROM student_course_stats WHERE course_id = :cid AND {BASE_SRC}"), {"cid": course_id}).scalar() or 0
    dropouts = db.execute(text(f"SELECT COUNT(*) FROM student_course_stats WHERE course_id = :cid AND label = 1 AND {BASE_SRC}"), {"cid": course_id}).scalar() or 0
    dropout_rate = (dropouts / total_enrollments * 100) if total_enrollments else 0

    at_risk_students = db.execute(text(f"""
        SELECT user_id FROM student_course_stats 
        WHERE course_id = :cid AND predict = 1 AND source_file = 'test_P5_pred'
        LIMIT 10
    """), {"cid": course_id}).fetchall()

    phases_data = []
    for p in range(1, 6):
        vcol = f'"num_videos_P{p}"'
        acol = f'"n_attempts_P{p}"'
        dcol = f'"phase{p}_days"'
        
        pv = db.execute(text(f"SELECT AVG({vcol}) FROM student_course_stats WHERE course_id = :cid AND {BASE_SRC}"), {"cid": course_id}).scalar() or 0
        pa = db.execute(text(f"SELECT AVG({acol}) FROM student_course_stats WHERE course_id = :cid AND {BASE_SRC}"), {"cid": course_id}).scalar() or 0
        pd = db.execute(text(f"SELECT AVG({dcol}) FROM student_course_stats WHERE course_id = :cid AND {BASE_SRC}"), {"cid": course_id}).scalar() or 0
        phases_data.append({"name": f"P{p}", "videos": float(pv), "attempts": float(pa), "days": float(pd)})

    score_dist_raw = db.execute(text(f"""
        SELECT WIDTH_BUCKET("avg_score_P5", 0, 100, 10) as bucket, COUNT(*) as cnt
        FROM student_course_stats
        WHERE course_id = :cid AND "avg_score_P5" IS NOT NULL AND {BASE_SRC}
        GROUP BY bucket ORDER BY bucket
    """), {"cid": course_id}).fetchall()
    
    score_distribution = []
    for row in score_dist_raw:
        if row[0] is None: continue
        b = int(row[0])
        label = f"{(b-1)*10}-{b*10}" if b <= 10 else "100+"
        score_distribution.append({"range": label, "count": row[1]})

    return {
        "course": {
            "course_id": course.course_id, "course_name": course.course_name,
            "school": course.school_name, "duration": course.class_duration_days
        },
        "total_enrollments": total_enrollments, "dropout_rate": dropout_rate,
        "dropouts": dropouts, "retain": total_enrollments - dropouts,
        "phases_data": phases_data,
        "score_distribution": score_distribution,
        "at_risk_users": [r[0] for r in at_risk_students]
    }

def get_user_stats(db: Session, user_id: str):
    enrollments_result = db.execute(text(f"SELECT course_id, label, predict FROM student_course_stats WHERE user_id = :uid AND {BASE_SRC}"), {"uid": user_id}).fetchall()
    enrollments = [{"course_id": r[0], "actual_dropout": r[1], "predicted_dropout": r[2]} for r in enrollments_result]
    
    videos = db.execute(text(f'SELECT SUM("num_videos_P5") FROM student_course_stats WHERE user_id = :uid AND {BASE_SRC}'), {"uid": user_id}).scalar() or 0
    attempts = db.execute(text(f'SELECT SUM("n_attempts_P5") FROM student_course_stats WHERE user_id = :uid AND {BASE_SRC}'), {"uid": user_id}).scalar() or 0

    phases_data = []
    for p in range(1, 6):
        pv = db.execute(text(f'SELECT SUM("num_videos_P{p}") FROM student_course_stats WHERE user_id = :uid AND {BASE_SRC}'), {"uid": user_id}).scalar() or 0
        pa = db.execute(text(f'SELECT SUM("n_attempts_P{p}") FROM student_course_stats WHERE user_id = :uid AND {BASE_SRC}'), {"uid": user_id}).scalar() or 0
        pd = db.execute(text(f'SELECT SUM("phase{p}_days") FROM student_course_stats WHERE user_id = :uid AND {BASE_SRC}'), {"uid": user_id}).scalar() or 0
        phases_data.append({"name": f"P{p}", "videos": float(pv), "attempts": float(pa), "days": float(pd)})

    return {
        "user_id": user_id, "total_enrolled_courses": len(enrollments),
        "enrollments": enrollments, "total_videos_watched": int(videos),
        "total_attempts": int(attempts), "phases_data": phases_data
    }
