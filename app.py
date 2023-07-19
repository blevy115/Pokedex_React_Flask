from backend import create_app, db
from flask_migrate import Migrate
from backend.models import User
from dotenv import load_dotenv
from os import environ

load_dotenv()

debug_mode = environ.get('FLASK_DEBUG', False) 
print( debug_mode in ['1', 'True'])
app = create_app('development' if debug_mode in ['1', 'True'] else 'production')

migrate = Migrate(app, db)


@app.shell_context_processor
def make_shell_context():
    return dict(db=db, User=User)
