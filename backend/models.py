from backend import db

class UserPokemonAssociation(db.Model):
    __tablename__ = 'user_pokemon'
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=True)
    pokemon_id = db.Column(db.Integer, db.ForeignKey('pokemon.id'), primary_key=True)


class User(db.Model):
   __tablename__ = 'user'
   id = db.Column(db.Integer, primary_key=True)
   user_name = db.Column(db.String(20))
   email = db.Column(
       db.String(64), unique=True, index=True)
   password = db.Column(
       db.String(64)
   )
   pokemons = db.relationship(
       "Pokemon", secondary='user_pokemon', backref='user')
   
   def __repr__(self):
       return f"<User {self.email} >"

class Pokemon(db.Model):
   __tablename__ = 'pokemon'
   id = db.Column(db.Integer, primary_key=True)
   pokemon_id = db.Column(db.Integer)
   name = db.Column(db.db.String(20))
#    users = db.relationship(
#        "User", secondary='user_pokemon', backref='pokemon'
#    )

   def __repr__(self):
        return f"Pokemon {self.name}"
   
#    profile_id = db.Column(
#        db.Integer, db.ForeignKey('profiles.id'))
#    profile = db.relationship(
#        "Profile", backref='user')


   
# class Profile(db.Model):
#     __tablename__ = 'profiles'
#     id = db.Column(db.Integer, primary_key=True)
#     first_name = db.Column(db.String(20))
#     last_name = db.Column(db.String(20))
#     skills = db.relationship("Skill")

#     def __repr__(self):
#         return f"<Profile {self.first_name} {self.last_name}: #{self.id} >"
    
# class Skill(db.Model):
#     __tablename__ = 'skills'
#     id = db.Column(db.Integer, primary_key=True)
#     name = db.Column(db.String(20), unique=True, index=True, nullable=False)
#     profile_id = db.Column(
#         db.Integer, db.ForeignKey('profiles.id')
#     )

#     def __repr__(self):
#         return f"<Skill {self.name} >"
