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

class TeamPokemon(db.Model):
    __tablename__ = 'team_pokemon'
    id = db.Column(db.Integer, primary_key=True)
    team_id = db.Column(db.Integer, db.ForeignKey('team.id'))
    pokemon_id = db.Column(db.Integer, db.ForeignKey('pokemon.id'))
    move1_id = db.Column(db.Integer, db.ForeignKey('move.id'))
    move2_id = db.Column(db.Integer, db.ForeignKey('move.id'))
    move3_id = db.Column(db.Integer, db.ForeignKey('move.id'))
    move4_id = db.Column(db.Integer, db.ForeignKey('move.id'))
    ability_id = db.Column(db.Integer, db.ForeignKey('ability.id'))
    item_id = db.Column(db.Integer, db.ForeignKey('item.id'))
    nature_id = db.Column(db.Integer, db.ForeignKey('nature.id'))
    stats = db.Column(db.ARRAY(db.Integer, dimensions=1), default=[0, 0, 0, 0, 0, 0])
    ivs = db.Column(db.ARRAY(db.Integer, dimensions=1), default=[0, 0, 0, 0, 0, 0])
    evs = db.Column(db.ARRAY(db.Integer, dimensions=1), default=[0, 0, 0, 0, 0, 0])
    tera_type_id = db.Column(db.Integer, db.ForeignKey('type.id'))
    level = db.Column(db.Integer, default=50)
    position = db.Column(db.Integer)
    
    __table_args__ = (db.UniqueConstraint('team_id', 'position', name='_team_position_uc'),)


class User(db.Model, UserMixin):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    email = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(100))
    teams = db.relationship('Team', backref='user', lazy=True)

    def __repr__(self):
        return f"<User {self.email} >"
    
class Team(db.Model):
    __tablename__ = 'team'
    id = db.Column(db.Integer, primary_key=True)
    team_id = db.Column(db.Integer)
    name = db.Column(db.String(50))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    pokemons = db.relationship('TeamPokemon', backref='team', lazy=True)


class Pokemon(db.Model):
    __tablename__ = 'pokemon'
    id = db.Column(db.Integer, primary_key=True)
    pokemon_id = db.Column(db.Integer)
    name = db.Column(db.String(50))
    # hp, attack, defense, speed, special-defense, special-attack  Ordered on Chart
    base_stats = db.Column(db.ARRAY(db.Integer, dimensions=1))
    type1_id = db.Column(db.Integer, db.ForeignKey('type.id'))
    type2_id = db.Column(db.Integer, db.ForeignKey('type.id'))

    def __repr__(self):
        return f"Pokemon {self.name}"


class Move(db.Model):
    __tablename__ = 'move'
    id = db.Column(db.Integer, primary_key=True)
    move_id = db.Column(db.Integer)
    name = db.Column(db.String(50))
    type_id = db.Column(db.Integer, db.ForeignKey('type.id'))


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


class Location(db.Model):
    __tablename__ = 'location'
    id = db.Column(db.Integer, primary_key=True)
    location_id = db.Column(db.Integer)
    name = db.Column(db.String(50))


class Nature(db.Model):
    __tablename__ = 'nature'
    id = db.Column(db.Integer, primary_key=True)
    nature_id = db.Column(db.Integer)
    name = db.Column(db.String(20), nullable=False)
    increased_stat = db.Column(db.String(20), nullable=False)
    decreased_stat = db.Column(db.String(20), nullable=False)


class Type(db.Model):
    __tablename__ = 'type'
    id = db.Column(db.Integer, primary_key=True)
    type_id = db.Column(db.Integer)
    name = db.Column(db.String(50))


class EggGroup(db.Model):
    __tablename__ = 'egg_group'
    id = db.Column(db.Integer, primary_key=True)
    egg_group_id = db.Column(db.Integer)
    name = db.Column(db.String(50))
