import React, { Component } from 'react';
//import Carousel from 'nuka-carousel';
import CameraStream from '../CameraStream';
import {  Button, Image } from 'semantic-ui-react'
import responseJson from '../../assets/json/suspects.json'
import filesJson from '../../assets/json/files.json'
import './style.css'
import Match from '../Match';
import MediaContainer from '../MediaContainer';
class LoopCamerasDisplay extends Component {
    
    state = {
        markers : [],
        slideIndex: 0,
        autoplay: true,
        interval:null,
        isRecording:false,
        photos:[],
        videos:[],
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
                        {this.state.photos.map(value=><MediaContainer src={'http://18.222.106.238:4000/'+value} image key={value} />)}
                    </div>
                </div>
                <div className="col videos">
                    Videos
                    <div className="row">
                        {this.state.videos.map(value=><MediaContainer src={'http://18.222.106.238:4000/'+value} video key={value} />)}
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
        let isplaying = this.state.isplaying
        isplaying[this.state.slideIndex] =!isplaying[this.state.slideIndex]
        console.log(isplaying)
        this.setState({isplaying:isplaying})
        if (this.state.isplaying[this.state.slideIndex]) {            
            //this.refs[index].state.player.pause()
        } else {            
            //this.refs[index].state.player.play()
        }
    } 
    _openCameraInfo = () => { 
        const index = 'camstreamloopref'+this.state.slideIndex
        console.log(index)               
        if(this.state.autoplay){    
            let images = []
            let videos = []
            let  check = 'cam'+(this.state.markers[this.state.slideIndex].extraData.num_cam>=10?'00':'000') + this.state.markers[this.state.slideIndex].extraData.num_cam + '/'
            filesJson.images.map(value=>{
                if (value.includes(check)) {
                    images.push(value)
                }
            })
            filesJson.videos.map(value=>{
                if (value.includes(check)) {
                    videos.push(value)
                }
            })            
            clearInterval(this.state.interval)
            this.setState({autoplay: false,videos:videos,photos:images})
        }  else {
                 
            const time =  setInterval(this.changeSlide,5000)
            this.setState({autoplay: true,interval: time,videos:[],photos:[]})            
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
        const time =  setInterval(this.changeSlide,5000)        
        let cameras = []
          for(let item in responseJson.items){
            let suspect = responseJson.items[item]            
            //if(suspect.person_classification !== "Victim"){
              suspect.description = suspect.description.replace(/<p>/g,'').replace(/<\/p>/g,'')                            
              cameras.push(suspect)
            //}
          }       
          this.setState({interval: time,markers:markersForLoop, height:.4,matches:cameras})
    }

    changeSlide = () => {
        this.setState({slideIndex: this.state.slideIndex === this.state.markers.length - 1 ? 0 : this.state.slideIndex + 1 })
    }

    componentDidUpdate(){
        const navHeight = document.getElementsByTagName('nav')[0].scrollHeight
        const viewBar = document.getElementsByClassName('toggleViewButton')[0].scrollHeight
        const bottomBar = document.getElementsByClassName('camControl')[0].scrollHeight        
        const documentHeight = window.innerHeight                 
        let map = document.getElementsByClassName('holderOfSlides')[0]//.style.height = documentHeight - navHeight       
        map.style.height  = (documentHeight - navHeight - bottomBar - viewBar ) + "px"   
        map.style.maxHeight  = (documentHeight - navHeight - bottomBar - viewBar ) + "px"  
        let canvas = document.querySelector('.holderOfSlides>div:not(.hiddenCameraNotshow)>.card>.card-body>.camHolder>canvas')
        if (canvas) {
            if (this.state.autoplay) {
                canvas.style.height = '100%'
                canvas.style.width = '100%'
            } else {
                canvas.style.height = '95%'
                canvas.style.width = '80%'
            }
        }
    }


    static getDerivedStateFromProps(props, state){
        let markersForLoop = []
        let isplaying = {}
        props.places.map((value,index)=>{
            markersForLoop.push({
                title:value.name,
                extraData:value
            })
            isplaying[index] = true
            return true
        })
        let aux = state
        aux.markers= markersForLoop
        aux.isplaying = isplaying
        return aux        
    }

}

export default LoopCamerasDisplay;