from flask import Flask
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from config import config

from flask_graphql import GraphQLView

db = SQLAlchemy()


def create_app(config_name):
    app = Flask(__name__)
    CORS(app, supports_credentials=True)
    app.config.from_object(config[config_name])
    config[config_name].init_app(app)

    db.init_app(app)

    login_manager = LoginManager()
    login_manager.init_app(app)

    from .models import User

    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))

    from .schema import schema

    app.add_url_rule(
        '/graphql',
        view_func=GraphQLView.as_view(
            'graphql',
            schema=schema,
            graphiql=True
        )
    )
    return app
