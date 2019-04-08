import React, { Component } from 'react';
import { ToggleButton, ToggleButtonGroup} from 'react-bootstrap'
import { Icon } from 'semantic-ui-react'
import '../../assets/styles/util.css';
import '../../assets/styles/main.css';
import '../../assets/fonts/iconic/css/material-design-iconic-font.min.css'
import './style.css'
import LoopCamerasDisplay from '../../components/LoopCamerasDisplay';
import GridCameraDisplay from '../../components/GridCameraDisplay';
import CameraStream from '../../components/CameraStream';

import { JellyfishSpinner } from "react-spinners-kit";

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
        webSocket:'ws://18.222.106.238',
        loading:true,
        error:null
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
            <div style={{position:'absolute',top:'30%', background:'transparent', width:'100%'}} align='center'>
         <JellyfishSpinner
                size={250}
                color="#686769"
                loading={this.props.loading}                
            />
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
            return (<GridCameraDisplay error={this.state.error} loading={this.state.loading} places = {this.state.places} toggleControlsBottom = {this._toggleControlsBottom}/>)
        case 2:
            return (<LoopCamerasDisplay error={this.state.error} loading={this.state.loading} places = {this.state.places} toggleControlsBottom = {this._toggleControlsBottom}/>)
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
                    return true;
                })
                this.setState({places:auxCamaras,loading: false})
            }).catch(error=>{
                this.setState({error:error,loading: false})
                console.log('eeeeeeeeeeeerrrrrooooooor',error)
            })
        if(this.props.match.params.id){
            this.setState({cameraID:this.props.match.params.id,actualCamera:{title:this.state.places[this.props.match.params.id-1].name,extraData:this.state.places[this.props.match.params.id-1]}})
            this.setState({displayTipe:3})             
        }
    }
}

export default Analysis;