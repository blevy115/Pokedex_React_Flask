import React from "react";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import { v4 as uuidv4 } from "uuid";

import {
  formatName,
  formatZMoveName,
  formatGameName,
} from "../../helpers/format";
import { getTypeId } from "../../helpers/getTypeId";
import { getSprite, getItemSprite } from "../../helpers/pictures";
import { handleSpriteError, handleItemError } from "../../helpers/error";
import { isZMove, getZMoveData } from "../../helpers/zMoveHelper";

import { Types } from "../";

const SpriteComponent = ({ value }) => {
  const navigate = useNavigate();
  return (
    <img
      className="pokemon-list-item-sprite clickable"
      onError={handleSpriteError}
      src={getSprite(value)}
      onClick={() => navigate(`/pokemon/${value}`)}
    />
  );
};
const PokemonNameComponent = ({ value, row }) => {
  const navigate = useNavigate();
  return (
    <p
      className="move-list-item-name clickable"
      onClick={() => navigate(`/pokemon/${row.original.spriteId}`)}
    >
      {formatName(value)}
    </p>
  );
};

const PreEvolvedPokemonNameComponent = ({ value, row }) => {
  const navigate = useNavigate();
  return (
    <p
      className="move-list-item-name clickable"
      onClick={() => navigate(`/pokemon/${row.original.preEvolvedSpriteId}`)}
    >
      {formatName(value)}
    </p>
  );
};

const EvolvedPokemonNameComponent = ({ value, row }) => {
  const navigate = useNavigate();
  return (
    <p
      className="move-list-item-name clickable"
      onClick={() => navigate(`/pokemon/${row.original.evolvedSpriteId}`)}
    >
      {formatName(value)}
    </p>
  );
};

const MoveNameTooltipComponent = ({ value, row }) => {
  const navigate = useNavigate();
  const popupText = row.original.popupText;
  const tooltipId = uuidv4();
  return (
    <div className="clickable" data-tip data-tooltip-id={tooltipId}>
      <p className="moves-list-name">{formatName(value)}</p>
      <Tooltip
        id={tooltipId}
        effect="solid"
        arrowColor="#fff"
        className="tooltip-box"
        clickable
        openOnClick
        opacity={1}
      >
        {popupText}
        <button
          className="popup-button"
          onClick={() => navigate(`/moves/${row.original.moveId}`)}
        >
          More Info
        </button>
      </Tooltip>
    </div>
  );
};
const MoveNameComponent = ({ value, row }) => {
  const navigate = useNavigate();
  return (
    <div
      className="clickable"
      onClick={() => navigate(`/moves/${row.original.moveId}`)}
    >
      <p>{formatName(formatZMoveName(value))}</p>
    </div>
  );
};

const MoveComponent = ({ value }) => {
  const navigate = useNavigate();
  return (
    <p className="clickable" onClick={() => navigate(`/moves/${value.id}`)}>
      {formatName(value.name)}
    </p>
  );
};

const ItemComponent = ({ value }) => {
  const navigate = useNavigate();
  return (
    <div
      className="z-move-table-item-container clickable"
      onClick={() => navigate(`/items/${value.id}`)}
    >
      <p>{formatName(value.name)}</p>
      <img
        src={getItemSprite(`${value.name}--bag`)}
        onError={handleItemError}
      />
    </div>
  );
};

const TypesImageComponent = ({ value, row }) => {
  return <Types types={value} pageId={row.original.pageId} />;
};

const TypeImageComponent = ({ value }) => {
  const navigate = useNavigate();
  return (
    <img
      className="table-image clickable"
      src={`/icons/types/${value}.png`}
      alt={`${value} icon`}
      onClick={() => navigate(`/types/${getTypeId(value)}`)}
    />
  );
};

const KindImageComponent = ({ value }) => {
  return (
    <img
      className="table-image"
      src={`/icons/kinds/${value}.png`}
      alt={`${value} icon`}
    />
  );
};

const KindsImageComponent = ({ value, row }) => {
  return isZMove(row.original.moveId) &&
    !getZMoveData(row.original.moveId)["pokemon"] ? (
    <div className="z-move-types-container">
      <img src="/icons/kinds/physical.png" alt="physical icon" />
      <img src="/icons/kinds/special.png" alt="special icon" />
    </div>
  ) : (
    <img
      className="table-image"
      src={`/icons/kinds/${value}.png`}
      alt={`${value} icon`}
    />
  );
};

const AbilitiesComponent = ({ value, row }) => {
  const navigate = useNavigate();
  return (
    <p
      className={
        value.id === row.original.pageId
          ? "text-bold"
          : value.id
          ? "clickable"
          : ""
      }
      onClick={() => {
        if (value.id && value.id !== row.original.pageId) {
          navigate(`/abilities/${value.id}`);
        }
      }}
    >
      {formatName(value.name)}
    </p>
  );
};

const LevelComponent = ({ value }) => {
  return (
    <div>
      {value.map((val, i) => (
        <p key={i}>
          {formatGameName(val.pokemon_v2_versiongroup.name)} Level: {val.level}
        </p>
      ))}
    </div>
  );
};

export {
  SpriteComponent,
  PokemonNameComponent,
  MoveNameComponent,
  MoveNameTooltipComponent,
  MoveComponent,
  ItemComponent,
  TypeImageComponent,
  TypesImageComponent,
  KindImageComponent,
  KindsImageComponent,
  AbilitiesComponent,
  LevelComponent,
  PreEvolvedPokemonNameComponent,
  EvolvedPokemonNameComponent,
};
