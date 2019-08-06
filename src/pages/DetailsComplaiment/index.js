import React, { Component } from 'react';
import {  Accordion, Icon, Button, Image } from 'semantic-ui-react';
import Geocode from "react-geocode";
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
        complaint:{},
        show:false
    } 

  render() {
     const {complaint, show} = this.state
     if (complaint) {
         if (complaint.position ==='') {
            this._getAddress()
         }
         if (complaint.longitude ===undefined || complaint.latitude ===undefined) {
            this._getCoords()
         }
     }
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
                        {complaint.latitude!==undefined&&complaint.longitude!==undefined?<MapContainer
                            options={mapOptions}
                            onMapLoad={this._onMapLoad} />:null}
                    </div>
                    <div className='col loader' style={{height:'100%', minHeight:'150px', maxHeight:'400px'}}>                                  
                        {complaint.url!==undefined&&show?complaint.url.includes('.jpg')?
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

  _getAddress = async() => {
      try {
          console.log('load adrres')
        Geocode.setApiKey("AIzaSyDVdmSf9QE5KdHNDCSrXwXr3N7QnHaujtg");
        const response =await Geocode.fromLatLng(this.state.complaint.latitude, this.state.complaint.longitude)        
        const address = response.results[0].formatted_address;
        console.log(address);
        let complaint = this.state.complaint
        complaint.position=address
        this.setState({complaint:complaint})
        return address
      } catch (error) {
          console.warn('addres error',error)
      }    
  }
  _getCoords = async() => {
    try {
        console.log('load adrres')
      Geocode.setApiKey("AIzaSyDVdmSf9QE5KdHNDCSrXwXr3N7QnHaujtg");
      const response =await Geocode.fromAddress( this.state.complaint.position)        
      const { lat, lng } = response.results[0].geometry.location;
      
      let complaint = this.state.complaint
      complaint.longitude=lng
      complaint.latitude=lat
      this.setState({complaint:complaint})
      
    } catch (error) {
        console.warn('addres error',error)
    }    
}

  _onMapLoad = (map) =>{    
    map.setCenter(new window.google.maps.LatLng(parseFloat(this.state.complaint.latitude), parseFloat(this.state.complaint.longitude)))
    new window.google.maps.Marker({
        position: { lat:parseFloat(this.state.complaint.latitude), lng:parseFloat(this.state.complaint.longitude) },
        map:  map,
        title: 'Denuncia anonima',        
    });
  }

  checkFileAviable = () => {
    fetch(this.state.complaint.url)
    .then(res=>{
        console.log(res)
        this.setState({show:true})
    })
    .catch(err=>{
        console.log(err)
        setTimeout(this.checkFileAviable,1000)
    })
  }

    componentDidMount(){
        console.log(this.props.match.params.id)
        firebaseC5.app('c5virtual').firestore().collection('complaints').doc(this.props.match.params.id).onSnapshot(doc=>{            
            if(doc.exists){
                let value = doc.data()
                value.dateTime = new Date(value.dateTime.toDate()).toLocaleString()
                console.log(value)             
                this.setState({complaint:value})               
                setTimeout(this.checkFileAviable,100)
            }
        })
    }

    

}

export default DetailsComplaiment;