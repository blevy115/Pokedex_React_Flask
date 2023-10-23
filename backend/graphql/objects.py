import graphene
from graphene import relay
from graphene_sqlalchemy import SQLAlchemyObjectType

from ..models import User as UserModel, \
    Pokemon as PokemonModel, \
    Move as MoveModel, \
    Ability as AbilityModel, \
    Item as ItemModel, \
    Location as LocationModel, \
    UserPokemonAssociation as UserPokemonModel, \
    Nature as NatureModel, \
    Type as TypeModel, \
    EggGroup as EggGroupModel


class UserObject(SQLAlchemyObjectType):
    class Meta:
        model = UserModel
        interfaces = (relay.Node, )


class PokemonObject(SQLAlchemyObjectType):
    class Meta:
        model = PokemonModel
        interfaces = (relay.Node, )


class MoveObject(SQLAlchemyObjectType):
    class Meta:
        model = MoveModel
        interfaces = (relay.Node,)


class AbilityObject(SQLAlchemyObjectType):
    class Meta:
        model = AbilityModel
        interfaces = (relay.Node,)


class ItemObject(SQLAlchemyObjectType):
    class Meta:
        model = ItemModel
        interfaces = (relay.Node,)


class LocationObject(SQLAlchemyObjectType):
    class Meta:
        model = LocationModel
        interfaces = (relay.Node,)


class UserPokemonObject(SQLAlchemyObjectType):
    class Meta:
        model = UserPokemonModel
        interfaces = (relay.Node, )


class NatureObject(SQLAlchemyObjectType):
    class Meta:
        model = NatureModel
        interfaces = (relay.Node, )


class TypeObject(SQLAlchemyObjectType):
    class Meta:
        model = TypeModel
        interfaces = (relay.Node, )


class EggGroupObject(SQLAlchemyObjectType):
    class Meta:
        model = EggGroupModel
        interfaces = (relay.Node, )
