import React, { Component } from 'react';
import MapContainer from '../../components/MapContainer'
import CameraStream  from '../../components/CameraStream'
import { render } from 'react-dom';

import '../../assets/styles/util.css';
import '../../assets/styles/main.css';
import '../../assets/fonts/iconic/css/material-design-iconic-font.min.css'
import './style.css'

const mapOptions= {
    center: {lat: 19.459430, lng: -99.208588},
    zoom: 15,
    mapTypeId: 'roadmap',
    zoomControl: false,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false
}

class Map extends Component {

    state = {
        places : [
            {
                name:'Carrilo Puerto , 413 ,Tacuba Miguel Hidalgo CDMX', 
                lat:19.452546, 
                lng:-99.187447,
                id:1,
                webSocket:'ws://18.222.106.238:1001'
            },
            {
                name:'Rio Napo, 46, Argentina Poniente Miguel Hidalgo CDMX', 
                lat:19.459430, 
                lng:-99.208588,
                id:2,
                webSocket:'ws://18.222.106.238:1002'
            },
            {
                name:'Río Juruá ,45, Argenttina Poniente Miguel Hidalgo CDMX', 
                lat:19.4600672, 
                lng:-99.2117091,
                id:3,
                webSocket:'ws://18.222.106.238:1003'
            },

            {
                name:'Mexico ,Tacuba, 1 ,Argenttina Poniente / Nueva Argentina Miguel Hidalgo CDMX', 
                lat:19.456858, 
                lng:-99.205938,
                id:4,
                webSocket:'ws://18.222.106.238:1004'
            },
            {
                name:'Calzada Santa Barbara Naucalapn ,210, Argenttina Poniente Miguel Hidalgo CDMX', 
                lat:19.4601350, 
                lng:-99.2082958,
                id:5,
                webSocket:'ws://18.222.106.238:1005'
            },
            {
                name:'Río Tlacotalpan ,89 ,Argenttina Poniente Miguel Hidalgo CDMX', 
                lat:19.457746, 
                lng:-99.208690,
                id:6,
                webSocket:'ws://18.222.106.238:1006'
            },

            {
                name:'Río Juruá  ,13, Argenttina Poniente Miguel Hidalgo CDMX', 
                lat:19.459800, 
                lng:-99.208318,
                id:7,
                webSocket:'ws://18.222.106.238:1007'
            },
            {
                name:'Rio Napo, 42 ,Argenttina Poniente Miguel Hidalgo CDMX', 
                lat:19.459396, 
                lng:-99.208482,
                id:8,
                webSocket:'ws://18.222.106.238:1008'
            }
        ]
    }

  render() {
    return (
        <div className="map">
            <MapContainer                 
                options={mapOptions}
                places={this.state.places} 
                onMapLoad={this._onMapLoad} />
        </div>
    );
  }

    _onMapLoad = map => {
        const marker = []
        this.state.places.map((value,index)=>{
             marker[index]= new window.google.maps.Marker({
                position: { lat:value.lat, lng:value.lng },
                map: map,
                title: value.name,
                extraData:value
            });
            window.google.maps.event.addListener(marker[index],'click', (function(marker, map, createInfoWindow) {
                return function() {                  
                  createInfoWindow(marker,map)
                }
              })(marker[index], map,this.createInfoWindow))
            return true
        })
        
    }
    createInfoWindow = (e, map) => {        
        const infoWindow = new window.google.maps.InfoWindow({
            content: '<div id="infoWindow'+e.extraData.id+'" />',
            position: { lat: e.position.lat(), lng: e.position.lng() }
        })
        infoWindow.addListener('domready', (function(marker, render) {
            return function() {                  
                render(<CameraStream marker={marker} showButtons height={.75}/>, document.getElementById('infoWindow'+e.extraData.id))
            }
          })(e,render))
        infoWindow.open(map)
    }

  componentDidMount(){
      const navHeight = document.getElementsByTagName('nav')[0].scrollHeight
      const documentHeight = window.innerHeight
      let map = document.getElementsByClassName('map')[0]//.style.height = documentHeight - navHeight
      map.style.height  = documentHeight - navHeight + "px"   
      map.style.maxHeight  = documentHeight - navHeight + "px"      
  }
}

export default Map;