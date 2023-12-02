import graphene
from graphene import relay
from graphene_sqlalchemy import SQLAlchemyConnectionField
from graphql_relay import from_global_id

from ..models import User as UserModel, \
    Pokemon as PokemonModel, \
    Move as MoveModel, \
    Ability as AbilityModel, \
    Item as ItemModel, \
    Location as LocationModel, \
    UserPokemonAssociation as UserPokemonModel, \
    Nature as NatureModel, \
    Type as TypeModel, \
    EggGroup as EggGroupModel, \
    Team as TeamModel

from ..graphql.objects import UserObject as User, \
    PokemonObject as Pokemon, \
    MoveObject as Move, \
    AbilityObject as Ability, \
    ItemObject as Item, \
    LocationObject as Location, \
    UserPokemonObject as UserPokemon, \
    NatureObject as Nature, \
    TypeObject as Type, \
    EggGroupObject as EggGroup, \
    TeamObject as Team


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

    moves = graphene.List(
        lambda: Move, name=graphene.String(), move_id=graphene.Int()
    )

    def resolve_moves(self, info, name=None, move_id=None):
        query = Move.get_query(info)

        if name:
            query = query.filter(MoveModel.name == name)
        if move_id:
            query = query.filter(MoveModel.move_id == move_id)
        return query.all()

    abilities = graphene.List(
        lambda: Ability, name=graphene.String(), ability_id=graphene.Int()
    )

    def resolve_abilities(self, info, name=None, ability_id=None):
        query = Ability.get_query(info)

        if name:
            query = query.filter(AbilityModel.name == name)
        if ability_id:
            query = query.filter(AbilityModel.ability_id == ability_id)
        return query.all()

    items = graphene.List(
        lambda: Item, name=graphene.String(), item_id=graphene.Int()
    )

    def resolve_items(self, info, name=None, item_id=None):
        query = Item.get_query(info)

        if name:
            query = query.filter(ItemModel.name == name)
        if item_id:
            query = query.filter(ItemModel.item_id == item_id)
        return query.all()

    def resolve_locations(self, info, name=None, location_id=None):
        query = Location.get_query(info)

        if name:
            query = query.filter(LocationModel.name == name)
        if location_id:
            query = query.filter(LocationModel.location_id == location_id)
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

    user_pokemon_shiny_count = graphene.Field(lambda: UserPokemon, user_id=graphene.String(
        required=True), pokemon_id=graphene.Int(required=True))
    
    def resolve_user_teams(self, info, user_id, order_by=None):
        type_name, original_id = from_global_id(user_id)
        user = UserModel.query.filter_by(id=original_id).first()

        if user:
            return user.teams
        return []

    user_teams = graphene.List(lambda: Team, user_id=graphene.String(required=True))


    def resolve_user_pokemon_shiny_count(self, info, user_id, pokemon_id):
        type_name, original_id = from_global_id(user_id)
        pokemon_foreign_id = Pokemon.get_query(info).filter(
            PokemonModel.pokemon_id == pokemon_id).first().id
        query = UserPokemon.get_query(info).filter_by(
            user_id=original_id, pokemon_id=pokemon_foreign_id)

        shiny_count = query.first()
        return shiny_count

    natures = graphene.List(
        lambda: Nature, name=graphene.String(), increased_stat=graphene.String(), decreased_stat=graphene.String(), order_by=graphene.String()
    )

    def resolve_natures(self, info, order_by=None):
        natures = NatureModel.query.all()

        if order_by is not None:
            natures = sorted(
                natures, key=lambda n: n.name)
        return natures

    types = graphene.List(
        lambda: Type, name=graphene.String(), type_id=graphene.Int(), order_by=graphene.String()
    )

    def resolve_types(self, info, order_by=None):
        types = TypeModel.query.all()

        if order_by is not None:
            types = sorted(
                types, key=lambda n: n.type_id)
        return types

    egg_groups = graphene.List(
        lambda: EggGroup, name=graphene.String(), egg_group_id=graphene.Int(), order_by=graphene.String()
    )

    def resolve_egg_groups(self, info, order_by=None):
        egg_groups = EggGroupModel.query.all()

        if order_by is not None:
            egg_groups = sorted(
                egg_groups, key=lambda n: n.egg_group_id)
        return egg_groups
