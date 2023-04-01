from flask_login import UserMixin
from backend import db


class UserPokemonAssociation(db.Model):
    __tablename__ = 'user_pokemon'
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=True)
    pokemon_id = db.Column(db.Integer, db.ForeignKey(
        'pokemon.id'), primary_key=True)
    shiny_counter = db.Column(db.Integer, default=0)
    user = db.relationship('User', backref=db.backref(
        'user_pokemon', cascade='all, delete-orphan'))
    pokemons = db.relationship('Pokemon', backref=db.backref(
        'user_pokemon', cascade='all, delete-orphan'))


class User(db.Model, UserMixin):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    email = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(100))

    def __repr__(self):
        return f"<User {self.email} >"


class Pokemon(db.Model):
    __tablename__ = 'pokemon'
    id = db.Column(db.Integer, primary_key=True)
    pokemon_id = db.Column(db.Integer)
    name = db.Column(db.db.String(20))

    def __repr__(self):
        return f"Pokemon {self.name}"
