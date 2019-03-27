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
    <div className="carouselContainer">   
        <Row >     
            {this.state.markers.map(value => <Col  lg={4} sm={6}   key={value.extraData.id}><CameraStream key={value.extraData.id} marker={value} /></Col>)}        
        </Row>
    </div>
    );
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