import os

from dotenv import load_dotenv
from flask import Flask
from flask_cors import CORS
from src.database import db

app = Flask(__name__)

load_dotenv()

# app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('SQLALCHEMY_DATABASE_URI')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///teste.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

CORS(app)

from src.routes import route_customers, route_sales, route_users, route_vehicles
