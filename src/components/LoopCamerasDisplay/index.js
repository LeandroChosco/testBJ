import React, { Component } from 'react';
//import Carousel from 'nuka-carousel';
import CameraStream from '../CameraStream';
import {  Button, Tab } from 'semantic-ui-react'
import responseJson from '../../assets/json/suspects.json'
import './style.css'
import Match from '../Match';
import MediaContainer from '../MediaContainer';
import conections from '../../conections';
import * as moment from 'moment'
  
class LoopCamerasDisplay extends Component {
    
    state = {
        markers : [],
        slideIndex: 0,
        autoplay: true,
        interval:null,
        isRecording:false,
        photos:[],
        videos:[],
        video_history:[],
        isplaying:[],
        matches: [],
        height:undefined,
        isplay: true
    }

    _showCameraInfo(){
        this.props.toggleControlsBottom()
    }

  render() {
    return (
    <div className="holderOfSlides">
            {this.props.error?<div className="errorContainer">
                Error al cargar informacion: {JSON.stringify(this.props.error)}
            </div>:null}
            {this.state.height?this.state.markers.map((value,index) =>
               index===this.state.slideIndex?<div key={value.extraData.id} style={{height:'100%',width:'100%', paddign:'50%'}} align='center' className={(index===this.state.slideIndex )?'':'hiddenCameraNotshow'}>
                    <CameraStream
                        ref={'camstreamloopref'+value.extraData.id} 
                        marker={value} 
                        height={'100%'}                       
                        width={'75%'} />
                </div>:null
            ):null}        
        <div className={!this.state.autoplay?'camControl showfiles':'camControl'}>
        {this.state.markers[this.state.slideIndex]?<div className='row stiky-top'>
                <div className='col-8'>
                        {this.props.moduleActions?this.props.moduleActions.btnsnap?<Button basic circular disabled={this.state.photos.length>=5||this.state.restarting||this.props.loadingSnap||this.props.loadingFiles||this.props.recordingCams.indexOf(this.state.markers[this.state.slideIndex].extraData)>-1} loading={this.props.loadingSnap} onClick={()=>this.props.snapShot(this.state.markers[this.state.slideIndex].extraData)}><i className='fa fa-camera'></i></Button>:null:null}
                        {/* <Button basic circular disabled={this.state.restarting||this.props.loadingSnap||this.props.loadingFiles||this.props.recordingCams.indexOf(this.state.markers[this.state.slideIndex].extraData)>-1} onClick={this._playPause}><i className={this.state.isplay?'fa fa-pause':'fa fa-play'}></i></Button> */}
                        {this.props.moduleActions?this.props.moduleActions.btnrecord?<Button basic circular disabled={this.state.videos.length>=5||this.state.restarting||this.props.loadingSnap||this.props.loadingFiles} onClick={() => this.props.recordignToggle(this.state.markers[this.state.slideIndex].extraData)}><i className={ this.props.recordingCams.indexOf(this.state.markers[this.state.slideIndex].extraData)>-1?'fa fa-stop-circle recording':'fa fa-stop-circle'} style={{color:'red'}}></i></Button>:null:null}
                        <Button basic circular disabled={this.state.restarting||this.props.loadingSnap||this.props.loadingFiles||this.props.recordingCams.indexOf(this.state.markers[this.state.slideIndex].extraData)>-1} onClick={()=>window.open(window.location.href.replace(window.location.pathname,'/') + 'analisis/' + this.state.markers[this.state.slideIndex].extraData.id,'_blank','toolbar=0,location=0,directories=0,status=1,menubar=0,titlebar=0,scrollbars=1,resizable=1')}> <i className="fa fa-external-link"></i></Button>
                        <Button basic circular disabled={this.state.restarting||this.props.loadingSnap||this.props.loadingFiles||this.props.recordingCams.indexOf(this.state.markers[this.state.slideIndex].extraData)>-1} onClick={()=>this.props.downloadFiles(this.state.markers[this.state.slideIndex].extraData, {videos:this.state.videos,images:this.state.photos})} loading={this.props.loadingFiles}> <i className="fa fa-download"></i></Button>
                        <Button basic circular disabled={this.state.restarting||this.props.loadingSnap||this.props.loadingFiles||this.props.recordingCams.indexOf(this.state.markers[this.state.slideIndex].extraData)>-1} onClick={()=>this.props.makeReport(this.state.markers[this.state.slideIndex].extraData)}> <i className="fa fa-warning"></i></Button>
                        {/* <Button basic circular disabled={this.state.restarting||this.props.loadingSnap||this.props.loadingFiles||this.props.recordingCams.indexOf(this.state.markers[this.state.slideIndex].extraData)>-1} onClick={this._restartCamStream}> <i className={!this.state.restarting?"fa fa-repeat":"fa fa-repeat fa-spin"}></i></Button> */}
                        <Button basic circular onClick={()=>this.props.changeStatus(this.state.markers[this.state.slideIndex].extraData)}> <i className="fa fa-exchange"></i></Button>
                </div>
                <div className='col-4'>
                    <Button onClick={this._openCameraInfo} className='pull-right' primary><i className={ this.state.autoplay?'fa fa-square':'fa fa-play'}></i> { this.state.autoplay?'Parar loop':'Continuar loop'} <i className={ this.state.autoplay?'fa fa-chevron-up':'fa fa-chevron-down'}></i></Button>                
                </div>
            </div>:null}
            <div className={!this.state.autoplay?'row showfilesinfocamera':'row hidefiles'}>
                <div className="col snapshots">
                    Fotos
                    <div className="row">
                        {this.state.photos.map((value,index)=><MediaContainer src={value.relative_url} value={value} cam={this.state.markers[this.state.slideIndex].extraData} reloadData={this._loadFiles} image key={index} />)}
                    </div>
                     {this.state.photos.length === 0 ?
                            <div align='center'>
                             <p className="big-letter">No hay archivos que mostrar</p>
                             <i className='fa fa-image fa-5x'></i>
                            </div>
                            :null}
                </div>
                <div className="col videos">
                    Videos
                    <Tab menu={{ secondary: true, pointing: true }} panes={[
                        { menuItem: 'Actuales', render: () => <Tab.Pane attached={false}><div>
                            <div className="row">
                                {this.state.videos.map((value,index)=><MediaContainer src={value.relative_url} value={value} cam={this.state.markers[this.state.slideIndex].extraData} reloadData={this._loadFiles} video key={index} />)}
                            </div>
                            {this.state.videos.length === 0 ?
                                <div align='center'>
                                    <p className="big-letter">No hay archivos que mostrar</p>
                                    <i className='fa fa-image fa-5x'></i>
                                </div>
                            :null}
                            </div>
                        </Tab.Pane> },

this.props.moduleActions?this.props.moduleActions.viewHistorial?{ menuItem: 'Historico', render: () => <Tab.Pane attached={false}>
                            {this.state.video_history.items?this.state.video_history.items.map((row,count)=><div key={count} className="row">
                                <div className="col-12">
                                    <h4>{row.fecha}</h4>
                                </div>

                                        {row.videos.map((value,index)=>{
                                            if(index%this.state.slideIndex===0)
                                                return(<MediaContainer dns_ip={'http://'+this.state.video_history.dns_ip} hideDelete src={value.RecordProccessVideo.relative_path_file} value={value} cam={this.state.markers[this.state.slideIndex].extraData} reloadData={this._loadFiles} video key={index} />)
                                            return (null)
                                        })}                                        
                                    </div>

                                ):null}
                            
                            {this.state.video_history.items?this.state.video_history.items.length === 0 ?
                                <div align='center'>
                                    <p className="big-letter">No hay archivos que mostrar</p>
                                    <i className='fa fa-image fa-5x'></i>
                                </div>
                            : null:<div align='center'>
                            <p className="big-letter">No hay archivos que mostrar</p>
                            <i className='fa fa-image fa-5x'></i>
                            </div>}
                        </Tab.Pane> }:{}:{},
                    ]} />                    
                </div>
                <div className="col matches" align="center">
                    Historial
                    {this.state.matches.length>0?this.state.matches.map((value, index)=><Match key={index} info={value} toggleControls={this._closeControl} />):<h4>Sin historial de matches</h4>}
                </div>
            </div>            
        </div>   
    </div>
    );
  }


    _recordToggle = () => {
        //this.props.recordignToggle(this.state.markers[this.state.slideIndex])
    }
    _playPause = () =>{

        let isplaying = this.state.isplaying
        if(this.state.isplaying.length === 0){
            isplaying = {}
            this.state.markers.map((value,index)=>{
                isplaying[index] = true
                return true;
            })            
        }    
        isplaying[this.state.slideIndex] = !isplaying[this.state.slideIndex]                        
        this.setState({isplaying:isplaying,isplay:isplaying[this.state.slideIndex]})
        this.refs['camstreamloopref'+this.state.markers[this.state.slideIndex].id]._togglePlayPause()
    } 

    _restartCamStream = async() => {        
        const index = 'camstreamloopref'+this.state.markers[this.state.slideIndex].extraData.id        
        if(this.refs[index]===undefined)
            return
        this.setState({restarting:true})
        await this.refs[index]._restartCamStream()
        this.setState({restarting:false})
    }


    _openCameraInfo = () => {         
        if (this.props.error === null || this.props.error === undefined) {                                    
            if(this.state.autoplay){                           
                clearInterval(this.state.interval)
                this.setState({autoplay: false})
                this._loadFiles()
            }  else {
                    
                const time =  setInterval(this.changeSlide,5000)
                this.setState({autoplay: true,interval: time,videos:[],photos:[],video_history:[]})            
            }   
        }  
    }

    _loadFiles = () =>{ 
        conections.getCamData(this.state.markers[this.state.slideIndex].extraData.id)                                  
        .then(response => {
            const data = response.data            
            this.setState({videos:data.data.videos,photos:data.data.photos,video_history:data.data.videos_history})
        }) 
        conections.getCamDataHistory(this.state.markers[this.state.slideIndex].extraData.id)
        .then(response => {
            let resHistory = response.data              
              if(resHistory.success){
                let items = []
                  resHistory.data.items = resHistory.data.items.map(val=>{
                    val.fecha = moment(val.RecordProccessVideo.datetime_start).format('HH:mm')
                    let fecha_inicio =   moment(val.RecordProccessVideo.datetime_start)
                    if (items.length === 0) {
                        items.push({dateTime:val.RecordProccessVideo.datetime_start,videos:[val]})
                    } else {
                        let found = false;
                        for (let index = 0; index < items.length; index++) {
                            let fecha_array = moment(items[index].dateTime);
                            if(fecha_array.isSame(fecha_inicio,'hour'))
                            {
                                found = true
                                items[index].videos.push(val)
                                break;
                            }
                            
                        }
                        if(!found){
                            items.push({dateTime:val.RecordProccessVideo.datetime_start,videos:[val]})
                        }
                    }
                      return val
                })			
                items.map(val=>{
                    val.fecha = moment(val.dateTime).format('YYYY-MM-DD HH:mm')
                    return val
                })                
                resHistory.data.items = items
                
                this.setState({video_history:resHistory.data})
    
              }
        })     
        conections.getCamMatches(this.state.markers[this.state.slideIndex].extraData.real_num_cam).then(response=>{
            if (response.status === 200) {
                this.setState({matches:response.data})
            }
        })           
    }

    componentWillUnmount(){
        clearInterval(this.state.interval)
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
        let height = documentHeight - navHeight - bottomBar - viewBar - 150
        map.style.maxHeight  = (documentHeight - navHeight - bottomBar - viewBar) + "px"                              
        let time = setInterval(this.changeSlide,1000*10)        
        let cameras = []
          for(let item in responseJson.items){
            let suspect = responseJson.items[item]            
            //if(suspect.person_classification !== "Victim"){
              suspect.description = suspect.description.replace(/<p>/g,'').replace(/<\/p>/g,'')                            
              cameras.push(suspect)
            //}
          }       
          if (this.state.markers[0]) {
              conections.getCamData(this.state.markers[this.state.slideIndex].extraData.id)            
            .then(response => {
                const data = response.data                
                this.setState({videos:data.data.videos,photos:data.data.photos})
            })
          }
          this.setState({interval: time,markers:markersForLoop, height:height})
    }

    changeSlide = () => {
        let isp = {}
        if(this.state.isplaying.length === 0){            
            this.state.markers.map((value,index)=>{
                isp[index] = true
                return true;
            })            
        } else {
            isp = this.state.isplaying;
        }
        this.setState({videos:[],photos:[]})
        let si = this.state.slideIndex === this.state.markers.length - 1 ? 0 : this.state.slideIndex + 1
        conections.getCamData(this.state.markers[si].extraData.id)        
            .then(response => {
                const data = response.data                
                this.setState({videos:data.data.videos,photos:data.data.photos})
            })
        this.setState({slideIndex: si,isplaying:isp,isplay:this.state.isplaying[si]===undefined?true:this.state.isplaying[si] })
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
        props.places.map((value,index)=>{
            markersForLoop.push({
                title:value.name,
                extraData:value
            })            
            return true
        })
        let aux = state
        aux.markers= markersForLoop        
        return aux        
    }

}

export default LoopCamerasDisplay;