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
    TeamPokemon as TeamPokemonModel, \
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
        sorted_pokemons = sorted(self.pokemons, key=lambda pokemon: pokemon.position)
        return sorted_pokemons


class TeamPokemonObject(SQLAlchemyObjectType):
    class Meta:
        model = TeamPokemonModel
        interfaces = (relay.Node, )
    
    pokemon = graphene.Field(lambda: PokemonObject)

    def resolve_pokemon(self, info):
        if self.pokemon_id:
            return PokemonModel.query.get(self.pokemon_id)
        return None
    
    moves = graphene.List(lambda: MoveObjectWithPosition)

    def resolve_moves(self, info):
        resolved_moves = []

        for i in range(1, 5):
            move_id = getattr(self, f"move{i}_id")
            if move_id is not None:
                move = MoveModel.query.get(move_id)
                if move:
                    resolved_moves.append(MoveObjectWithPosition(position=i, move=move))
                else:
                    resolved_moves.append({"position": i, "move": None})
            else:
                resolved_moves.append({"position": i, "move": None})

        return resolved_moves
    
    ability = graphene.Field(lambda: AbilityObject)

    def resolve_ability(self, info):
        if self.ability_id:
            return AbilityModel.query.get(self.ability_id)
        return None
    
    item = graphene.Field(lambda: ItemObject)

    def resolve_item(self, info):
        if self.item_id:
            return ItemModel.query.get(self.item_id)
        return None

    nature = graphene.Field(lambda: NatureObject)

    def resolve_nature(self, info):
        if self.nature_id:
            return NatureModel.query.get(self.nature_id)
        return None
    
    tera_type = graphene.Field(lambda: TypeObject)

    def resolve_tera_type(self, info):
        if self.tera_type_id:
            return TypeModel.query.get(self.tera_type_id)
        return None


class MoveObjectWithPosition(graphene.ObjectType):
    position = graphene.Int()
    move = graphene.Field(lambda: MoveObject)