import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";

import { GET_EGG_GROUPS } from "../../api/queries/backend";
import { backEndClient } from "../../api/clients";

import { formatName } from "../../helpers/format";

import { Loading } from "../../components";

import "./EggGroupList.scss";

const EggGroupList = () => {
  const navigate = useNavigate();
  const { data, loading } = useQuery(GET_EGG_GROUPS, {
    client: backEndClient,
  });

  if (loading) return <Loading />;
  return (
    <div className="app__egg-group-list">
      <div className="app__egg-group-list-container">
        {data.eggGroups.map((eggGroup) => (
          <div
            className="app__egg-group-list-item"
            key={eggGroup.eggGroupId}
            onClick={() => navigate(`/egg-groups/${eggGroup.eggGroupId}`)}
          >
            <p className="text-bold">{formatName(eggGroup.name)}</p>
            <img
              src={`/icons/egg-groups/${eggGroup.name}.png`}
              alt={`${eggGroup.name} symbol`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default EggGroupList;
