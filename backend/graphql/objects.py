import graphene
from graphene import relay
from graphene_sqlalchemy import SQLAlchemyObjectType

from ..models import User as UserModel, \
    Pokemon as PokemonModel, \
    UserPokemonAssociation as UserPokemonModel


class UserObject(SQLAlchemyObjectType):
    class Meta:
        model = UserModel
        interfaces = (relay.Node, )


class PokemonObject(SQLAlchemyObjectType):
    class Meta:
        model = PokemonModel
        interfaces = (relay.Node, )

class UserPokemonObject(SQLAlchemyObjectType):
    class Meta:
        model = UserPokemonModel
        interfaces = (relay.Node, )
