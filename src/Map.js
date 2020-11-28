import React from 'react';
import "./Map.css";
import { Map as LeafletMap, TileLayer } from "react-leaflet";
import { showDataOnMap } from './util';

function Map({countries,casesType,center,zoom}) {
  return (
    <div className="map">
      <LeafletMap center = {center} zoom = {zoom} >
        <TileLayer
          url="http://a.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMAp</a> contributors'
        />
        {showDataOnMap(countries,casesType)}
      </LeafletMap>
    </div>
  );
}

export default Map