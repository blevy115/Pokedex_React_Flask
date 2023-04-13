import graphene
from graphene import relay
from graphene_sqlalchemy import SQLAlchemyObjectType

from ..models import User as UserModel, \
    Pokemon as PokemonModel, \
    UserPokemonAssociation as UserPokemonModel, \
    Nature as NatureModel


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


class NatureObject(SQLAlchemyObjectType):
    class Meta:
        model = NatureModel
        interfaces = (relay.Node, )
