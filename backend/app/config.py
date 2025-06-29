import os

class Config:
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL",
        "postgresql://freelance_postgres_user:KuIMQY2aLiUUZLHI5fYLxfQWNLFTe5wX@dpg-d1gjk77fte5s738nrp80-a.oregon-postgres.render.com/freelance_postgres"
    )

    SQLALCHEMY_TRACK_MODIFICATIONS = False

    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "mary6539")
