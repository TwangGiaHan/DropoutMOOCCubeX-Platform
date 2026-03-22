from database import SessionLocal
import crud
import traceback

def run():
    db = SessionLocal()
    try:
        print("Testing get_overview_stats...")
        crud.get_overview_stats(db)
        print("Success")
    except Exception as e:
        with open("error_log.txt", "w") as f:
            f.write(traceback.format_exc())
    finally:
        db.close()

if __name__ == "__main__":
    run()
