import graphene
from graphene import relay
from graphene_sqlalchemy import SQLAlchemyConnectionField 

from ..models import User as UserModel, \
    Pokemon as PokemonModel, \
    UserPokemonAssociation as UserPokemonModel

from ..graphql.objects import UserObject as User, \
    PokemonObject as Pokemon \
    
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
    
    def resolve_user_pokemons(self, info, user_id):
        query = Pokemon.get_query(info)
        user = UserModel.query.get(user_id)
        return query.join(UserPokemonModel).filter_by(user=user).all()
