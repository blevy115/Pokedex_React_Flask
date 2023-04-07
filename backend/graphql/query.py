import graphene
from graphene import relay
from graphene_sqlalchemy import SQLAlchemyConnectionField
from graphql_relay import from_global_id

from ..models import User as UserModel, \
    Pokemon as PokemonModel, \
    UserPokemonAssociation as UserPokemonModel, \
    Nature as NatureModel

from ..graphql.objects import UserObject as User, \
    PokemonObject as Pokemon, \
    UserPokemonObject as UserPokemon, \
    NatureObject as Nature


class Query(graphene.ObjectType):
    node = relay.Node.Field()

    users = graphene.List(
        lambda: User, email=graphene.String(), user_id=graphene.Int())

    def resolve_users(self, info, email=None, user_name=None):
        query = User.get_query(info)

        if email:
            query = query.filter(UserModel.email == email)
        if user_name:
            query = query.filter(UserModel.user_name == user_name)
        return query.all()

    all_users = SQLAlchemyConnectionField(User.connection)

    pokemons = graphene.List(
        lambda: Pokemon, name=graphene.String(), pokemon_id=graphene.Int()
    )

    def resolve_pokemons(self, info, name=None, pokemon_id=None):
        query = Pokemon.get_query(info)

        if name:
            query = query.filter(PokemonModel.name == name)
        if pokemon_id:
            query = query.filter(PokemonModel.pokemon_id == pokemon_id)
        return query.all()

    user_pokemons = graphene.List(lambda: UserPokemon, user_id=graphene.String(
        required=True), order_by=graphene.String())

    def resolve_user_pokemons(self, info, user_id, order_by=None):
        type_name, original_id = from_global_id(user_id)
        query = UserPokemon.get_query(info)
        if original_id:
            query = query.filter_by(user_id=original_id)

        user_pokemons = query.all()

        if order_by is not None:
            user_pokemons = sorted(
                user_pokemons, key=lambda p: p.pokemons.pokemon_id)
        return user_pokemons
    
    natures = graphene.List(
        lambda: Nature, name=graphene.String(), increased_stat=graphene.String(), decreased_stat = graphene.String()
    )
    
    def resolve_natures(self, info):
        return NatureModel.query.all()
