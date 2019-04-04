import React, { Component } from 'react';
import { ToggleButton, ToggleButtonGroup} from 'react-bootstrap'
import { Icon } from 'semantic-ui-react'
import '../../assets/styles/util.css';
import '../../assets/styles/main.css';
import '../../assets/fonts/iconic/css/material-design-iconic-font.min.css'
import './style.css'
import LoopCamerasDisplay from '../../components/LoopCamerasDisplay';
import GridCameraDisplay from '../../components/GridCameraDisplay';
//import ListCameraDisplay from '../../components/ListCameraDisplay';
import CameraStream from '../../components/CameraStream';
//import CameraControls from '../../components/CameraControls';



class Analysis extends Component {

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
        ],
        actualCamera:{
            title:'',
            extraData:{}
        },
        displayTipe:2,
        cameraID:null
    }
  
  render() {
    return (
        <div >
            <div className="toggleViewButton row">            
                <ToggleButtonGroup className='col-12' type="radio" name="options" defaultValue={2} onChange={this._changeDisplay} value={this.state.displayTipe}>
                    <ToggleButton value={1} variant='outline-danger' ><Icon name="grid layout"/></ToggleButton>
                    <ToggleButton value={2} variant='outline-danger' ><Icon name="clone"/></ToggleButton>
                    {this.state.cameraID?<ToggleButton value={3} variant='outline-danger' ><Icon name="squere"/></ToggleButton>:null}
                </ToggleButtonGroup>
            </div>            
            {
                this._showDisplay()
            }
        </div>
    );
  }
  _showDisplay = () =>{
    switch(this.state.displayTipe){
        case 1:
            return (<GridCameraDisplay places = {this.state.places} toggleControlsBottom = {this._toggleControlsBottom}/>)
        case 2:
            return (<LoopCamerasDisplay places = {this.state.places} toggleControlsBottom = {this._toggleControlsBottom}/>)
        case 3:
            return (<div className="camUniqueHolder"><CameraStream marker={this.state.actualCamera} showButtons /></div>)
        default:
           return null
    }
  }

  
    _toggleControlsBottom = (marker) => {        
        this.props.toggleControls(marker)
    }

  _changeDisplay = (value) => {
      this.setState({displayTipe:value})      
  }
    componentDidMount(){
        console.log(this.props)
        if(this.props.match.params.id){
            this.setState({cameraID:this.props.match.params.id,actualCamera:{title:this.state.places[this.props.match.params.id-1].name,extraData:this.state.places[this.props.match.params.id-1]}})
            this.setState({displayTipe:3})             
        }
    }
}

export default Analysis;