import React, { Component } from 'react';
import CameraStream from '../CameraStream';
import { Row,Col} from 'react-bootstrap'
import {  Button, Image } from 'semantic-ui-react'
import responseJson from '../../assets/json/suspects.json'
import './style.css'
import Match from '../Match';
class GridCameraDisplay extends Component {
    
    state = {
        markers : [],
        height:'auto',
        fullHeight:10,
        isplaying:[],
        slideIndex:0,
        matches:[],
        photos:[1,2,3,4,5,6,7,8],
        videos:[1,2,3,4,5,6,7,8,9,0],
        autoplay: true,
        selectedCamera:{}
    }

  render() {
    return (
    <div className='gridCameraContainer'>   
        <Row >     
            {this.state.markers.map(value => <Col className='p-l-0 p-r-0'  lg={4} sm={6}   key={value.extraData.id} onClick = {() => this._openCameraInfo(value)} marker={value.id}><CameraStream key={value.extraData.id} marker={value} height={.7}/></Col>)}        
        </Row>
        <div className={!this.state.autoplay?'camGridControl showfiles':'camGridControl'}>
            <div className='row stiky-top'>
                <div className='col-4'>
                    
                        <Button basic circular><i className='fa fa-camera'></i></Button>
                        <Button basic circular onClick={this._playPause}><i className={this.state.isplaying[this.state.slideIndex]?'fa fa-pause':'fa fa-play'}></i></Button>
                        <Button basic circular><i className={ this.state.isRecording?'fa fa-stop-circle recording':'fa fa-stop-circle'} style={{color:'red'}}></i></Button>            
                    
                </div>
                <div className='col-5'>
                    <b>Camara {this.state.selectedCamera.id}</b> {this.state.selectedCamera.name} 
                </div>
                <div className='col-3'>
                    <Button onClick={()=>this._openCameraInfo(false)} className='pull-right' primary> { this.state.autoplay?'':'Ocultar controles'} <i className={ this.state.autoplay?'fa fa-chevron-up':'fa fa-chevron-down'}></i></Button>                
                </div>
            </div>
            <div className={!this.state.autoplay?'row showfilesinfocameragrid':'row hidefiles'}>
                <div className="col snapshotsgrid">
                    Fotos
                    <div className="row">
                        {this.state.photos.map(value=><div key={value} className="col-6 p10">
                            <Image src="https://via.placeholder.com/150"/>
                        </div>)}
                    </div>
                </div>
                <div className="col videosgrid">
                    Videos
                    <div className="row">
                        {this.state.videos.map(value=><div key={value} className="col-6 p10">
                            <Image src="https://via.placeholder.com/150"/>
                        </div>)}
                    </div>
                </div>
                <div className="col matchesgrid" align="center">
                    Historial
                    {this.state.matches.map((value, index)=><Match key={index} info={value} toggleControls={this._closeControl} />)}
                </div>
            </div>            
        </div> 
    </div>
    );
  }

  _playPause =() => {

  }

    _openCameraInfo = (marker) => {   
        if (marker) {
            this.setState({selectedCamera: marker.extraData, autoplay:false})
        } else {
            this.setState({selectedCamera: {}, autoplay:true})
        }             
        //this.props.toggleControlsBottom(marker.extraData)
    }

    componentDidMount(){       
        let markersForLoop = []
        this.props.places.map((value)=>{
            markersForLoop.push({
                title:value.name,
                extraData:value
            })
            return true
        })
        let cameras = []
          for(let item in responseJson.items){
            let suspect = responseJson.items[item]            
            //if(suspect.person_classification !== "Victim"){
              suspect.description = suspect.description.replace(/<p>/g,'').replace(/<\/p>/g,'')                            
              cameras.push(suspect)
            //}
          }               
        this.setState({markers:markersForLoop, matches:cameras})
    }

    static getDerivedStateFromProps(props, state){
        let markersForLoop = []
        props.places.map((value)=>{
            markersForLoop.push({
                title:value.name,
                extraData:value
            })
            return true
        })
        let aux = state
        aux.markers= markersForLoop
        return aux        
    }
}

export default GridCameraDisplay;