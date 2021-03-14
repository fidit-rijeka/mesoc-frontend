import React, { useEffect, useState } from 'react';
import Leaflet from 'leaflet';
import axios from 'axios';
import { Map, Marker, Popup } from "react-leaflet";

import MapboxLayer from "./map_components/MapboxLayer";

import m_blue from '../assets/images/map/markers/blue.png';
import m_red from '../assets/images/map/markers/red.png';
import m_purple from '../assets/images/map/markers/purple.png';
import m_shadow from '../assets/images/map/markers/shadow.png';

const MapView = () => {

  const [zoom, setZoom] = useState(4);
  const [position, setPosition] = useState([54.5260, 15.2551]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    axios
      .get('https://api.mesoc.dev/aggregates/location/')
      .then(res => {
        setCities(res.data);
      })
  }, []);

  var blueIcon = Leaflet.icon({
    iconUrl: m_blue,
    shadowUrl: m_shadow,

    iconSize:     [25, 41], // size of the icon
    shadowSize:   [43, 25], // size of the shadow
    iconAnchor:   [13, 40], // point of the icon which will correspond to marker's location
    shadowAnchor: [5, 25],  // the same for the shadow
    popupAnchor:  [0, -40] // point from which the popup should open relative to the iconAnchor
  });

  var redIcon = Leaflet.icon({
    iconUrl: m_red,
    shadowUrl: m_shadow,

    iconSize:     [25, 41],
    shadowSize:   [43, 25],
    iconAnchor:   [13, 40],
    shadowAnchor: [5, 25],
    popupAnchor:  [0, -40]
  });

  var purpleIcon = Leaflet.icon({
    iconUrl: m_purple,
    shadowUrl: m_shadow,
    
    iconSize:     [25, 41],
    shadowSize:   [43, 25],
    iconAnchor:   [13, 40],
    shadowAnchor: [5, 25], 
    popupAnchor:  [0, -40]
  });

  console.log(cities)

  return (
    <div>
      <Map className="map-container" center={position} zoom={zoom}>
        <MapboxLayer
          accessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
          style={process.env.REACT_APP_MAPBOX_STYLE}
        />

        {cities && cities.map(city => {
          var cityIcon
          if (city.num_pilot !== 0 && city.num_scientific === 0) {
            cityIcon = redIcon
          } else if (city.num_pilot === 0 && city.num_scientific !== 0) {
            cityIcon = blueIcon
          } else {
            cityIcon = purpleIcon
          }

          return <Marker position={[city.latitude, city.longitude]} icon={cityIcon}>
            <Popup>
            <p class="mapPopupTitle">{city.city}, {city.country}</p>
            {city.num_pilot !== 0 ? <>Pilot papers: {city.num_pilot}<br /><a href="/location/{city.latitude}-{city.longitude}">Examine pilot papers</a></> : ''}
            <br /><br />
            {city.num_scientific !== 0 ? <>Scientific papers: {city.num_scientific}<br /><a href="/location/{city.latitude}-{city.longitude}">Examine scientific papers</a></> : ''}
            
            </Popup>
          </Marker>
        })}
        
      </Map>
    </div>
  );

}

export default MapView;