import React, { Component } from 'react';
import { Image, Button } from 'semantic-ui-react';
import Geocode from "react-geocode";
import './style.css'
import MapContainer from '../../components/MapContainer/index.js';
import firebaseC5 from '../../constants/configC5';
import {  Navbar } from 'react-bootstrap';
import { saveAs } from 'file-saver';
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

let blob

 class DetailsComplaiment extends Component {
    state = {
        complaint:{},
        show:false,
        created:new Date()
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
                    <div className='col loader' style={{height:'100%', minHeight:'150px', maxHeight:'350px', position:'relative'}}>                                  
                        <div className='row downloadButton'>                    
                            <div className='col pull-right'>
                            {complaint.url!==undefined&&show?
                                <Button 
                                    onClick={this._saveFile}
                                    circular
                                    basic  
                                    icon="download"
                                />:
                                null
                            } 
                            </div>
                        </div> 
                        {complaint.url!==undefined&&show?complaint.url.includes('.jpg')?
                        <Image fluid rounded src={complaint.url} style={{maxHeight:'350px'}}/>:
                        <video style={{width:'100%', maxHeight:'350px'}} controls src={complaint.url}/>:null}
                    
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
        Geocode.setApiKey("AIzaSyDVdmSf9QE5KdHNDCSrXwXr3N7QnHaujtg");
        const response =await Geocode.fromLatLng(this.state.complaint.latitude, this.state.complaint.longitude)        
        const address = response.results[0].formatted_address;        
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

_saveFile = () => {
    saveAs(blob,this.state.complaint.url.split('/')[this.state.complaint.url.split('/').length - 1])
}

  _onMapLoad = (map) =>{    
    map.setCenter(new window.google.maps.LatLng(parseFloat(this.state.complaint.latitude), parseFloat(this.state.complaint.longitude)))
    new window.google.maps.Marker({
        position: { lat:parseFloat(this.state.complaint.latitude), lng:parseFloat(this.state.complaint.longitude) },
        map:  map,
        title: 'Denuncia anonima',        
    });
  }

  _getBlob = () => {
    const callback = (r) =>{
        blob = r.response
        //saveAs(r.response,r.responseURL.split('/')[r.responseURL.split('/').length - 1])                  
    }
    var http = new XMLHttpRequest();
    http.open('GET', this.state.complaint.url);
    http.responseType = 'blob';
    http.onreadystatechange = function() {
        if (this.readyState == this.DONE) {
            callback(this);
        }
    };
    http.send(); 
  }

  checkFileAviable = () => {

    const callback = (r) =>{
        if(r){
            this.setState({show:true})
            this._getBlob()
            return
        }        
        const diffTime = Math.abs(this.state.created.getTime() - new Date().getTime());
        const diffMinutes = Math.ceil(diffTime / (1000 * 60 )); 
        console.log(diffMinutes );        
        setTimeout(this.checkFileAviable,1000)
    }
    var http = new XMLHttpRequest();
    http.open('HEAD', this.state.complaint.url);
    http.onreadystatechange = function() {
        if (this.readyState == this.DONE) {
            callback(this.status != 404 && this.status !=0);
        }
    };
    http.send();    
  }

    componentDidMount(){        
        firebaseC5.app('c5virtual').firestore().collection('complaints').doc(this.props.match.params.id).onSnapshot(doc=>{            
            if(doc.exists){
                let value = doc.data()
                const created=new Date(value.dateTime.toDate())
                value.dateTime = new Date(value.dateTime.toDate()).toLocaleString()                        
                this.setState({complaint:value,created:created})               
                setTimeout(this.checkFileAviable,1000)
            }
        })
    }

    

}

export default DetailsComplaiment;