import React, { Component } from 'react';
import CameraStream from '../CameraStream';
import { Row,Col} from 'react-bootstrap'
import {  Button } from 'semantic-ui-react'
import responseJson from '../../assets/json/suspects.json'
import './style.css'
import Match from '../Match';
import MediaContainer from '../MediaContainer';
import Axios from 'axios';
import constants from '../../constants/constants';
class GridCameraDisplay extends Component {
    
    state = {
        markers : [],
        height:'auto',
        fullHeight:10,
        isplaying:[],
        slideIndex:0,
        matches:[],
        photos:[],
        videos:[],
        autoplay: true,
        selectedCamera:{},
        isRecording:false,
        recordingCams:[],
        recordingProcess:[],
        loadingRcord: false
    }

  render() {
    return (
    <div className='gridCameraContainer' align='center'>   
        <Row >     
            {this.state.markers.map(value => <Col className={this.state.selectedCamera === value.extraData?'p-l-0 p-r-0 activeselectedcameragrid':'p-l-0 p-r-0'}  lg={4} sm={6}   key={value.extraData.id} onClick = {() => this._openCameraInfo(value)} marker={value.id}><CameraStream key={value.extraData.id} marker={value} height={.7}/></Col>)}        
        </Row>        
            {this.props.error?<div className="errorContainer">
                Error al cargar informacion: {JSON.stringify(this.props.error)}
            </div>:null}
        <div className={!this.state.autoplay?'camGridControl showfiles':'camGridControl'}>
            <div className='row stiky-top'>
                <div className='col-4'>
                    
                        <Button basic circular loading={this.props.loadingSnap} onClick={()=>this.props.snapShot(this.state.selectedCamera)}><i className='fa fa-camera'></i></Button>
                        <Button basic circular onClick={this._playPause}><i className={this.state.isplaying[this.state.slideIndex]?'fa fa-pause':'fa fa-play'}></i></Button>
                        <Button basic circular loading={this.props.loadingRcord} onClick={()=>this.props.recordignToggle(this.state.selectedCamera)}><i className={ this.props.recordingCams.indexOf(this.state.selectedCamera)>-1?'fa fa-stop-circle recording':'fa fa-stop-circle'} style={{color:'red'}}></i></Button>            
                        <Button basic circular onClick={()=>window.open(window.location.href.replace(window.location.pathname,'/') + 'analisis/' + this.state.selectedCamera.id,'_blank','toolbar=0,location=0,directories=0,status=1,menubar=0,titlebar=0,scrollbars=1,resizable=1')}> <i className="fa fa-external-link"></i></Button>
                        <Button basic circular onClick={()=>this.props.downloadFiles(this.state.selectedCamera, {videos:this.state.videos,images:this.state.photos})} loading={this.props.loadingFiles}> <i className="fa fa-download"></i></Button>
                </div>
                <div className='col-5'>
                    <b>Camara {this.state.selectedCamera.num_cam}</b> {this.state.selectedCamera.name} 
                </div>
                <div className='col-3'>                    
                    <Button onClick={()=>this._openCameraInfo(false)} className='pull-right' primary> { this.state.autoplay?'':'Ocultar controles'} <i className={ this.state.autoplay?'fa fa-chevron-up':'fa fa-chevron-down'}></i></Button>                
                </div>
            </div>
            <div className={!this.state.autoplay?'row showfilesinfocameragrid':'row hidefiles'}>
                <div className="col snapshotsgrid">
                    Fotos
                    <div className="row">
                        {this.state.photos.map((value,index)=><MediaContainer image key={index} src={'http://18.222.106.238:4000/'+value.relative_url}/>)}
                    </div>
                    {this.state.photos.length === 0 ?
                            <div align='center'>
                             <p className="big-letter">No hay archivos que mostrar</p>
                             <i className='fa fa-image fa-5x'></i>
                            </div>
                            :null}
                </div>
                <div className="col videosgrid">
                    Videos
                    <div className="row">
                        {this.state.videos.map((value,index)=><MediaContainer video key={index} src={'http://18.222.106.238:4000/'+value.relative_url}/>)}                        
                    </div>
                    {this.state.videos.length === 0 ?
                            <div align='center'>
                             <p className="big-letter">No hay archivos que mostrar</p>
                             <i className='fa fa-image fa-5x'></i>
                            </div>
                            :null}
                </div>
                <div className="col matchesgrid" align="center">
                    Historial
                    {this.state.matches.map((value, index)=><Match key={index} info={value} toggleControls={this._closeControl} />)}
                </div>
            </div>            
        </div> 
    </div>
    );
  }

    

    _playPause =() => {

    }


    _loadFiles = (cam) =>{
        if (cam) {
            Axios.get(constants.base_url + ':' + constants.apiPort + '/cams/' + cam.id + '/data')
            .then(response => {
                const data = response.data
                console.log(data)
                this.setState({videos:data.data.videos,photos:data.data.photos})
            })
        } else {
            if (this.state.selectedCamera!== undefined) {
                Axios.get(constants.base_url + ':' + constants.apiPort + '/cams/' + this.state.selectedCamera.id + '/data')
                .then(response => {
                    const data = response.data
                    console.log(data)
                    this.setState({videos:data.data.videos,photos:data.data.photos})
                })
            }
        }        
    }


    _openCameraInfo = (marker) => {   
        if (marker) {
            let index = this.state.markers.indexOf(marker)            
            let recording = false       
            if(this.props.recordingCams.indexOf(marker.extraData)>-1){
                recording = true
            }
            this.setState({selectedCamera: marker.extraData, autoplay:false, slideIndex: index, isRecording: recording})
            this._loadFiles(marker.extraData)
        } else {
            this.setState({selectedCamera: {}, autoplay:true, videos:[],photos:[]})
        }             
        
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
        let cameras = []
          for(let item in responseJson.items){
            let suspect = responseJson.items[item]            
            //if(suspect.person_classification !== "Victim"){
              suspect.description = suspect.description.replace(/<p>/g,'').replace(/<\/p>/g,'')                            
              cameras.push(suspect)
            //}
          }               
        this.setState({markers:markersForLoop, matches:cameras})
    }

    componentWillUnmount(){

    }

    static getDerivedStateFromProps(props, state){
        let markersForLoop = []
        let isplaying = {}
        props.places.map((value,index)=>{
            markersForLoop.push({
                title:value.name,
                extraData:value
            })
            isplaying[index]=true
            return true
        })
        let aux = state
        aux.markers= markersForLoop
        aux.isplaying= isplaying
        return aux        
    }
}

export default GridCameraDisplay;