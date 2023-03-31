import graphene
from backend import db
from flask import session
from ..graphql.objects import UserObject as User, PokemonObject as Pokemon, UserPokemonObject as UserPokemon
from ..models import User as UserModel, Pokemon as PokemonModel, UserPokemonAssociation as UserPokemonModel
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import current_user, login_user, logout_user


class LoginMutation(graphene.Mutation):
    class Arguments:
        email = graphene.String(required=True)
        password = graphene.String(required=True)

    token = graphene.String()
    user = graphene.Field(User)

    def mutate(self, info, email, password):
        user = UserModel.query.filter_by(email=email).first()
        if user and check_password_hash(user.password, password):
            login_user(user)
            return LoginMutation(token="success", user=user)
        else:
            return LoginMutation(token=None, user=None)


class LogoutMutation(graphene.Mutation):
    token = graphene.String()

    def mutate(self, info):
        if current_user.is_authenticated:
            logout_user()
            session.clear()
            return LogoutMutation(token="success")
        return LogoutMutation(token=None)


class SignupMutation(graphene.Mutation):
    class Arguments:
        email = graphene.String(required=True)
        name = graphene.String(required=True)
        password = graphene.String(required=True)

    user = graphene.Field(lambda: User)
    token = graphene.String()

    def mutate(self, info, email, name, password):
        new_user = UserModel(email=email, name=name, password=generate_password_hash(
            password, method='sha256'))

        db.session.add(new_user)
        db.session.commit()

        return SignupMutation(user=new_user, token="success")
    

class PokemonMutation(graphene.Mutation):
    class Arguments:
        pokemon_id = graphene.Int()
        name = graphene.String(required=True)

    pokemon = graphene.Field(lambda: Pokemon)

    def mutate(self, info, pokemon_id, name):
        pokemon = PokemonModel(pokemon_id=pokemon_id, name=name)

        db.session.add(pokemon)
        db.session.commit()

        return PokemonMutation(pokemon=pokemon)
    
# class UserPokemonMutation(graphene.Mutation):
#     class Arguments:
#         user_id = graphene.Int()
#         pokemon_id = graphene.Int()
        
#     user_pokemon = graphene.Field(lambda: UserPokemon)


#     def mutate(self, info, pokemon_id, user_id):
#         pokemon = PokemonModel.query.filter_by(id=pokemon_id).first()
#         user = UserModel.query.filter_by(id=user_id).first()

#         if current_user.is_authenticated and current_user.id == user.id:
#             current_user.pokemons.append(pokemon)
#             db.session.commit()

#         return UserPokemonMutation(token="success")


class Mutation(graphene.ObjectType):
    signup = SignupMutation.Field()
    mutate_pokemon = PokemonMutation.Field()
    # mutate_user_pokemon = UserPokemonMutation.Field()
    login = LoginMutation.Field()
    logout = LogoutMutation.Field()
