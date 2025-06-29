
from flask_restful import Resource, reqparse
from flask import request
from flask_jwt_extended import jwt_required, get_jwt_identity
from .models import db, User, Service, Application, Category
from werkzeug.security import generate_password_hash
from sqlalchemy.exc import IntegrityError

user_parser = reqparse.RequestParser()
user_parser.add_argument("username", required=True)
user_parser.add_argument("email", required=True)
user_parser.add_argument("password", required=True)


class UserListResource(Resource):
    def post(self):
        args = user_parser.parse_args()

        if User.query.filter((User.username == args["username"]) | (User.email == args["email"])).first():
            return {"error": "Username or email already exists"}, 409

        new_user = User(
            username=args["username"],
            email=args["email"],
            password=args["password"],
            role="client"
        )

        db.session.add(new_user)
        db.session.commit()

        return {
            "id": new_user.id,
            "username": new_user.username,
            "email": new_user.email,
            "role": new_user.role
        }, 201

    def get(self):
        users = User.query.all()
        return [user.to_dict() for user in users], 200


class UserProfileResource(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user:
            return {"error": "User not found"}, 404
        return user.to_dict(), 200

    @jwt_required()
    def patch(self):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user:
            return {"error": "User not found"}, 404

        data = request.get_json()
        user.bio = data.get("bio", user.bio)
        db.session.commit()
        return user.to_dict(), 200

class ServicesResource(Resource):
    def get(self):
        services = Service.query.all()
        return [service.to_dict() for service in services], 200

    @jwt_required()
    def post(self):
        data = request.get_json()
        user_id = get_jwt_identity()

        service = Service(
            title=data["title"],
            description=data["description"],
            budget=data["budget"],
            client_id=user_id
        )

        db.session.add(service)
        db.session.commit()

        for cat_id in data.get("category_ids", []):
            category = Category.query.get(cat_id)
            if category:
                service.categories.append(category)

        db.session.commit()
        return service.to_dict(), 201

class ServiceByIDResource(Resource):
    def get(self, id):
        service = Service.query.get(id)
        if not service:
            return {"error": "Service not found"}, 404
        return service.to_dict(), 200

    @jwt_required()
    def patch(self, id):
        service = Service.query.get(id)
        user_id = get_jwt_identity()

        if not service:
            return {"error": "Service not found"}, 404
        if service.client_id != user_id:
            return {"error": "Unauthorized"}, 403

        data = request.get_json()
        service.title = data.get("title", service.title)
        service.description = data.get("description", service.description)
        service.budget = data.get("budget", service.budget)
        service.status = data.get("status", service.status)

        db.session.commit()
        return service.to_dict(), 200

    @jwt_required()
    def delete(self, id):
        service = Service.query.get(id)
        user_id = get_jwt_identity()

        if not service:
            return {"error": "Service not found"}, 404
        if service.client_id != user_id:
            return {"error": "Unauthorized"}, 403

        db.session.delete(service)
        db.session.commit()
        return "", 204





class ApplyServiceResource(Resource):
    @jwt_required()
    def post(self, service_id):
        user_id = get_jwt_identity()
        data = request.get_json()
        message = data.get("message")

        print(f"User {user_id} attempting to apply to service {service_id}")
        print("Message:", message)

        existing_application = Application.query.filter_by(
            service_id=service_id,
            freelancer_id=user_id
        ).first()

        if existing_application:
            existing_application.message = message
            db.session.commit()
            return {"message": "Application updated"}, 200

        application = Application(
            status="pending",
            message=message,
            service_id=service_id,
            freelancer_id=user_id
        )
        db.session.add(application)
        db.session.commit()

        print("Application submitted successfully!")
        return application.to_dict(), 201



class ApplicationsByUserResource(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        apps = Application.query.filter_by(freelancer_id=user_id).all()
        return [app.to_dict() for app in apps], 200

class ApplicationResource(Resource):
    @jwt_required()
    def post(self):
        data = request.get_json()
        freelancer_id = data.get("freelancer_id")
        service_id = data.get("service_id")
        message = data.get("message")

        if not all([freelancer_id, service_id, message]):
            return {"message": "All fields are required"}, 400

        new_app = Application(
            freelancer_id=freelancer_id,
            service_id=service_id,
            message=message
        )
        db.session.add(new_app)
        db.session.commit()

        return {"message": "Application submitted successfully"}, 201




class CategoriesResource(Resource):
    def get(self):
        return [cat.to_dict() for cat in Category.query.all()], 200



class ResetPasswordByIdResource(Resource):
    @jwt_required()
    def put(self, user_id):
        current_user_id = get_jwt_identity()

        if int(user_id) != current_user_id:
            return {"error": "Unauthorized access"}, 403

        data = request.get_json()
        new_password = data.get("password")

        if not new_password or len(new_password) < 6:
            return {"error": "Password must be at least 6 characters long"}, 400

        user = User.query.get(user_id)
        if not user:
            return {"error": "User not found"}, 404

        user.password = generate_password_hash(new_password)
        db.session.commit()

        return {"message": "Password reset successful"}, 200

class FreelancerListResource(Resource):
    def get(self):
        freelancers = User.query.filter_by(role="freelancer").all()
        return [freelancer.to_dict() for freelancer in freelancers], 200


class MyServicesResource(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        print("GET /my-services — Logged in user_id:", user_id)
        services = Service.query.filter_by(client_id=user_id).all()
        return [service.to_dict() for service in services], 200


def register_resources(api):
    api.add_resource(UserListResource, '/users')
    api.add_resource(UserProfileResource, '/profile')

    api.add_resource(ServicesResource, '/services')
    api.add_resource(ServiceByIDResource, '/services/<int:id>')
    api.add_resource(ApplyServiceResource, '/services/<int:service_id>/apply')

    api.add_resource(ApplicationsByUserResource, '/applications')
    api.add_resource(CategoriesResource, '/categories')
    api.add_resource(ResetPasswordByIdResource, '/users/<int:user_id>/reset-password')
    api.add_resource(FreelancerListResource, "/freelancers")
    api.add_resource(ApplicationResource, '/applications')

    api.add_resource(MyServicesResource, "/my-services")
