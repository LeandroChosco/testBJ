import React, { Component } from 'react';
import Draggable from 'react-draggable'; 
import { Card, Button } from 'semantic-ui-react';
import MapContainer from '../MapContainer';
import CameraStream from '../CameraStream';
import constants from '../../constants/constants';
class ModalCall extends Component {
    state = {
        map:null
    }

    render() {
        const { data } = this.props
        const coords ={lat: parseFloat(data.google_cordenate.split(',')[0]), lng: parseFloat(data.google_cordenate.split(',')[1])}
        console.log(coords)
        if (this.props.modal)            
            return (
                <Draggable
                    defaultPosition={{x: 150, y: 150}}
                >

                    <Card className="callholder">
                        <Card.Header>
                            <Button
                                icon="close"
                                onClick={this.props.hideModal}
                            />
                        </Card.Header>
                        <Card.Content>
                            <div className="row" style={{paddingBottom:20}}>
                                <div className="rowCallInfo">
                                    <MapContainer                 
                                        options={{
                                            center: coords,
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
                                        }}
                                        onMapLoad={this._onMapLoad} /> 
                                </div>
                                <div className="rowCallInfo">
                                    <CameraStream hideTitle marker={{title:'',extraData:{num_cam:data.num_cam,cameraID:data.id,webSocket:constants.webSocket+':'+data.port_output_streaming}}}/>
                                </div>
                            </div>
                            <div className="row textContainer">
                                <div style={{fontSize:'2.5vh'}} className="col-6"><b>Nombre: </b>{data.user_nicename}</div>
                                <div style={{fontSize:'2.5vh'}} className="col-3"><b>Telefono: </b>{data.phone}</div>
                                <div style={{fontSize:'2.5vh'}} className="col-3"><b>Celular: </b>{data.cellphone}</div>
                            </div>
                            <div className="row textContainer">
                                <div style={{fontSize:'2.5vh'}} className="col">
                                    <b>Dirección: </b>{data.street} {data.number}, {data.town}, {data.township}, {data.state}
                                </div>
                            </div>
                        </Card.Content>
                    </Card>
                    
                </Draggable>
            );
        return null
  }

  _onMapLoad = map => {    
    const { data } = this.props
    const coords ={lat: parseFloat(data.google_cordenate.split(',')[0]), lng: parseFloat(data.google_cordenate.split(',')[1])}    
    this.setState({map:map})        
    new window.google.maps.Marker({
        position: coords,
        map: map,
        title: data.user_nicename,
        animation: window.google.maps.Animation.BOUNCE,        
    });    
}

    componentDidMount(){
        document.getElementsByClassName("fullcontainerLayer")[0].classList.add('overlayed')
        console.log(this.props)
    }
    
    componentWillUnmount(){
        document.getElementsByClassName("fullcontainerLayer")[0].classList.remove('overlayed')
    }

}

export default ModalCall;