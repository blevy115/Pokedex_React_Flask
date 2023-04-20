import React from "react";
import { useParams } from "react-router-dom";
import NavBar from "../components/NavBar";

export default function MoveCard() {
  const params = useParams();

//   const { data, loading } = useQuery(GET_POKEMON_INFO, {
//     variables: { id: parseInt(params.pokemonId) },
//     client: pokemonAPIClient,
//   });
//   const { data: pokemonExistsData, loading: pokemonDataLoading } = useQuery(
//     CHECK_POKEMON_EXISTS,
//     {
//       variables: { pokemon_id: parseInt(params.pokemonId) },
//       client: backEndClient,
//     }
//   );

//   const [createPokemon] = useMutation(POKEMON_MUTATION, {
//     client: backEndClient,
//     refetchQueries: [
//       {
//         query: CHECK_POKEMON_EXISTS,
//         variables: { pokemon_id: parseInt(params.pokemonId) },
//       },
//     ],
//   });

//   const name = !loading ? data.pokemon_details[0].name : undefined;

//   useEffect(() => {
//     if (
//       !loading &&
//       name &&
//       !pokemonDataLoading &&
//       pokemonExistsData.pokemons.length === 0
//     ) {
//       createPokemon({
//         variables: { pokemon_id: params.pokemonId, name: name },
//       });
//     }
//   }, [name, params.pokemonId, loading, pokemonDataLoading, pokemonExistsData]);

//   if (loading) return <p>Loading...</p>;
//   const { types, info, stats, abilities, form } = data.pokemon_details[0];

  return (
    <div>
      <NavBar />
      <p>{params.moveId}</p>
    </div>
  );
}
