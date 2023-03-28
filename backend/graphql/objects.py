import graphene
from graphene import relay
from graphene_sqlalchemy import SQLAlchemyObjectType

from ..models import User as UserModel, \
    Pokemon as PokemonModel

class UserObject(SQLAlchemyObjectType):
    # user_id = graphene.Int(source='id')

    class Meta:
        model = UserModel
        interfaces = (relay.Node, )

class PokemonObject(SQLAlchemyObjectType):
    class Meta:
        model = PokemonModel
        interfaces = (relay.Node, ) 
