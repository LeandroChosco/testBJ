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
           
        ],
        actualCamera:{
            title:'',
            extraData:{}
        },
        displayTipe:1,
        cameraID:null,
        webSocket:'ws://18.222.106.238'
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
                            lat:value.google_cordenate.split(',')[0], 
                            lng:value.google_cordenate.split(',')[1],                            
                            webSocket:this.state.webSocket + ':' +(value.num_cam>=10?'10':'100') + value.num_cam,
                            name: value.street +' '+ value.number + ', ' + value.township+ ', ' + value.town+ ', ' + value.state
                        })
                    }
                })
                console.log(auxCamaras);
                this.setState({places:auxCamaras})
            });
        console.log(this.props)
        if(this.props.match.params.id){
            this.setState({cameraID:this.props.match.params.id,actualCamera:{title:this.state.places[this.props.match.params.id-1].name,extraData:this.state.places[this.props.match.params.id-1]}})
            this.setState({displayTipe:3})             
        }
    }
}

export default Analysis;