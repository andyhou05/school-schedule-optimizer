from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os


app = Flask(__name__)
CORS(app)

password = os.environ.get("MYSQL_PASSWORD")
app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql+mysqlconnector://root:{password}@localhost/courses"
app.config['SQLALCHEMY-TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)