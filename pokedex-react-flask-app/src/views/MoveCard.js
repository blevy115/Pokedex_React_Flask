import React from "react";
import { useParams } from "react-router-dom";


export default function MoveCard(){
    const params = useParams();
    return (
        <>{params.moveId}</>
    )
}