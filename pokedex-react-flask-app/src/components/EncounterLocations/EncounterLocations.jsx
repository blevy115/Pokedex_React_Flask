import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { mergePokemonEncounters } from "../../helpers/mergeEncounters";

import { modifyPokemonEncounters } from "../../helpers/modifyForTable";
import { Table } from "../";
import {
  GameComponent,
  LocationsComponent,
} from "../TableCellComponents/TableCellComponents";

const EncounterLocations = ({ encounters }) => {
  const encountersByGeneration = useMemo(
    () => mergePokemonEncounters(encounters),
    [encounters]
  );
  const generationOptions = useMemo(
    () => Object.keys(encountersByGeneration),
    [encountersByGeneration]
  );
  const [generation, setGeneration] = useState();

  useEffect(() => {
    if (generationOptions.length > 0) setGeneration(generationOptions[0]);
  }, [generationOptions]);

  if (
    !encountersByGeneration ||
    !generation ||
    !encountersByGeneration[generation]
  )
    return null;

  const { tableData, columns } = modifyPokemonEncounters({
    encounters: encountersByGeneration[generation],
    GameComponent,
    LocationsComponent,
  });

  return (
    <div className="app__pokemon-encounters">
      <h3 className="text-center">Locations</h3>
      <div className="select-input">
        <label htmlFor="EncounterGenerationSelector">Generation:</label>
        <select
          id="EncounterGenerationSelector"
          value={generation}
          onChange={(e) => setGeneration(parseInt(e.target.value))}
        >
          {generationOptions.map((type, i) => {
            return (
              <option key={i} value={type}>
                {type}
              </option>
            );
          })}
        </select>
      </div>
      <AnimatePresence>
        <motion.div
          key={JSON.stringify(tableData)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          // animate={{ y: [100, 50, 0], opacity: [0, 0, 1] }}
          exit={{ display: "none" }}
          transition={{ duration: 0.5 }}
          className="moves-table"
        >
          <Table
            data={tableData}
            columns={columns}
            hasFilterValue={false}
            hasSortBy={false}
            hasHeaders={false}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default EncounterLocations;
