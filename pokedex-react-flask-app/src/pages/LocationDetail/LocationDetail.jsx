import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";

import locations_evolutions from "../../data/locations_evolutions.json";

import { pokemonAPIClient, backEndClient } from "../../api/clients";
import { GET_LOCATION_INFO } from "../../api/queries/pokeapi";
import { LOCATION_MUTATION } from "../../api/queries/backend";

import { formatName } from "../../helpers/format";
import { mergeLocationEncounters } from "../../helpers/mergeEncounters";

import {
  Loading,
  LocationEncounters,
  LocationEvolutions,
} from "../../components";

import "./LocationDetail.scss";

const LocationDetail = () => {
  const params = useParams();

  const { data, loading } = useQuery(GET_LOCATION_INFO, {
    variables: { id: parseInt(params.locationId) },
    client: pokemonAPIClient,
  });

  const [createOrGetLocation] = useMutation(LOCATION_MUTATION, {
    client: backEndClient,
  });

  const name = !loading ? data.location[0].name : undefined;

  useEffect(() => {
    if (!loading && name) {
      createOrGetLocation({
        variables: { location_id: params.locationId, name: name },
      });
    }
  }, [name, params.locationId, loading]);

  if (loading) return <Loading />;

  const {
    pokemon_v2_region: region,
    pokemon_v2_locationareas: locationAreas,
    evolutions,
  } = data.location[0];

  const locationEvolutions = locations_evolutions[params.locationId]
    ? [...evolutions, ...locations_evolutions[params.locationId]]
    : evolutions;

  return (
    <div className="app__location-details">
      <div className="app__location-details-info">
        <div className="app__location-details-info-header">
          <h3>{formatName(name)}</h3>
        </div>
        {region && <p>{`Region: ${formatName(region.name)}`}</p>}
      </div>
      {locationEvolutions.length > 0 && (
        <LocationEvolutions evolutions={locationEvolutions} />
      )}
      <LocationEncounters encounters={mergeLocationEncounters(locationAreas)} />
    </div>
  );
};

export default LocationDetail;
