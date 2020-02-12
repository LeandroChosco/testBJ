import React, { Component } from "react";

import "./style.css";

export class MapContainer extends Component {
  onScriptLoad = () => {
    const map = new window.google.maps.Map(
      this.refs.mapDiv,
      this.props.options
    );
    this.props.onMapLoad(map);
  };

  componentDidMount() {
    if (!window.google) {
      var s = document.createElement("script");
      s.type = "text/javascript";
      let key = "AIzaSyCHiHNfeGxYKOZRj-57F957Xe08f64fLHo";
      if (process.env.NODE_ENV === "production") {
        key = "AIzaSyDVdmSf9QE5KdHNDCSrXwXr3N7QnHaujtg";
      }
      s.src = `https://maps.google.com/maps/api/js?key=${key}`;
      var x = document.getElementsByTagName("script")[0];
      x.parentNode.insertBefore(s, x);
      // Below is important.
      //We cannot access google.maps until it's finished loading
      s.addEventListener("load", e => {
        this.onScriptLoad();
      });
    } else {
      this.onScriptLoad();
    }
  }

  render() {
    return <div style={{ width: "100%", height: "100%" }} ref="mapDiv" />;
  }
}

export default MapContainer;
