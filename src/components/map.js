import React, { useEffect, useState } from 'react';
import Leaflet from 'leaflet';
import {} from 'mapbox-gl-leaflet';
import axios from 'axios';

import AnalysisLoader from './analysisLoader';

const Map = () => {

  const [mapLoaded, setMapLoaded] = useState(false);

  let mapContainer;

  useEffect(() => {
    // Values to tell leaftlet at what coordinates to set the map on initialzation
    const initialState = {
      lng: 11,
      lat: 49,
      zoom: 4
    };

    const map = Leaflet.map(mapContainer).setView([initialState.lat, initialState.lng], initialState.zoom);

    // using map provided from mapbox
    const gl = Leaflet.mapboxGL({
      style: process.env.REACT_APP_MAPBOX_STYLE,
      accessToken: process.env.REACT_APP_MAPBOX_ACCESS_TOKEN
    }).addTo(map);

    // Example of defining a custom marker icon
    
    // var leafletIcon = Leaflet.icon({
    //   iconUrl: 'https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png',
    //   iconSize: [48,50], // width and height
    //   iconAnchor: [22,32] // Leaflet renders marker from the top left corner of the image. Use these values to adjust image position
    // });

    axios
      .get('https://api.mesoc.dev/aggregates/heatmap')
      .then(res => {
        // TODO:
        // map through all markers and add them to the map
        
        setMapLoaded(true);
      })

    // Example marker (coordinates of rijeka)
    const mrk = Leaflet.marker([45.3271, 14.4422]).bindPopup(`<a href="https://www.mesoc-project.eu/">Example link</a>`).addTo(map);

  }, [mapContainer]);

  return (
    <React.Fragment>
      {/* {
        mapLoaded ?
          <div className="map-container" ref={el => mapContainer = el}></div> :
          <AnalysisLoader height={'600px'} />
      } */}
      {!mapLoaded && <p>locations are still loading...</p>}
      <div className="map-container" ref={el => mapContainer = el}></div>
    </React.Fragment>
  )
}

export default Map;