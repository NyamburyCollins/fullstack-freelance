from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_restful import Api

from app.config import Config

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)

    CORS(app, origins=["http://localhost:5175"], supports_credentials=True)


    from .models import User, Service, Application, Category

    from .resources import register_resources
    from .auth import register_user_resources

    api = Api(app)
    register_resources(api)
    register_user_resources(api)

    return app
