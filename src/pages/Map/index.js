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
    fullscreenControl: false,
    map: null,    
}

class Map extends Component {

    state = {
        places : [
        ],
        webSocket:'ws://18.222.106.238'
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
        
        this.setState({map:map})        
        const marker = []
        this.state.places.map((value,index)=>{
             marker[index]= new window.google.maps.Marker({
                position: { lat:value.lat, lng:value.lng },
                map: map | this.state.map,
                title: value.name,
                extraData:value
            });
            window.google.maps.event.addListener(marker[index],'click', (function(marker, map, createInfoWindow) {
                return function() {                  
                  createInfoWindow(marker,map)
                }
              })(marker[index], map | this.state.map,this.createInfoWindow))
            return true
        })
        
    }
    createInfoWindow = (e, map) => {   
        console.log(map)     
        const infoWindow = new window.google.maps.InfoWindow({
            content: '<div id="infoWindow'+e.extraData.id+'" class="windowpopinfo"/>',
            position: { lat: e.position.lat(), lng: e.position.lng() }
        })
        console.log(e)
        infoWindow.addListener('domready', (function(marker, render) {
            return function() {                  
                render(<CameraStream marker={marker} showButtons height={.75}/>, document.getElementById('infoWindow'+e.extraData.id))
            }
          })(e,render))
        infoWindow.open(map)
    }

    componentDidMount(){
        fetch('http://18.222.106.238:3000/register-cams/all-cams')
        .then((response) => {
            return response.json();
        })
        .then((camaras) => {
            let auxCamaras = []
            camaras.map(value=>{
                if (value.active === 1) {
                    auxCamaras.push({
                        id:value.id,
                        num_cam:value.num_cam,
                        lat:parseFloat(value.google_cordenate.split(',')[0]), 
                        lng:parseFloat(value.google_cordenate.split(',')[1]),                            
                        webSocket:this.state.webSocket + ':' +(value.num_cam>=10?'10':'100') + value.num_cam,
                        name: value.street +' '+ value.number + ', ' + value.township+ ', ' + value.town+ ', ' + value.state
                    })
                }
            })
            console.log(auxCamaras);
            this.setState({places:auxCamaras})
            const marker = []
            this.state.places.map((value,index)=>{
                marker[index]= new window.google.maps.Marker({
                    position: { lat:value.lat, lng:value.lng },
                    map:  this.state.map,
                    title: value.name,
                    extraData:value
                });
                window.google.maps.event.addListener(marker[index],'click', (function(marker, map, createInfoWindow) {
                    return function() {                  
                    createInfoWindow(marker,map)
                    }
                })(marker[index], this.state.map,this.createInfoWindow))
                return true
            })
        });
      const navHeight = document.getElementsByTagName('nav')[0].scrollHeight
      const documentHeight = window.innerHeight
      let map = document.getElementsByClassName('map')[0]//.style.height = documentHeight - navHeight
      map.style.height  = documentHeight - navHeight + "px"   
      map.style.maxHeight  = documentHeight - navHeight + "px"      
  }
}

export default Map;