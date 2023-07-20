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
    is_active = db.Column(db.Boolean, default=True)


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
    name = db.Column(db.String(50))

    def __repr__(self):
        return f"Pokemon {self.name}"


class Move(db.Model):
    __tablename__ = 'move'
    id = db.Column(db.Integer, primary_key=True)
    move_id = db.Column(db.Integer)
    name = db.Column(db.String(50))

class Ability(db.Model):
    __tablename__ = 'ability'
    id = db.Column(db.Integer, primary_key=True)
    ability_id = db.Column(db.Integer)
    name = db.Column(db.String(50))

class Item(db.Model):
    __tablename__ = 'item'
    id = db.Column(db.Integer, primary_key=True)
    item_id = db.Column(db.Integer)
    name = db.Column(db.String(50))


class Nature(db.Model):
    __tablename__ = 'nature'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(20), nullable=False)
    increased_stat = db.Column(db.String(20), nullable=False)
    decreased_stat = db.Column(db.String(20), nullable=False)

class Type(db.Model):
    __tablename__ = 'type'
    id = db.Column(db.Integer, primary_key=True)
    type_id = db.Column(db.Integer)
    name = db.Column(db.String(50))
