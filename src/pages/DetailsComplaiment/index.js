import React, { Component } from 'react';
import {  Accordion, Icon, Button, Image } from 'semantic-ui-react';

import './style.css'
import MapContainer from '../../components/MapContainer/index.js';
import firebaseC5 from '../../constants/configC5';
import {  Navbar } from 'react-bootstrap';
import personData from '../../constants/personData';
const mapOptions= {
    center: {lat: 19.459430, lng: -99.208588},
    zoom: 15,
    mapTypeId: 'roadmap',
    zoomControl: false,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    openConfirm: false,
    typeConfirm:false,
    openSelection:false,
    checked:''
}

 class DetailsComplaiment extends Component {
    state = {
        complaint:{}
    } 

  render() {
     const {complaint} = this.state
    return (
        <div>   
            <Navbar sticky="top" expand="lg" variant="light" bg="mh">                       
                <Navbar.Text style={{
                    fontWeight:'bold',
                    color:'white'
                }}>
                  Nueva Denuncia anonima
                </Navbar.Text>                
            </Navbar>                            
            <div  className="card">                                
                <div className='row' style={{height:'100%'}}>                                        
                    <div className='col'>                             
                        {complaint.latitude!==undefined?<MapContainer
                            options={mapOptions}
                            onMapLoad={this._onMapLoad} />:null}
                    </div>
                    <div className='col' style={{height:'100%', minHeight:'150px'}}>                                  
                        {complaint.url!==undefined?complaint.url.includes('.jpg')?
                        <Image fluid rounded src={complaint.url}/>:
                        <video style={{width:'100%'}} controls src={complaint.url}/>:null}
                    
                    </div>
                </div>                
                <div  className="row">
                    &nbsp;
                </div>  
                <div className='row' style={{height:'100%'}}>                    
                    <div className='col'>     
                        <b>Ubicación: </b> {complaint.position}
                    </div>                                       
                </div>     
                <div className='row'>
                    <div className='col'>
                        <b>Fecha y hora: </b> {complaint.dateTime}
                    </div>
                    <div className='col'>
                        <b>Contacto: </b> {complaint.contact}
                    </div>
                </div>
                <div className='row'>                    
                    <div className='col'>
                        <b>Descripción: </b> {complaint.description}
                    </div>
                </div> 
            </div>                         
        </div>
    
    );
  }

  _onMapLoad = (map) =>{    
    map.setCenter(new window.google.maps.LatLng(parseFloat(this.state.complaint.latitude), parseFloat(this.state.complaint.longitude)))
    new window.google.maps.Marker({
        position: { lat:parseFloat(this.state.complaint.latitude), lng:parseFloat(this.state.complaint.longitude) },
        map:  map,
        title: 'Denuncia anonima',        
    });
  }

    componentDidMount(){
        console.log(this.props.match.params.id)
        firebaseC5.app('c5virtual').firestore().collection('complaints').doc(this.props.match.params.id).onSnapshot(doc=>{            
            if(doc.exists){
                let value = doc.data()
                value.dateTime = new Date(value.dateTime.toDate()).toLocaleString()
                console.log(value) 
                this.setState({complaint:value})               
            }
        })
    }

    

}

export default DetailsComplaiment;