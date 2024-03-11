import React, { Component } from 'react';
import conections from '../../conections';
import './style.css';

export class MapContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      map: null
    };
  }

  componentDidMount() {
    if (!window.google) {
      var s = document.createElement('script');
      s.type = 'text/javascript';
      let key = 'AIzaSyCHiHNfeGxYKOZRj-57F957Xe08f64fLHo';
      if (process.env.NODE_ENV === 'production') {
        key = 'AIzaSyBz_MJT1pf14hIqVQ-Sy43pKby3hrhmmEo';
      }
      s.src = `https://maps.google.com/maps/api/js?key=${key}`;
      var x = document.getElementsByTagName('script')[0];
      x.parentNode.insertBefore(s, x);
      // Below is important.
      //We cannot access google.maps until it's finished loading
      s.addEventListener('load', (e) => {
        this.onScriptLoad();
      });
    } else {
      this.onScriptLoad();
    }
  }
  componentDidUpdate(prevProps) {
    const { coordsPath: prevCoordsPath } = prevProps;
    const { coordsPath, onMapLoad } = this.props;
    const { map } = this.state;
    if (prevCoordsPath !== coordsPath) {
      if (this.state.map) {
        const coords = coordsPath.map((item) => ({ lat: item.latitude, lng: item.longitude }));
        const flightPath = new window.google.maps.Polyline({
          path: coords,
          geodesic: true,
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 2
        });
        flightPath.setMap(map);
        onMapLoad(map);
      }
    }
  }
  componentWillUnmount() {
    const { markersUnmount } = this.props;
    if (markersUnmount) {
      const markers = Object.keys(markersUnmount);
      markers.forEach((m) => {
        if (this.props.markersUnmount[m]) this.props.markersUnmount[m].setMap(null);
        this.props.markersUnmount[m] = null;
      });
    }
  }

  render() {
    return <div style={{ width: '100%', height: '100%' }} ref='mapDiv' />;
  }

  onScriptLoad = () => {
    const map = new window.google.maps.Map(this.refs.mapDiv, this.props.options);

    conections.getLimitsCam().then((res) => {
      //console.log('limits', res)
      var dataLimit = res.data.data;
      if (res.status === 200) {
        if (res.data.success) {
          // console.log('data',dataLimit)
          if (this.props.coordsPath && this.props.coordsPath.length > 0) {
            const coords = this.props.coordsPath.map((item) => ({ lat: item.latitude, lng: item.longitude }));
            const flightPath = new window.google.maps.Polyline({
              path: coords,
              geodesic: true,
              strokeColor: '#FF0000',
              strokeOpacity: 1.0,
              strokeWeight: 2
            });
            flightPath.setMap(map);
          }

          dataLimit.forEach((data) => {
            var polygonCoord = data.coordenadas_limites;
            // Construct the polygon.
            var polygon = new window.google.maps.Polygon({
              paths: polygonCoord,
              strokeColor: data.color,
              strokeOpacity: 0.8,
              strokeWeight: 1,
              fillColor: data.color,
              fillOpacity: 0.35
            });
            polygon.setMap(map);
            var infoWindow = new window.google.maps.InfoWindow();
            polygon.addListener('click', function(event) {
              var contentString = data.nombre;

              // Replace the info window's content and position.
              infoWindow.setContent(contentString);
              infoWindow.setPosition(event.latLng);

              infoWindow.open(map);
            });
          });
        }
      }
    });

    this.props.onMapLoad(map);
    this.setState({ map });
  };
}

// function showArrays(event) {
//   var contentString = 'Content here';

//   // Replace the info window's content and position.
//   infoWindow.setContent(contentString);
//   infoWindow.setPosition(event.latLng);

//   infoWindow.open(map);
// }

export default MapContainer;
