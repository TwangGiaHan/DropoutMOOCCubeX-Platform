import pandas as pd
import os
import time
from database import engine

DATA_DIR = "../../data"

def migrate_courses():
    print("Migrating courses...")
    path = os.path.join(DATA_DIR, "course_info_final_P5.csv")
    if not os.path.exists(path):
        print(f"File not found: {path}")
        return
        
    df = pd.read_csv(path)
    df['class_start'] = pd.to_datetime(df['class_start'], errors='coerce')
    df['class_end'] = pd.to_datetime(df['class_end'], errors='coerce')
    
    # Check if id column exists, if not add it
    if 'id' not in df.columns:
        df.insert(0, 'id', range(1, 1 + len(df)))
        
    df.to_sql("courses", engine, if_exists="replace", index=False)
    
    with engine.begin() as conn:
        conn.exec_driver_sql("ALTER TABLE courses ADD PRIMARY KEY (id)")
    print("Courses migrated successfully.")

def migrate_student_stats():
    print("Migrating student stats...")
    files = ["train_validate.csv", "test_P1_pred.csv", "test_P2_pred.csv", "test_P3_pred.csv", "test_P4_pred.csv", "test_P5_pred.csv"]
    
    combined = []
    for f in files:
        path = os.path.join(DATA_DIR, f)
        if os.path.exists(path):
            df_curr = pd.read_csv(path)
            df_curr['source_file'] = f.replace('.csv', '')
            combined.append(df_curr)
            
    if not combined:
        print("No student stats files found.")
        return
        
    df = pd.concat(combined, ignore_index=True)
    df['enroll_time'] = pd.to_datetime(df['enroll_time'], errors='coerce')
    
    if 'id' not in df.columns:
        df.insert(0, 'id', range(1, 1 + len(df)))
        
    print(f"Total rows to migrate: {len(df)}")
    df.to_sql("student_course_stats", engine, if_exists="replace", index=False, chunksize=5000)
    
    with engine.begin() as conn:
        conn.exec_driver_sql("ALTER TABLE student_course_stats ADD PRIMARY KEY (id)")
        
    print("Student stats migrated successfully.")

if __name__ == "__main__":
    t0 = time.time()
    try:
        migrate_courses()
    except Exception as e:
        print(f"Error migrating courses: {e}")
        
    try:
        migrate_student_stats()
    except Exception as e:
        print(f"Error migrating student stats: {e}")
        
    print(f"Migration finished in {time.time() - t0:.2f} seconds.")
