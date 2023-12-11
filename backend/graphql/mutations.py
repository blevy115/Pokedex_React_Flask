import graphene
from backend import db
from flask import session
from ..models import User as UserModel, \
    Pokemon as PokemonModel, \
    Move as MoveModel, \
    Ability as AbilityModel, \
    Item as ItemModel, \
    Location as LocationModel, \
    UserPokemonAssociation as UserPokemonModel, \
    Nature as NatureModel, \
    Type as TypeModel, \
    Team as TeamModel, \
    TeamPokemonDetails as TeamPokemonModel

from ..graphql.objects import UserObject as User, \
    PokemonObject as Pokemon, \
    MoveObject as Move, \
    AbilityObject as Ability, \
    ItemObject as Item, \
    LocationObject as Location, \
    UserPokemonObject as UserPokemon, \
    NatureObject as Nature, \
    TypeObject as Type, \
    TeamObject as Team, \
    TeamPokemonObject as TeamPokemon

from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import current_user, login_user, logout_user
from graphql import GraphQLError
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
            if not user:
                raise GraphQLError("No user found with this email")
            elif not check_password_hash(user.password, password):
                raise GraphQLError("Incorrect password")
            else:
                raise GraphQLError("Login failed for an unknown reason")


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
        try:
            new_user = UserModel(email=email, name=name, password=generate_password_hash(
                password, method='sha256'))

            db.session.add(new_user)
            db.session.commit()

            return SignupMutation(user=new_user, token="success")

        except Exception as e:
            db.session.rollback()
            raise GraphQLError(str(e.orig.diag.message_detail))


class PokemonMutation(graphene.Mutation):
    class Arguments:
        pokemon_id = graphene.Int()
        name = graphene.String(required=True)

    pokemon = graphene.Field(lambda: Pokemon)

    def mutate(self, info, pokemon_id, name):

        existing_pokemon = PokemonModel.query.filter(
            PokemonModel.name == name and PokemonModel.pokemon_id == pokemon_id).first()

        if existing_pokemon:
            return PokemonMutation(pokemon=existing_pokemon)

        pokemon = PokemonModel(pokemon_id=pokemon_id, name=name)

        db.session.add(pokemon)
        db.session.commit()

        return PokemonMutation(pokemon=pokemon)


class MoveMutation(graphene.Mutation):
    class Arguments:
        move_id = graphene.Int()
        name = graphene.String(required=True)

    move = graphene.Field(lambda: Move)

    def mutate(self, info, move_id, name):
        move = MoveModel(move_id=move_id, name=name)

        existing_move = MoveModel.query.filter(
            MoveModel.name == name and MoveModel.move_id == move_id).first()

        if existing_move:
            return MoveMutation(move=existing_move)

        db.session.add(move)
        db.session.commit()

        return MoveMutation(move=move)


class AbilityMutation(graphene.Mutation):
    class Arguments:
        ability_id = graphene.Int()
        name = graphene.String(required=True)

    ability = graphene.Field(lambda: Ability)

    def mutate(self, info, ability_id, name):
        ability = AbilityModel(ability_id=ability_id, name=name)

        existing_ability = AbilityModel.query.filter(
            AbilityModel.name == name and AbilityModel.ability_id == ability_id).first()

        if existing_ability:
            return AbilityMutation(ability=existing_ability)

        db.session.add(ability)
        db.session.commit()

        return AbilityMutation(ability=ability)


class ItemMutation(graphene.Mutation):
    class Arguments:
        item_id = graphene.Int()
        name = graphene.String(required=True)

    item = graphene.Field(lambda: Item)

    def mutate(self, info, item_id, name):
        item = ItemModel(item_id=item_id, name=name)

        existing_item = ItemModel.query.filter(
            ItemModel.name == name and ItemModel.item_id == item_id).first()

        if existing_item:
            return ItemMutation(item=existing_item)

        db.session.add(item)
        db.session.commit()

        return ItemMutation(item=item)


class LocationMutation(graphene.Mutation):
    class Arguments:
        location_id = graphene.Int()
        name = graphene.String(required=True)

    location = graphene.Field(lambda: Location)

    def mutate(self, info, location_id, name):
        location = LocationModel(location_id=location_id, name=name)

        existing_location = LocationModel.query.filter(
            LocationModel.name == name and LocationModel.location_id == location_id).first()

        if existing_location:
            return LocationMutation(location=existing_location)

        db.session.add(location)
        db.session.commit()

        return LocationMutation(location=location)
    
class PokemonInput(graphene.InputObjectType):
    id = graphene.Int(required=True)
    name = graphene.String(required=True)

class MoveInput(graphene.InputObjectType):
    position = graphene.Int(required=True)
    id = graphene.Int(required=True)
    name = graphene.String(required=True)

class AbilityInput(graphene.InputObjectType):
    id = graphene.Int(required=True)
    name = graphene.String(required=True)

class ItemInput(graphene.InputObjectType):
    id = graphene.Int(required=True)
    name = graphene.String(required=True)

class TeamPokemonInput(graphene.InputObjectType):
    pokemon = graphene.Field(PokemonInput, required=True)
    moves = graphene.List(MoveInput)
    ability = graphene.Field(AbilityInput)
    item = graphene.Field(ItemInput)
    position = graphene.Int(required=True)
    
class TeamMutation(graphene.Mutation):
    class Arguments:
        user_id = graphene.String()
        team_id = graphene.Int()
        name = graphene.String(required=True)
        pokemons = graphene.List(TeamPokemonInput, required=True)

    team = graphene.Field(lambda: Team)

    @staticmethod
    def mutate(self, info, user_id, name, pokemons, team_id=None):
        type_name, original_id = from_global_id(user_id)
        user = UserModel.query.filter_by(id=original_id).first()  # Simulating UserModel
        if user:
            if team_id:
                team = TeamModel.query.filter_by(id=team_id, user_id=user.id).first()

                if team:
                 # Check if the user_id matches the original_id before making changes
                    if team.user_id == user.id:
                        team.name = name
                        TeamPokemonModel.query.filter_by(team_id=team.id).delete()
                        db.session.commit()

                        # Add new team pokemons
                        for pokemon_details in pokemons:

                            pokemon_data = pokemon_details.get('pokemon')
                            pokemon = PokemonModel.query.filter_by(pokemon_id=pokemon_data.id).first()
                            
                            if not pokemon:
                                new_pokemon = PokemonModel(
                                    pokemon_id=pokemon_data.id,
                                    name=pokemon_data.name 
                                )
                                db.session.add(new_pokemon)
                                db.session.commit()
                                pokemon = new_pokemon

                            ability_data = pokemon_details.get('ability')
                            if ability_data:
                                ability = AbilityModel.query.filter_by(ability_id=ability_data.id).first()

                                if not ability:
                                    new_ability = AbilityModel(
                                        ability_id=ability_data.id,
                                        name=ability_data.name
                                    )
                                    db.session.add(new_ability)
                                    db.session.commit()
                                    ability = new_ability
                                ability_id = ability.id
                            else:
                                ability_id = None

                            item_data = pokemon_details.get('item')
                            if item_data:
                                item =  ItemModel.query.filter_by(item_id=item_data.id).first()

                                if not item:
                                    new_item = ItemModel(
                                        item_id=item_data.id,
                                        name=item_data.name
                                    )
                                    db.session.add(new_item)
                                    db.session.commit()
                                    item = new_item
                                item_id = item.id
                            else:
                                item_id = None
 
                            moves_data = pokemon_details.get('moves')
                            move1_id = None
                            move2_id = None
                            move3_id = None
                            move4_id = None

                            for move_data in moves_data:
                                if move_data:
                                    move_id = move_data.get('id')
                                    move_name = move_data.get('name')
                                    move_position = move_data.get('position')

                                    # Assuming your MoveModel has move_id as the field representing the move's ID
                                    move = MoveModel.query.filter_by(move_id=move_id).first()
                                    
                                    if not move:
                                        new_move = MoveModel(
                                            move_id=move_id,
                                            name=move_name
                                        )
                                        db.session.add(new_move)
                                        db.session.commit()
                                        move = new_move

                                    if move_position == 1:
                                        move1_id = move.id
                                    elif move_position == 2:
                                        move2_id = move.id
                                    elif move_position == 3:
                                        move3_id = move.id
                                    elif move_position == 4:
                                        move4_id = move.id

                            new_pokemon = TeamPokemonModel(
                                team_id=team.id,
                                pokemon_id=pokemon.id,
                                move1_id=move1_id,
                                move2_id=move2_id,
                                move3_id=move3_id,
                                move4_id=move4_id,
                                ability_id=ability_id,
                                item_id=item_id,
                                position=pokemon_details.get('position')
                            )
                            db.session.add(new_pokemon)

                        db.session.commit()
                        return TeamMutation(team=team)
                    else:
                        raise Exception("You don't have permission to modify this team.")
                else:
                    raise Exception("Team not found.")
            else:
        # Create a new team since team_id is not provided
                new_team = TeamModel(user_id=user.id, name=name)
                db.session.add(new_team)
                db.session.flush()

                # Create team's Pokemon details
                for pokemon_details in pokemons:
                    ability_id = pokemon_details.get('ability_id')
                    pokemon_id = pokemon_details.get('pokemon_id')
                    move_ids = pokemon_details.get('move_ids')
                    item_id = pokemon_details.get('item_id')

                    ability = AbilityModel.query.filter_by(ability_id=ability_id).first()
                    pokemon = PokemonModel.query.filter_by(pokemon_id=pokemon_id).first()
                    item =  ItemModel.query.filter_by(item_id=item_id).first()
                    moves = MoveModel.query.filter(MoveModel.move_id.in_(move_ids)).all()

                    # Retrieve Moves using the provided move IDs
                    new_pokemon = TeamPokemonModel(
                        team_id=team.id,
                        pokemon_id=pokemon.id,
                        move_ids=[move.id for move in moves],
                        ability_id=ability.id,
                        item_id=item.id,  # Replace with your logic for item_id
                        position=pokemon_details.get('position')
                    )
                    db.session.add(new_pokemon)

                db.session.commit()
                return TeamMutation(team=new_team)
        else:
            raise Exception("User not found.")

        # # Create a new team
        # type_name, original_id = from_global_id(user_id)
        # new_team = TeamModel(user_id=user_id, name=name)
        # db.session.add(new_team)
        # db.session.flush()

        # # Create team's Pokemon details
        # for pokemon_details in pokemons:
        #     new_pokemon = TeamPokemonModel(
        #         team_id=new_team.id,
        #         pokemon_id=pokemon_details.get('pokemon_id'),
        #         move_ids=pokemon_details.get('move_ids'),
        #         ability_id=pokemon_details.get('ability_id'),
        #         item_id=pokemon_details.get('item_id'),
        #         position=pokemon_details.get('position')
        #     )
        #     db.session.add(new_pokemon)

        # db.session.commit()
        # return TeamMutation(team=new_team)


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
    mutate_item = ItemMutation.Field()
    mutate_pokemon = PokemonMutation.Field()
    mutate_move = MoveMutation.Field()
    mutate_ability = AbilityMutation.Field()
    mutate_location = LocationMutation.Field()
    mutate_user_pokemon = UserPokemonMutation.Field()
    mutate_team = TeamMutation.Field()
    login = LoginMutation.Field()
    logout = LogoutMutation.Field()
    mutate_shiny_counter = ShinyCounterMutation.Field()
