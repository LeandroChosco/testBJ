import React, { Component } from 'react';
import Carousel from 'nuka-carousel';
import CameraStream from '../CameraStream';
import {  Button } from 'semantic-ui-react'

import './style.css'
class LoopCamerasDisplay extends Component {
    
    state = {
        markers : [],
        slideIndex: 0,
        autoplay: true
    }

    _showCameraInfo(){
        this.props.toggleControlsBottom()
    }

  render() {
    return (
    <div className="carouselContainer">
        <Carousel
            wrapAround = {true}
            autoplay = {this.state.autoplay}
            cellAlign="center"
            disableAnimation={true} 
            withoutControls={true}  
            heightMode="max"       
            autoplayInterval = {2000}      
            afterSlide={slideIndex => this.setState({ slideIndex })}     
        >
            {this.state.markers.map((value,index) => (index==this.state.slideIndex||index==this.state.slideIndex+1||index === 0 )?<CameraStream key={value.extraData.id} marker={value} height={this.state.height} />:<div key={index}>Hola</div>)}
        </Carousel>
        <div align="center">
            <Button className="buttonDetails" onClick={this._openCameraInfo}> {this.state.autoplay?'Ver detalles de camara':'Ocultar detalles'}</Button>
        </div>
    </div>
    );
  }


    _openCameraInfo = () => {                
        this.state.autoplay?this.props.toggleControlsBottom(this.state.markers[this.state.slideIndex].extraData):this.props.toggleControlsBottom(null)
        this.setState({autoplay: !this.state.autoplay})
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
    setTimeout(this.updateHeight,100)
        this.setState({markers:markersForLoop})
    }

    updateHeight = () => {
        const slider = document.getElementsByClassName('slider')[0]
        const visible = document.getElementsByClassName('slide-visible')[0]        
        if(visible){
            slider.style.height = visible.scrollHeight + 'px'
            this.setState({height:visible.scrollHeight-30})
        }
    }
}

export default LoopCamerasDisplay;