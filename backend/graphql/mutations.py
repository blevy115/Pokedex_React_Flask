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

    
# class ProfileMutation(graphene.Mutation):
#     class Arguments:
#         first_name = graphene.String(required=True)
#         last_name = graphene.String(required=True)
#         user_id = graphene.Int(required=True)
#         skills = graphene.List(SkillInput)

#     profile = graphene.Field(lambda: Profile)

#     def mutate(self, info, first_name, last_name, user_id, skills):
#         user = UserModel.query.get(user_id)

#         profile = ProfileModel(first_name=first_name, last_name=last_name)

#         skill_list = [SkillModel(name=input_skill.name) for input_skill in skills]

#         profile.skills.extend(skill_list)

#         db.session.add(profile)

#         user.profile=profile
#         db.session.commit()

#         return ProfileMutation(profile=profile)
    
class Mutation(graphene.ObjectType):
    mutate_user = UserMutation.Field()
    mutate_pokemon = PokemonMutation.Field()