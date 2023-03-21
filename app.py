# from flask import Flask;
# from flask_sqlalchemy import SQLAlchemy;

# app = Flask(__name__)

# # app.config["SQLALCHEMY_DATABASE_URL"] = ""
# app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://postgres:postgres@localhost:5432/pokedexapp"

# db = SQLAlchemy(app)


# @app.route( "/" )
# def index():
#      return "<h1>Hello New World!</h1>"

# @app.route("/users/<name>")
# def user(name):
#     return f"<h1> Hello, {name}!</h1>"

from backend import create_app, db
from flask_migrate import Migrate

# We still need to create our models
# The following code you can comment out 
# if you want to run the application now
# Otherwise wait until we build these models next
from backend.models import User



app = create_app('development')
migrate = Migrate(app, db)



@app.shell_context_processor
def make_shell_context():
   return dict(db=db, User = User)