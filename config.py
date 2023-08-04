from os import environ

class Config:
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    @staticmethod
    def init_app(app):
        pass


class ProductionConfig(Config):
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = (
        f"postgresql://{environ['DB_USERNAME']}:{environ['DB_PASSWORD']}@"
        f"{environ['DB_HOST']}/{environ['DB_NAME']}"
    )
    SECRET_KEY = environ.get("PRODUCTION_SECRET_KEY")
    SESSION_TYPE = 'filesystem'


class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = f'postgresql://{environ["USER"]}:postgres@localhost:5432/pokedexapp'
    SECRET_KEY = environ["DEVELOPMENT_SECRET_KEY"],
    SESSION_TYPE = 'filesystem'


class TestingConfig(Config):
    DEBUG = True
    TESTING = True
    SQLALCHEMY_DATABASE_URI = environ.get(
        "TEST_DATABASE_URL")


config = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig,  # Add the production configuration
    'default': DevelopmentConfig  # Set the default configuration to development
}
