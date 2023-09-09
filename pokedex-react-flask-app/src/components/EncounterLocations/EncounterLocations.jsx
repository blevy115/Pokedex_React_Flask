import React from 'react'
import { mergePokemonEncounters } from '../../helpers/mergeEncounters';

const EncounterLocations = ({encounters}) => {
  console.log(mergePokemonEncounters(encounters));

  return (
    <div>EncounterLocations</div>
  )
}

export default EncounterLocations