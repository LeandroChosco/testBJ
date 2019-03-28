import React, { Component } from 'react';
import Carousel from 'nuka-carousel';
import CameraStream from '../CameraStream';

import './style.css'
class LoopCamerasDisplay extends Component {
    
    state = {
        markers : [],
        height:'auto',
        fullHeight:10,
        slideIndex: 0,
    }

    _showCameraInfo(){
        this.props.toggleControlsBottom()
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
            withoutControls={true}               
            afterSlide={slideIndex => this.setState({ slideIndex })}     
        >
            {this.state.markers.map((value,index) => (index==this.state.slideIndex||index==this.state.slideIndex+1)?<CameraStream key={value.extraData.id} marker={value} height={this.state.height} />:<div>Hola</div>)}
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