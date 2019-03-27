import React, { Component } from 'react';
import Carousel from 'nuka-carousel';
import CameraStream from '../CameraStream';

import './style.css'
class LoopCamerasDisplay extends Component {
    
    state = {
        markers : [],
        height:'auto',
        fullHeight:10,
    }

  render() {
    return (
    <div className="carouselContainer">
        <Carousel
            wrapAround = {true}
            autoplay = {true}
            cellAlign="center"
            heightMode="max"
            initialSlideHeight={this.state.fullHeight}  
            disableAnimation={true}          
        >
            {this.state.markers.map(value => <CameraStream key={value.extraData.id} marker={value} height={this.state.height} />)}
        </Carousel>
    </div>
    );
  }

    componentDidMount(){
        const navHeight = document.getElementsByTagName('nav')[0].scrollHeight
        const toolbar = document.getElementsByClassName('btn-toolbar')[0].scrollHeight
        const documentHeight = window.innerHeight
        let map = document.getElementsByClassName('carouselContainer')[0]//.style.height = documentHeight - navHeight
        map.style.height  = documentHeight - navHeight - toolbar + "px"   
        map.style.maxHeight  = documentHeight - navHeight - toolbar + "px"   
        this.setState({height:(documentHeight - navHeight - toolbar)/2 + "px" , fullHeight:(documentHeight - navHeight - toolbar)   })
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

export default LoopCamerasDisplay;