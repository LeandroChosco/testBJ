import React, { Component } from 'react';
import CameraStream from '../CameraStream';
import { Col} from 'react-bootstrap'
import './style.css'
class ListCameraDisplay extends Component {
    
    state = {
        markers : [],
        height:'auto',
        fullHeight:10,
    }

  render() {
    return (
    <div className="carouselContainer">           
            {this.state.markers.map(value => <Col  lg={12} sm = {12}  key={value.extraData.id} onClick = {() => this._openCameraInfo(value)}><CameraStream key={value.extraData.id} marker={value} horizontal/></Col>)}                
    </div>
    );
  }
    _openCameraInfo = (marker) => {                
        this.props.toggleSideMenu(marker.extraData)
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

export default ListCameraDisplay;