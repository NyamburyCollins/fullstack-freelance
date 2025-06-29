
from flask import jsonify, request
from flask_restful import Api
from app import create_app, db
from app.models import User, Service, Application, Category
from dotenv import load_dotenv

load_dotenv()

app = create_app()
api = Api(app)

@app.shell_context_processor
def make_shell_context():
    return {
        'db': db,
        'User': User,
        'Service': Service,
        'Application': Application,
        'Category': Category
    }

if __name__ == '__main__':
    app.run(debug=True, port=5003)
