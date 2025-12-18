from flask_sqlalchemy.model import Model
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import Session
from dotenv import load_dotenv
from pathlib import Path

import os

dotenv_path = Path(__file__).parent.parent / ".env"
load_dotenv(dotenv_path, override=True)

def connect_db() -> Session:
    """
    Connects to the Mocker database.

    Returns:
        Session: Session object that can be used to query database.
    """
    # Environment variables
    password = os.getenv("DB_PASSWORD")
    host = os.getenv("MOCKER_ENDPOINT")
    user = os.getenv("MOCKER_USER")
    db_name = os.getenv("MOCKER_DB_NAME")
    port = os.getenv("PORT")
    DATABASE_URL = f"postgresql+psycopg2://{user}:{password}@{host}:{port}/{db_name}?sslmode=require"
    
    engine = create_engine(DATABASE_URL)
    Session = sessionmaker(bind=engine)
    session = Session()
    return session

def add_entry(session: Session, entry: Model) -> None:
    """
    Adds an entry to the specific table that is linked to the Model.

    Args:
        session (Session): Session object that has connection to the database.
        entry (Model): Entry that we want to add to the Model object's table.
    """
    try:
        print(f"Added {entry}\n") # Log message to console
        session.add(entry)
        session.commit()
    except Exception as e:
        print(f"Unable to add to table: {e}\n")
        session.rollback()



# Testing db connection
if __name__ == "__main__":
    password = os.getenv("DB_PASSWORD")
    host = os.getenv("MOCKER_ENDPOINT")
    user = os.getenv("MOCKER_USER")
    db_name = os.getenv("MOCKER_DB_NAME")
    port = os.getenv("PORT")
    
    print("User:", os.getenv("MOCKER_USER"))
    print("Password:", os.getenv("DB_PASSWORD"))
    print("Host:", os.getenv("MOCKER_ENDPOINT"))
    print("Port:", os.getenv("PORT"))
    print("DB:", os.getenv("MOCKER_DB_NAME"))
    
    DATABASE_URL = f"postgresql+psycopg2://{user}:{password}@{host}:{port}/{db_name}?sslmode=require"

    engine = create_engine(DATABASE_URL)

    try:
        with engine.connect():
            print("Connection successful!")
    except Exception as e:
        print("Failed to connect:", e)