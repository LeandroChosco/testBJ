import React, { Component } from 'react';
//import Carousel from 'nuka-carousel';
import CameraStream from '../CameraStream';
import {  Button, Image } from 'semantic-ui-react'
import responseJson from '../../assets/json/suspects.json'
import './style.css'
import Match from '../Match';
class LoopCamerasDisplay extends Component {
    
    state = {
        markers : [],
        slideIndex: 0,
        autoplay: true,
        interval:null,
        isRecording:false,
        photos:[1,2,3,4,5,6,7,8,9],
        videos:[1,3,5,4,6],
        isplaying:[],
        matches: [],
        height:'50%'
    }

    _showCameraInfo(){
        this.props.toggleControlsBottom()
    }

  render() {
    return (
    <div className="holderOfSlides">
        
            {this.state.markers.map((value,index) => <div key={value.extraData.id} style={{height:'100%'}} className={(index===this.state.slideIndex )?'':'hiddenCameraNotshow'}><CameraStream ref={'camstreamloopref'+index} marker={value} height={this.state.height} /></div>)}        
        <div className={!this.state.autoplay?'camControl showfiles':'camControl'}>
            <div className='row stiky-top'>
                <div className='col-8'>
                    
                        <Button basic circular><i className='fa fa-camera'></i></Button>
                        <Button basic circular onClick={this._playPause}><i className={this.state.isplaying[this.state.slideIndex]?'fa fa-pause':'fa fa-play'}></i></Button>
                        <Button basic circular><i className={ this.state.isRecording?'fa fa-stop-circle recording':'fa fa-stop-circle'} style={{color:'red'}}></i></Button>            
                    
                </div>
                <div className='col-4'>
                    <Button onClick={this._openCameraInfo} className='pull-right' primary><i className={ this.state.autoplay?'fa fa-square':'fa fa-play'}></i> { this.state.autoplay?'Parar loop':'Continuar loop'} <i className={ this.state.autoplay?'fa fa-chevron-up':'fa fa-chevron-down'}></i></Button>                
                </div>
            </div>
            <div className={!this.state.autoplay?'row showfilesinfocamera':'row hidefiles'}>
                <div className="col snapshots">
                    Fotos
                    <div className="row">
                        {this.state.photos.map(value=><div key={value} className="col-6 p10">
                            <Image src="https://via.placeholder.com/150"/>
                        </div>)}
                    </div>
                </div>
                <div className="col videos">
                    Videos
                    <div className="row">
                        {this.state.videos.map(value=><div key={value} className="col-6 p10">
                            <Image src="https://via.placeholder.com/150"/>
                        </div>)}
                    </div>
                </div>
                <div className="col matches" align="center">
                    Historial
                    {this.state.matches.map((value, index)=><Match key={index} info={value} toggleControls={this._closeControl} />)}
                </div>
            </div>            
        </div>        
    </div>
    );
  }

    _playPause = () =>{
        const index = 'camstreamloopref'+this.state.slideIndex        
        console.log(this.state.isplaying[this.state.slideIndex])
        this.setState({isplaying:{[this.state.slideIndex]:!this.state.isplaying[this.state.slideIndex]}})
        if (this.state.isplaying[this.state.slideIndex]) {            
            this.refs[index].state.player.pause()
        } else {            
            this.refs[index].state.player.play()
        }
    } 
    _openCameraInfo = () => { 
        const index = 'camstreamloopref'+this.state.slideIndex
        console.log(index)               
        console.log(this.refs[index].state.player.playing)
        if(this.state.autoplay){
            clearInterval(this.state.interval)
            this.setState({autoplay: false})
        }  else {
            const time =  setInterval(this.changeSlide,15000)
            this.setState({interval: time})
            this.setState({autoplay: true})
        }     
    }

    componentDidMount(){
        let markersForLoop = []
        let playing=[]
        this.props.places.map((value)=>{
            markersForLoop.push({
                title:value.name,
                extraData:value
            })
            playing.push(true)        
            return true
        })    
        this.setState({isplaying:playing})
        const navHeight = document.getElementsByTagName('nav')[0].scrollHeight
        const viewBar = document.getElementsByClassName('toggleViewButton')[0].scrollHeight
        const bottomBar = document.getElementsByClassName('camControl')[0].scrollHeight
        const documentHeight = window.innerHeight 
        let map = document.getElementsByClassName('holderOfSlides')[0]//.style.height = documentHeight - navHeight       
        map.style.height  = (documentHeight - navHeight - bottomBar - viewBar) + "px"   
        map.style.maxHeight  = (documentHeight - navHeight - bottomBar - viewBar) + "px"                      
        const time =  setInterval(this.changeSlide,15000)
        this.setState({interval: time,markers:markersForLoop, height:.4})
        let cameras = []
          for(let item in responseJson.items){
            let suspect = responseJson.items[item]            
            //if(suspect.person_classification !== "Victim"){
              suspect.description = suspect.description.replace(/<p>/g,'').replace(/<\/p>/g,'')                            
              cameras.push(suspect)
            //}
          }       
        this.setState({matches:cameras})    
    }

    changeSlide = () => {
        this.setState({slideIndex: this.state.slideIndex === this.state.markers.length - 1 ? 0 : this.state.slideIndex + 1 })
    }

}

export default LoopCamerasDisplay;