import React, { Component } from 'react';
import {  Accordion, Icon, Button } from 'semantic-ui-react';

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

 class DetailsEmergency extends Component {
    state = {
        places : [],    
        images: [{},{}],
        idCamera:Math.floor(Math.random() * 10) + 1,
        match:{},
        activeIndex: 0
    }
    handleClick = (e, titleProps) => {
        const { index } = titleProps
        const { activeIndex } = this.state
        const newIndex = activeIndex === index ? -1 : index
    
        this.setState({ activeIndex: newIndex })
    }

  render() {
     const {activeIndex} = this.state
    return (
        <div  className="app-container" >   
            <Navbar sticky="top" expand="lg" variant="light" bg="mh">                       
                <Navbar.Text >
                   Reporte de emergencia por {this.state.match.userInfo?this.state.match.userInfo.Person.name+' '+this.state.match.userInfo.Person.surname+' '+this.state.match.userInfo.Person.lastname:null}
                </Navbar.Text>                
            </Navbar>     
            <div  className="mapContainerForDetail" >    
                <MapContainer                 
                    options={mapOptions}
                    places={this.state.places} 
                    onMapLoad={this._onMapLoad} />            
            </div>
            <div  className="row">
                &nbsp;
            </div>	
            
            <div  className="card">
                <Accordion>
                    {
                        personData.data.map((value,index)=>{
                            if (!this.state.match.userInfo) {
                                return null
                            }
                            if (!this.state.match.userInfo[value.index]) {
                                return null
                            }
                            return (
                                <React.Fragment key={index}>
                                <Accordion.Title active={activeIndex === index} index={index} onClick={this.handleClick}>
                                    <Icon name='dropdown' />
                                    {value.title}
                                </Accordion.Title>
                                <Accordion.Content active={activeIndex === index}  style={{overflowY:'auto', overflowX:'hidden', height:'100%'}}>
                                    <div align='center'>
                                        <div className="row">
                                            {value.params.map((ref,i)=>{
                                                return(<div key={i} className="col-6">
                                                    <div className="row">
                                                        <div className='col-6'>
                                                            <b>{ref.name}: </b>
                                                        </div>
                                                        <div className='col-6'>
                                                            {   typeof ref.index === 'string'?
                                                                    this.state.match.userInfo[value.index][ref.index]:
                                                                    typeof ref.index === 'object'?
                                                                        ref.index.map(obj=>{return(this.state.match.userInfo[value.index][obj] + ref.concat)} ):
                                                                        null}                                                            
                                                        </div>
                                                    </div>
                                                </div>)
                                            })}
                                        </div>
                                    </div>
                                </Accordion.Content>
                                </React.Fragment>
                            )
                        })
                    }  
                    {
                        this.state.match.userInfo?this.state.match.userInfo.Emergency?
                            <React.Fragment>
                                <Accordion.Title active={activeIndex === personData.data.length} index={personData.data.length} onClick={this.handleClick}>
                                    <Icon name='dropdown' />
                                    Contactos de emergencia
                                </Accordion.Title>
                                <Accordion.Content active={activeIndex === personData.data.length}  style={{overflowY:'auto', overflowX:'hidden', height:'100%'}}>
                                    <div align='center'>                                        
                                            {this.state.match.userInfo.Emergency.map((ref,i)=>{
                                                return(
                                                    <div key={i} className="row">
                                                        <div className='col-4'>
                                                            <b>Nombre:  </b>{ref.name}
                                                        </div>
                                                        <div className='col-4'>
                                                            <b>Telefono:  </b>{ref.phone}                                                      
                                                        </div>    
                                                        <div className='col-4'>
                                                            <b>Parentesco:  </b>{ref.whois}                                                      
                                                        </div>                                                    
                                                    </div>
                                                )
                                            })}                                        
                                    </div>
                                </Accordion.Content>
                            </React.Fragment>
                        :null:null
                    }                  
                </Accordion>                            
                
            </div>
            <div  className="row">
                &nbsp;
            </div>  
            <div>
                {this.state.match.userInfo?this.state.match.status===0?<Button onClick={this.giveHelp}>Brindar apoyo</Button>:null:null}
            </div> 
            <div className='row'>
                <div className="col" style={{margin: 'auto'}} >
                    <Button color="red"class="ui button">
                    <Icon name='taxi' />Mandar unidad
                    </Button>
                </div> 
            </div>        
        </div>
    
    );
  }

  giveHelp = () => {    
    firebaseC5.app('c5virtual').firestore().collection('help').doc(this.props.match.params.id).update({
        "status":2,
        "operator":this.props.userInfo.user_nicename
    })
  }



  _onMapLoad = map => {
      this.setState({map:map})  
      if(this.state.match.title){
        new window.google.maps.Polyline({
            path: this.state.match.route,
            map: this.state.map,
            title: this.state.match.title,                
        });
      }              
  }

    componentDidMount(){
        console.log(this.props.match.params.id)
        firebaseC5.app('c5virtual').firestore().collection('help').doc(this.props.match.params.id).onSnapshot(doc=>{            
            if(doc.exists){
                let value = doc.data()
                value.dateTime = new Date(value.dateTime.toDate()).toLocaleString()
                value.userInfo.Person.birthday = new Date(value.userInfo.Person.birthday.toDate()).toLocaleDateString()                                
                if (this.state.map) {
                    new window.google.maps.Polyline({
                        path: JSON.parse(JSON.stringify(value.route).replace(/latitude/g,'lat').replace(/longitude/g,'lng')),
                        map: this.state.map,
                        title: value.title,                
                    });
                    this.state.map.setCenter({
                        lat:value.route[ value.route.length - 1 ].latitude,
                        lng:value.route[ value.route.length - 1 ].longitude
                    })
                }
                firebaseC5.app('c5virtual').firestore().collection('users').doc(value.user_creation).get().then(userDoc=>{
                    console.log(userDoc)
                    if (userDoc.exists) {
                        let userInfo = userDoc.data()
                        console.log(userInfo)
                        userInfo.Person.birthday = new Date(userInfo.Person.birthday.toDate()).toLocaleDateString()                                                    
                        value.userInfo= userInfo
                        this.setState({match:value})                        
                    }
                })
            }
        })
    }

    

}

export default DetailsEmergency;