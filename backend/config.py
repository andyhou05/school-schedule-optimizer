from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

import os

SEMESTER = "W25" # set to Fxx, Wxx, or Sxx (fall, winter, summer)

app = Flask(__name__)
CORS(app)

password = os.environ.get("MYSQL_PASSWORD")
host = "localhost:3309"
user = os.environ["MOCKER_USER"]
db_name = os.environ["MOCKER_DB_NAME"]

app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql+pymysql://{user}:{password}@{host}/{db_name}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)