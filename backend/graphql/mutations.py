import graphene
from backend import db
from ..graphql.objects import UserObject as User, PokemonObject as Pokemon
from ..models import User as UserModel, Pokemon as PokemonModel

class UserMutation(graphene.Mutation):
    class Arguments:
        email = graphene.String(required=True)
        user_name =  graphene.String(required=True)
        password =  graphene.String(required=True)
    user = graphene.Field(lambda: User)

    def mutate(self, info, email, user_name, password):
        user = UserModel(email=email, user_name=user_name, password=password)

        db.session.add(user)
        db.session.commit()

        return UserMutation(user=user)
    
class PokemonMutation(graphene.Mutation):
    class Arguments:
        pokemon_id = graphene.Int()
        name = graphene.String(required=True)

    pokemon = graphene.Field(lambda: Pokemon)

    def mutate(self, info, pokemon_id, name):
        pokemon = PokemonModel(pokemon_id=pokemon_id, name=name)

        db.session.add(pokemon)
        db.session.commit()

        return PokemonMutation(pokemon=pokemon)
 
    
class Mutation(graphene.ObjectType):
    mutate_user = UserMutation.Field()
    mutate_pokemon = PokemonMutation.Field()