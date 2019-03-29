import React, { Component } from 'react';
import CameraStream from '../CameraStream';
import { Row,Col} from 'react-bootstrap'
import './style.css'
class GridCameraDisplay extends Component {
    
    state = {
        markers : [],
        height:'auto',
        fullHeight:10,
    }

  render() {
    return (
    <div className='gridCameraContainer'>   
        <Row >     
            {this.state.markers.map(value => <Col className='p-l-0 p-r-0'  lg={4} sm={6}   key={value.extraData.id} onClick = {() => this._openCameraInfo(value)} marker={value.id}><CameraStream key={value.extraData.id} marker={value}/></Col>)}        
        </Row>
    </div>
    );
  }

    _openCameraInfo = (marker) => {                
        this.props.toggleControlsBottom(marker.extraData)
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
        this.setState({markers:markersForLoop})
    }
}

export default GridCameraDisplay;