import React, { useEffect, useState } from 'react';
import Leaflet from 'leaflet';
import {} from 'mapbox-gl-leaflet';
import axios from 'axios';

import m_blue from '../assets/images/map/markers/blue.png';
import m_red from '../assets/images/map/markers/red.png';
import m_purple from '../assets/images/map/markers/purple.png';
import m_shadow from '../assets/images/map/markers/shadow.png';

//import AnalysisLoader from './analysisLoader';

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

      iconSize:     [25, 41], // size of the icon
      shadowSize:   [43, 25], // size of the shadow
      iconAnchor:   [13, 40], // point of the icon which will correspond to marker's location
      shadowAnchor: [5, 25],  // the same for the shadow
      popupAnchor:  [0, -40] // point from which the popup should open relative to the iconAnchor
    });

    var purpleIcon = Leaflet.icon({
      iconUrl: m_purple,
      shadowUrl: m_shadow,
      
      iconSize:     [25, 41], // size of the icon
      shadowSize:   [43, 25], // size of the shadow
      iconAnchor:   [13, 40], // point of the icon which will correspond to marker's location
      shadowAnchor: [5, 25],  // the same for the shadow
      popupAnchor:  [0, -40] // point from which the popup should open relative to the iconAnchor
    });

    const map = Leaflet.map(mapContainer).setView([initialState.lat, initialState.lng], initialState.zoom);

    // using map provided from mapbox
    const gl = Leaflet.mapboxGL({
      style: process.env.REACT_APP_MAPBOX_STYLE,
      accessToken: process.env.REACT_APP_MAPBOX_ACCESS_TOKEN
    }).addTo(map);

    axios
      .get('https://api.mesoc.dev/aggregates/location/')
      .then(res => {

        // Simulating pilot cities and mixed citites
        // (at the time of testing there were none, so I'm adding them to test my code)
        // NOTE => marker coloring works, if required, uncomment the fake data (fake markers are near Rijeka, Croatia)
        
        // Purple marker fake data
        /*
        res.data.push({
          city: "test1",
          country: "wda",
          latitude: "45.3271",
          longitude: "14.4422",
          num_pilot: 2,
          num_scientific: 5
        });
        */

        /*
        // Red marker test data
        res.data.push({
          city: "test1",
          country: "wda",
          latitude: "45.4",
          longitude: "14.8",
          num_pilot: 2,
          num_scientific: 0
        });
        */

        console.log(res.data);

        // Looping through data and setting markers on map
        // TODO: Is mapping this data inside axios function a bad practice?
        res.data.map(markerData => {

          // Checking the numbers and types of studies and choosing a marker icon accordingly
          if (markerData.num_pilot == 0 ) {
            // Only scientific papers (blue marker)
            var markerIcn = blueIcon;
          } else if (markerData.num_scientific == 0) {
            // Only pilot papers (red marker)
            var markerIcn = redIcon;
          } else {
            // both pilot and scientific num is > 0, then it's mixed marker (purple) (other options exist under "assets" folder)
            var markerIcn = purpleIcon;
          }

          Leaflet.marker([markerData.latitude, markerData.longitude], {icon: markerIcn}).bindPopup(`
            <p class="mapPopupTitle">${markerData.city}, ${markerData.country}</p>
            ${markerData.num_pilot !== 0 ? `<p>Pilot case studies: ${markerData.num_pilot}</p><a href="/location/${markerData.latitude}-${markerData.longitude}">Examine pilot studies</a>` : ''}
            ${markerData.num_scientific !== 0 ? `<p>Scientific case studies: ${markerData.num_scientific}</p><a href="/location/${markerData.latitude}-${markerData.longitude}">Examine scientific studies</a>` : ''}
          `).addTo(map);
        })
        
        setMapLoaded(true);
      })
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