
import os

class Config:
    # Use environment variable for DB URI or fallback to SQLite
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL", "sqlite:///app.db"
    )

    # Disable SQLAlchemy event system (recommended for performance)
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Secret key for JWT auth
    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "mary6539")
