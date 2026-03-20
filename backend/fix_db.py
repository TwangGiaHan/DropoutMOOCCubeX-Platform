import pandas as pd
import os
import time
from database import engine

DATA_DIR = "../../data"

def migrate_student_stats():
    print("Migrating student stats...")
    files = ["train_validate.csv", "test_P1_pred.csv", "test_P2_pred.csv", "test_P3_pred.csv", "test_P4_pred.csv", "test_P5_pred.csv"]
    
    combined = []
    for f in files:
        path = os.path.join(DATA_DIR, f)
        if os.path.exists(path):
            df = pd.read_csv(path)
            df['source_file'] = f.split('.')[0]
            combined.append(df)
            
    if not combined:
        print("No files found.")
        return
        
    df = pd.concat(combined, ignore_index=True)
    df['enroll_time'] = pd.to_datetime(df['enroll_time'], errors='coerce')
    
    if 'id' not in df.columns:
        df.insert(0, 'id', range(1, 1 + len(df)))
        
    import psycopg2
    df.to_sql("student_course_stats", engine, if_exists="replace", index=False, chunksize=5000)
    
    with engine.begin() as conn:
        conn.exec_driver_sql("ALTER TABLE student_course_stats ADD PRIMARY KEY (id)")
        
    print("Student stats patched successfully.")

if __name__ == "__main__":
    t0 = time.time()
    try:
        migrate_student_stats()
    except Exception as e:
        print(f"Error: {e}")
    print(f"Time: {time.time() - t0:.2f}s")
