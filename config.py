from os import environ

class Config:
   SQLALCHEMY_TRACK_MODIFICATIONS = False

   @staticmethod
   def init_app(app):
       pass

class DevelopmentConfig(Config):
   DEBUG=True
   SQLALCHEMY_DATABASE_URI = f'postgresql://{ environ.get("USER") }:postgres@localhost:5432/pokedexapp'

class TestingConfig(Config):
   DEBUG = True
   TESTING = True
   SQLALCHEMY_DATABASE_URI = environ.get(
       "TEST_DATABASE_URL")


config = {
   'development': DevelopmentConfig,
   'testing': TestingConfig,

   'default': DevelopmentConfig}