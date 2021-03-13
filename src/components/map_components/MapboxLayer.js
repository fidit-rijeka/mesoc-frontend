import Leaflet from "leaflet";
import {} from "mapbox-gl-leaflet";
import PropTypes from "prop-types";
import { GridLayer, withLeaflet } from "react-leaflet";

class MapBoxGLLayer extends GridLayer {
  createLeafletElement(props) {
    Leaflet.marker([45.3271, 14.4422])
    return Leaflet.mapboxGL(props);
  }
}

Leaflet.marker([45.3271, 14.4422])



/*
 * Props are the options supported by Mapbox Map object
 * Find options here:https://www.mapbox.com/mapbox-gl-js/api/#new-mapboxgl-map-options-
 */
MapBoxGLLayer.propTypes = {
  accessToken: PropTypes.string.isRequired,
  style: PropTypes.string
};

MapBoxGLLayer.defaultProps = {
  style: "mapbox://styles/smartincic/ckkfuwd2n03zz17oa5aska2m8"
};

export default withLeaflet(MapBoxGLLayer);
