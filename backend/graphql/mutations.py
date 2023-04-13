import graphene
from backend import db
from flask import session
from ..graphql.objects import UserObject as User, PokemonObject as Pokemon, UserPokemonObject as UserPokemon
from ..models import User as UserModel, Pokemon as PokemonModel, UserPokemonAssociation as UserPokemonModel
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import current_user, login_user, logout_user
from graphql_relay import from_global_id


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


class UserPokemonMutation(graphene.Mutation):
    class Arguments:
        user_id = graphene.String()
        pokemon_id = graphene.Int()
        is_active = graphene.Boolean()

    user_pokemon = graphene.Field(lambda: UserPokemon)

    def mutate(self, info, pokemon_id, user_id, is_active):
        type_name, original_id = from_global_id(user_id)
        pokemon = PokemonModel.query.filter_by(pokemon_id=pokemon_id).first()
        user = UserModel.query.filter_by(id=int(original_id)).first()

        if user and pokemon:
            user_pokemon = UserPokemonModel.query.filter_by(
                user_id=user.id, pokemon_id=pokemon.id).first()

            if user_pokemon:
                user_pokemon.is_active = is_active
            else:
                user_pokemon = UserPokemonModel(
                    user_id=user.id, pokemon_id=pokemon.id)
                db.session.add(user_pokemon)

            db.session.commit()

        return UserPokemonMutation(user_pokemon=user_pokemon)


class ShinyCounterMutation(graphene.Mutation):
    class Arguments:
        user_id = graphene.String()
        pokemon_id = graphene.Int()
        operation = graphene.String(required=True)
        value = graphene.Int()

    ok = graphene.Boolean()
    user_pokemon = graphene.Field(lambda: UserPokemon)

    def mutate(self, info,  pokemon_id, user_id, operation, value=None):
        type_name, original_id = from_global_id(user_id)
        pokemon = PokemonModel.query.filter_by(pokemon_id=pokemon_id).first()
        user = UserModel.query.filter_by(id=int(original_id)).first()
        user_pokemon = UserPokemonModel.query.filter_by(
            user_id=user.id, pokemon_id=pokemon.id).first()

        if not user_pokemon:
            return ShinyCounterMutation(ok=False, user_pokemon=None)

        if operation == "increment":
            user_pokemon.shiny_counter += 1
        elif operation == "decrement":
            user_pokemon.shiny_counter -= 1
        elif operation == "set" and value is not None and value > -1:
            user_pokemon.shiny_counter = value
        else:
            return ShinyCounterMutation(ok=False, user_pokemon=None)

        db.session.commit()

        return ShinyCounterMutation(ok=True, user_pokemon=user_pokemon)


class Mutation(graphene.ObjectType):
    signup = SignupMutation.Field()
    mutate_pokemon = PokemonMutation.Field()
    mutate_user_pokemon = UserPokemonMutation.Field()
    login = LoginMutation.Field()
    logout = LogoutMutation.Field()
    mutate_shiny_counter = ShinyCounterMutation.Field()
