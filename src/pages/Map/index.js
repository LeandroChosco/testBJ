import React, { Component } from 'react';
import MapContainer from '../../components/MapContainer'
import CameraStream  from '../../components/CameraStream'
import { render } from 'react-dom';
import { JellyfishSpinner } from "react-spinners-kit";
import '../../assets/styles/util.css';
import '../../assets/styles/main.css';
import '../../assets/fonts/iconic/css/material-design-iconic-font.min.css'
import './style.css'
import constants from '../../constants/constants';
import conections from '../../conections';

const mapOptions= {
    center: {lat: 19.459430, lng: -99.208588},
    zoom: 15,
    mapTypeId: 'roadmap',
    zoomControl: false,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    map: null,
    loading: false
}

class Map extends Component {

    state = {
        places : [
        ],
        webSocket:'ws://18.222.106.238',
        moduleActions:{},
        markers:[]
    }

  render() {
    return (
        <div className="map">
         <div style={{position:'absolute',top:'30%', background:'transparent', width:'100%'}} align='center'>
         <JellyfishSpinner
                size={250}
                color="#686769"
                loading={this.state.loading}
            />
         </div>
            <MapContainer
                options={mapOptions}
                places={this.state.places}
                onMapLoad={this._onMapLoad} />
        </div>
    );
  }

    _onMapLoad = map => {
        this.setState({map:map})        
        this._loadCams()

    }
    createInfoWindow = (e, map) => {
        console.log(map)
        const infoWindow = new window.google.maps.InfoWindow({
            content: '<div id="infoWindow'+e.extraData.id+'" class="windowpopinfo"/>',
            position: { lat: e.position.lat(), lng: e.position.lng() }
        })
        console.log(e)
        infoWindow.addListener('domready', (function(marker, render,moduleActions) {
            return function() {
                render(<CameraStream moduleActions={moduleActions} marker={marker} showButtons height={.65} showExternal/>, document.getElementById('infoWindow'+e.extraData.id))
            }
          })(e,render, this.state.moduleActions))
        infoWindow.open(map)        
    }



    componentDidMount(){
        const isValid = this.props.canAccess(1)
        if (!isValid) {
            this.props.history.push('/welcome')
        }
        try{
            this.setState({moduleActions:JSON.parse(isValid.UserToModules[0].actions)})
        } catch (e){
            console.log(e)
        }
        
      const navHeight = document.getElementsByTagName('nav')[0].scrollHeight
      const documentHeight = window.innerHeight
      let map = document.getElementsByClassName('map')[0]//.style.height = documentHeight - navHeight      
      map.style.height  = documentHeight - navHeight + "px"
      map.style.maxHeight  = documentHeight - navHeight + "px"
      window.addEventListener('resize', this._resizeMap);
      window.addEventListener('restartCamEvent', this._loadCameras, false)
    }

    componentWillUnmount(){
        window.removeEventListener('restartCamEvent', this._loadCameras, false)        
    }

    _loadCams = () => {
        this.setState({loading:true})
        for (let index = 0; index < this.state.markers.length; index++) {
            const element = this.state.markers[index];
            element.setMap(null)
        }
        conections.getAllCams().then((data) => {
            const camaras = data.data
            let auxCamaras = []
            camaras.map(value=>{
                if (value.active === 1&& value.flag_streaming === 1) {
                    auxCamaras.push({
                        id:value.id,
                        num_cam:value.num_cam,
                        lat:parseFloat(value.google_cordenate.split(',')[0]), 
                        lng:parseFloat(value.google_cordenate.split(',')[1]),                            
                        webSocket: 'ws://' + value.UrlStreamToCameras[0].Url.dns_ip + ':' + value.port_output_streaming,
                        //webSocket:constants.webSocket + ':' +constants.webSocketPort+(value.num_cam>=10?'':'0') + value.num_cam,
                        name: value.street +' '+ value.number + ', ' + value.township+ ', ' + value.town+ ', ' + value.state
                    })
                }
                return true
            })
            this.setState({loading:false,places:auxCamaras})
            let marker = []
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
                return value
            })
            this.setState({markers:marker})
        });
    } 

    _resizeMap = () => {
        let navHeight;
        if(document.getElementsByTagName('nav')[0]){navHeight = document.getElementsByTagName('nav')[0].scrollHeight}
        const documentHeight = window.innerHeight
        let map = document.getElementsByClassName('map')[0]//.style.height = documentHeight - navHeight
        if (map) {
            map.style.height  = documentHeight - navHeight + "px"
            map.style.maxHeight  = documentHeight - navHeight + "px"
        }
  }
}

export default Map;
