
from. import db
from sqlalchemy.orm import validates
from werkzeug.security import generate_password_hash, check_password_hash

service_categories = db.Table(
    'service_categories',
    db.Column('service_id', db.Integer, db.ForeignKey('services.id'), primary_key=True),
    db.Column('category_id', db.Integer, db.ForeignKey('categories.id'), primary_key=True)
)

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), nullable=False, unique=True)
    email = db.Column(db.String(120), nullable=False, unique=True)
    _password_hash = db.Column(db.String, nullable=False)
    bio = db.Column(db.Text)
    role = db.Column(db.String(20), nullable=False)

    services = db.relationship("Service", backref="client", lazy=True)
    applications = db.relationship("Application", backref="freelancer", lazy=True)

    @property
    def password(self):
        raise AttributeError("Password is write-only")

    @password.setter
    def password(self, plain_text_password):
        if len(plain_text_password) < 6:
            raise ValueError("Password must be at least 6 characters.")
        self._password_hash = generate_password_hash(plain_text_password)

    def check_password(self, password):
        return check_password_hash(self._password_hash, password)

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "bio": self.bio,
            "role": self.role
        }


class Service(db.Model):
    __tablename__ = 'services'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    budget = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), default="open")
    client_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    applications = db.relationship("Application", backref="service", lazy=True)
    categories = db.relationship("Category", secondary=service_categories, backref="services")

    @validates('budget')
    def validate_budget(self, key, value):
        value = int(value)
        if value <= 0:
            raise ValueError("Budget must be greater than 0.")
        return value

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "budget": self.budget,
            "status": self.status,
            "client_id": self.client_id,
            "categories": [category.name for category in self.categories]
        }


class Application(db.Model):
    __tablename__ = 'applications'

    id = db.Column(db.Integer, primary_key=True)
    status = db.Column(db.String(20), default='pending')
    message = db.Column(db.Text)
    freelancer_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    service_id = db.Column(db.Integer, db.ForeignKey('services.id'), nullable=False)

    __table_args__ = (
        db.UniqueConstraint('freelancer_id', 'service_id', name='unique_application'),
    )

    def to_dict(self):
        return {
            "id": self.id,
            "status": self.status,
            "message": self.message,
            "freelancer_id": self.freelancer_id,
            "service_id": self.service_id
        }


class Category(db.Model):
    __tablename__ = 'categories'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name
        }

