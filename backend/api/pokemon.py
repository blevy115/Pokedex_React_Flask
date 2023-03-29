from flask import Blueprint, request, render_template
from flask_login import login_required, current_user
from backend.models import Pokemon
from .. import db

pokemon = Blueprint('pokemon', __name__)

# @pokemon.route('/pokemon/<pokemon_id>', methods=['POST'])


@pokemon.route('/pokemon', methods=['POST'])
@login_required
# def pokemon_post(pokemon_id):
def pokemon_post():
    pokemon_id = request.form.get('pokemon_id', None)
    pokemon = Pokemon.query.filter_by(pokemon_id=pokemon_id).first()
    # pokemon_name = request.args.get('pokemon-name', None)
    pokemon_name = request.form.get('name', None)

    if not pokemon and pokemon_name:
        pokemon = Pokemon(pokemon_id=pokemon_id, name=pokemon_name)
        db.session.add(pokemon)
    if pokemon not in current_user.pokemons:
        current_user.pokemons.append(pokemon)
    db.session.commit()

    return render_template('profile.html', name=current_user.name)
