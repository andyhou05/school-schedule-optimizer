from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_caching import Cache
from dotenv import load_dotenv

import os

SEMESTER = "W25" # set to Fxx, Wxx, or Sxx (fall, winter, summer)

app = Flask(__name__)
CORS(app)
cache = Cache()
load_dotenv()

password = os.getenv("MYSQL_PASSWORD")
host = "localhost:3309"
user = os.getenv("MOCKER_USER")
db_name = os.getenv("MOCKER_DB_NAME")

app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql+pymysql://{user}:{password}@{host}/{db_name}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['CACHE_TYPE'] = "simple"

cache.init_app(app)
db = SQLAlchemy(app)