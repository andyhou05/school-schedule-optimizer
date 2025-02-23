from flask_sqlalchemy.model import Model
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import Session
from dotenv import load_dotenv

import os

def connect_db() -> Session:
    """
    Connects to the Mocker database.

    Returns:
        Session: Session object that can be used to query database.
    """
    # Environment variables
    password = os.getenv("MYSQL_PASSWORD")
    host = os.getenv("MOCKER_ENDPOINT")
    user = os.getenv("MOCKER_USER")
    db_name = os.getenv("MOCKER_DB_NAME")
    
    engine = create_engine(f"mysql+pymysql://{user}:{password}@{host}/{db_name}")
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
