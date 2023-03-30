import graphene
from backend import db
from flask import session
from ..graphql.objects import UserObject as User, PokemonObject as Pokemon
from ..models import User as UserModel, Pokemon as PokemonModel
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


class UserMutation(graphene.Mutation):
    class Arguments:
        email = graphene.String(required=True)
        user_name = graphene.String(required=True)
        password = graphene.String(required=True)
    user = graphene.Field(lambda: User)

    def mutate(self, info, email, user_name, password):
        user = UserModel(email=email, user_name=user_name, password=password)

        db.session.add(user)
        db.session.commit()

        return UserMutation(user=user)


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


class Mutation(graphene.ObjectType):
    mutate_user = UserMutation.Field()
    mutate_pokemon = PokemonMutation.Field()
    login = LoginMutation.Field()
    logout = LogoutMutation.Field()
