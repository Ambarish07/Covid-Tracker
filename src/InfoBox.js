import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import "./InfoBox.css";

function InfoBox({ title, cases,isRed, isActive,active,isRecovered, total, ...props }) {
  
  return (
    <Card onClick={props.onClick} className={`infoBox ${active && 'infoBox-selected'}  ${isRed && 'infoBox-red'}  ${isActive && 'infoBox-activeCases'} ${isRecovered && "infoBox-green"} `}>
      <CardContent>
        <Typography color="textSecondary">{title} </Typography>
        <h2 className={`infoBox_cases ${!isRed && "infoBox-green"} ${isActive && "infoBox-activeCases" } `}>{cases}</h2>
        <Typography className="infoBox_total" color="textSecondary">
          {total} Total
        </Typography>
      </CardContent>
    </Card>
  );
}

export default InfoBox;
