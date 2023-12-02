import graphene
from graphene import relay
from graphene_sqlalchemy import SQLAlchemyObjectType

from ..models import User as UserModel, \
    Pokemon as PokemonModel, \
    Move as MoveModel, \
    Ability as AbilityModel, \
    Item as ItemModel, \
    Location as LocationModel, \
    Team as TeamModel, \
    UserPokemonAssociation as UserPokemonModel, \
    TeamPokemonDetails as TeamPokemonModel, \
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

class TeamObject(SQLAlchemyObjectType):
    class Meta:
        model = TeamModel
        interfaces = (relay.Node, )        
    pokemons = graphene.List(lambda: TeamPokemonObject)

    def resolve_pokemons(self, info):
        return self.pokemons


class TeamPokemonObject(SQLAlchemyObjectType):
    class Meta:
        model = TeamPokemonModel
        interfaces = (relay.Node, )
    
    pokemon = graphene.Field(lambda: PokemonObject)

    def resolve_pokemon(self, info):
        return PokemonModel.query.get(self.pokemon_id)
    
    moves = graphene.List(lambda: MoveObject)

    def resolve_moves(self, info):
        move_ids = self.move_ids  # Assuming self.move_ids contains a list of move IDs
        moves = MoveModel.query.filter(MoveModel.id.in_(move_ids)).all()
        return moves
    
    ability = graphene.Field(lambda: AbilityObject)

    def resolve_ability(self, info):
        return AbilityModel.query.get(self.ability_id)
    
    item = graphene.Field(lambda: ItemObject)

    def resolve_item(self, info):
        return ItemModel.query.get(self.item_id)
