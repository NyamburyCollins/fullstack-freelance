from flask import request
from flask_restful import Resource
from flask_jwt_extended import create_access_token
from .models import User, db
from sqlalchemy.exc import IntegrityError
import traceback

class Signup(Resource):
    def post(self):
        data = request.get_json(silent=True)

        if not data:
            return {"message": "Missing or invalid JSON"}, 400

        print("Signup JSON payload:", data)

        username = data.get("username")
        email = data.get("email")
        password = data.get("password")
        role = data.get("role", "client")
        if not all([username, email, password]):
            return {"message": "All fields are required"}, 400

        if User.query.filter_by(username=username).first():
            return {"message": "Username already exists"}, 400
        if User.query.filter_by(email=email).first():
            return {"message": "Email already exists"}, 400

        try:
            user = User(username=username, email=email)
            user.password = password
            user.role = role

            db.session.add(user)
            db.session.commit()

            return {"message": "User created successfully"}, 201

        except ValueError as ve:
            db.session.rollback()
            return {"message": str(ve)}, 400

        except IntegrityError:
            db.session.rollback()
            return {"message": "Username or email already exists"}, 400

        except Exception as e:
            print("Signup error:", e)
            traceback.print_exc()
            db.session.rollback()
            return {"message": "Internal Server Error"}, 500

class Login(Resource):
    def post(self):
        data = request.get_json(silent=True)

        if not data:
            return {"message": "Missing or invalid JSON"}, 400

        username_or_email = data.get("username") or data.get("email")
        password = data.get("password")

        if not username_or_email or not password:
            return {"message": "Username/email and password are required"}, 400

        user = User.query.filter(
            (User.username == username_or_email) | (User.email == username_or_email)
        ).first()

        if user and user.check_password(password):
            access_token = create_access_token(identity=user.id)
            return {
                "access_token": access_token,
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "role": user.role
                }
            }, 200

        return {"message": "Invalid credentials"}, 401


def register_user_resources(api):
    api.add_resource(Signup, '/signup')
    api.add_resource(Login, '/login')
