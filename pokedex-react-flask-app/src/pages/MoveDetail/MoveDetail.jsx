import React, { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";

import { pokemonAPIClient, backEndClient } from "../../api/clients";
import { GET_MOVE_INFO } from "../../api/queries/pokeapi";
import { MOVE_MUTATION } from "../../api/queries/backend";

import {
  Loading,
  StandardMoveDetail,
  ZMoveDetail,
  MaxMoveDetail,
  GMaxMoveDetail,
} from "../../components";

import "./MoveDetail.scss";
import { isZMove } from "../../helpers/getZMovePower";
import { isGmaxMove, isMaxMove } from "../../helpers/getMaxMoves";

const MoveDetail = () => {
  const params = useParams();

  const { data, loading } = useQuery(GET_MOVE_INFO, {
    variables: { id: parseInt(params.moveId) },
    client: pokemonAPIClient,
  });

  const [createOrGetMove] = useMutation(MOVE_MUTATION, {
    client: backEndClient,
  });
  // const isMaxMove = isMaxMove(params)
  const maxMove = useMemo(() => {
    return isMaxMove(params.moveId);
  }, [params.moveId]);

  const gmaxMove = isGmaxMove(params.moveId);

  const name = !loading
    ? gmaxMove
      ? gmaxMove.name
      : data.move[0].name
    : undefined;

  useEffect(() => {
    if (!loading && name) {
      createOrGetMove({
        variables: { move_id: params.moveId, name: name },
      });
    }
  }, [name, params.moveId, loading]);

  if (loading) return <Loading />;

  const isMoveZMove = isZMove(parseInt(params.moveId));

  const { type } = gmaxMove || data.move[0];

  return (
    <div className={`app__move ${type.name}-color-3`}>
      {isMoveZMove ? (
        <ZMoveDetail move={data.move[0]} />
      ) : (
        <StandardMoveDetail move={data.move[0]} />
      )}
    </div>
  );
};

export default MoveDetail;
