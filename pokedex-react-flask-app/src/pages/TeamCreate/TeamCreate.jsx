import React from 'react';
import { useMutation } from "@apollo/client";

import { backEndClient } from "../../api/clients";
import { USER_TEAM_MUTATION } from "../../api/queries/backend";

const testData =  {
      user_id: 1,
      name: 'Team Name',
      pokemons: [
        {
          pokemonId: 1,
          moveIds: [1, 2, 3],
          abilityId: 4,
          itemId: 5,
          position: 1
        },
        {
            pokemonId: 2,
            moveIds: [4, 5, 6],
            abilityId: 7,
            itemId: 7,
            position: 2
          },
      ]
    }
  
const TeamCreate = () => {


    const [createOrGetPokemon] = useMutation(USER_TEAM_MUTATION, {
        client: backEndClient,
      });

  return (
    <>
    <div>TeamCreate</div>
    <button onClick={() => createOrGetPokemon({variables: testData})}>
        Hello
    </button>
    </>
  )
}

export default TeamCreate