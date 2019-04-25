import React, { Component } from 'react';
import { ToggleButton, ToggleButtonGroup, Modal} from 'react-bootstrap'
import { Icon } from 'semantic-ui-react'
import '../../assets/styles/util.css';
import '../../assets/styles/main.css';
import '../../assets/fonts/iconic/css/material-design-iconic-font.min.css'
import './style.css'
import LoopCamerasDisplay from '../../components/LoopCamerasDisplay';
import GridCameraDisplay from '../../components/GridCameraDisplay';
import CameraStream from '../../components/CameraStream';
import constants from '../../constants/constants'
import { JellyfishSpinner } from "react-spinners-kit";
import Axios from 'axios';
import moment from 'moment'
import JSZipUtils from 'jszip-utils'
import JSZip from 'jszip'
import saveAs from 'file-saver'
class Analysis extends Component {

    state = {
        places : [
           
        ],
        actualCamera:{
            title:'',
            extraData:{}
        },
        displayTipe:1,
        cameraID:null,
        webSocket:constants.webSocket,
        loading:true,
        error:null,
        recordingCams:[],
        recordingProcess:[],  
        loadingRcord:false,
        isRecording:false,
        interval:null    ,
        loadingSnap:false ,
        loadingFiles: false ,
        modal: false,
        recordMessage:''
    }
  
  render() {
    return (
        <div >
            {this.state.displayTipe!==3&&!this.state.loading?<div className="toggleViewButton row">            
                <ToggleButtonGroup className='col-12' type="radio" name="options" defaultValue={2} onChange={this._changeDisplay} value={this.state.displayTipe}>
                    <ToggleButton value={1} variant='outline-danger' ><Icon name="grid layout"/></ToggleButton>
                    <ToggleButton value={2} variant='outline-danger' ><Icon name="clone"/></ToggleButton>
                    {this.state.cameraID?<ToggleButton value={3} variant='outline-danger' ><Icon name="square"/></ToggleButton>:null}
                </ToggleButtonGroup>
            </div> :null}    
            <div style={{position:'absolute',top:'30%', background:'transparent', width:'100%'}} align='center'>
         <JellyfishSpinner
                size={250}
                color="#686769"
                loading={this.state.loading}                
            />
         </div>       
            {
                this._showDisplay()
            }
            <Modal size="lg" show={this.state.modal} onHide={()=>this.setState({modal:false})}>
                            <Modal.Header closeButton>                      
                                
                            </Modal.Header>
                            <Modal.Body>
                                {this.state.recordMessage}
                            </Modal.Body>
                        </Modal>
        </div>
    );
  }
  _snapShot = (camera) => {
    this.setState({loadingSnap:true})

      Axios.post(constants.base_url + ':' + constants.apiPort + '/control-cams/screenshot/' + camera.id)
          .then(response => {
              this.setState({loadingSnap:false})
              const data = response.data
              console.log(data)
              if (data.success) {
                this.refs.myChild._loadFiles()
              }
          }) 
}

  _recordignToggle = (selectedCamera) => {
    if(this.state.recordingCams.indexOf(selectedCamera)>-1){
        let process_id = 0
        this.state.recordingProcess.map(value=>{
            if(value.cam_id === selectedCamera.id){
                process_id = value.process_id
            }
            return true 
        })
        this.setState({loadingRcord:true})
        Axios.put(constants.base_url + ':' + constants.apiPort + '/control-cams/stop-record/' + selectedCamera.id,
            {
                record_proccess_id:process_id 
            })
            .then((r) => { 
                const response = r.data
                if (response.success === true) {
                    
                    let stateRecordingProcess = this.state.recordingProcess
                    let stateRecordingCams = this.state.recordingCams                    
                    stateRecordingCams = stateRecordingCams.filter(el => el !== selectedCamera) 
                    stateRecordingProcess = stateRecordingProcess.filter(el => el.cam_id !== selectedCamera.id)                     
                    this.setState({recordingCams:stateRecordingCams, recordingProcess: stateRecordingProcess, isRecording: false,loadingRcord:false,modal:true,recordMessage:response.msg})                        
                    this.refs.myChild._loadFiles()
                } else {
                    let stateRecordingProcess = this.state.recordingProcess
                    let stateRecordingCams = this.state.recordingCams                    
                    stateRecordingCams = stateRecordingCams.filter(el => el !== selectedCamera) 
                    stateRecordingProcess = stateRecordingProcess.filter(el => el.cam_id !== selectedCamera.id)                     
                    this.setState({recordingCams:stateRecordingCams, recordingProcess: stateRecordingProcess, isRecording: false,loadingRcord:false,modal:true,recordMessage:response.msg})                                            
                }
            })
    } else {
       Axios.post(constants.base_url + ':' + constants.apiPort + '/control-cams/start-record/' + selectedCamera.id,{                                       
        })
            .then((r) => { 
                const response = r.data
                if (response.success === true) {
                    let recordingProcess = {
                        cam_id: selectedCamera.id,
                        process_id: response.id_record_proccess,
                        creation_time: moment()
                    }
                    let stateRecordingProcess = this.state.recordingProcess
                    let stateRecordingCams = this.state.recordingCams
                    stateRecordingProcess.push(recordingProcess)
                    stateRecordingCams.push(selectedCamera)
                    this.setState({recordingCams:stateRecordingCams, recordingProcess: stateRecordingProcess, isRecording: true})
                    if (this.state.interval === null) {
                        let interval = setInterval(this._checkLiveTimeRecording,5000)
                        this.setState({interval: interval})
                    }
                }
            })
    }
}

    _checkLiveTimeRecording = () =>{
        if (this.state.recordingProcess.length > 0) {
            let now = moment()
            this.state.recordingProcess.map(value=>{
                if (now.diff(value.creation_time,'minutes')>10) {
                    Axios.put(constants.base_url + ':' + constants.apiPort + '/control-cams/stop-record/' + value.cam_id,
                    {
                        record_proccess_id:value.process_id 
                    }).then(response=>{
                        console.log('response camid'+value.cam_id,response.data)
                        let stateRecordingProcess = this.state.recordingProcess                        
                        let stateRecordingCams = this.state.recordingCams                    
                        stateRecordingCams = stateRecordingCams.filter(el => el.id !== value.cam_id) 
                        stateRecordingProcess = stateRecordingProcess.filter(el => el.cam_id !== value.cam_id)                     
                        this.setState({recordingCams:stateRecordingCams, recordingProcess: stateRecordingProcess, isRecording: false,loadingRcord:false})   
                        this.refs.myChild._loadFiles()                     
                    })                    
                }
                return value
            })
        } else {
            clearInterval(this.interval)
            this.setState({interval: null})
        }
    }


    _makeReport = (camera) => {
        console.log(camera)
    }
  _showDisplay = () =>{
    switch(this.state.displayTipe){
        case 1:
            return (<GridCameraDisplay 
                        ref='myChild'
                        error={this.state.error} 
                        loading={this.state.loading} 
                        places = {this.state.places} 
                        toggleControlsBottom = {this._toggleControlsBottom} 
                        recordignToggle={this._recordignToggle} 
                        loadingRcord={this.state.loadingRcord} 
                        isRecording={this.state.isRecording}
                        recordingCams={this.state.recordingCams}
                        recordingProcess={this.state.recordingProcess}
                        loadingSnap={this.state.loadingSnap}
                        downloadFiles={this._downloadFiles}
                        loadingFiles={this.state.loadingFiles}
                        makeReport={this._makeReport}
                        snapShot={this._snapShot}/>)
        case 2:
            return (<LoopCamerasDisplay 
                        ref='myChild'
                        error={this.state.error} 
                        loading={this.state.loading} 
                        places = {this.state.places} 
                        toggleControlsBottom = {this._toggleControlsBottom} 
                        recordignToggle={this._recordignToggle} 
                        loadingRcord={this.state.loadingRcord} 
                        isRecording={this.state.isRecording}
                        recordingCams={this.state.recordingCams}
                        recordingProcess={this.state.recordingProcess}
                        loadingSnap={this.state.loadingSnap}
                        downloadFiles={this._downloadFiles}
                        loadingFiles={this.state.loadingFiles}
                        makeReport={this._makeReport}
                        snapShot={this._snapShot}/>)
        case 3:
            return (<div className="camUniqueHolder"><CameraStream marker={this.state.actualCamera} showButtons height={.45} hideFileButton showFilesBelow /></div>)
        default:
           return null
    }
  }


    urlToPromise = (url) => {
        return new Promise(function(resolve, reject) 
        {
            JSZipUtils.getBinaryContent(url, function (err, data) 
            {
                if(err) 
                {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }

    _downloadFiles = (camera,{videos,images}) => {
        this.setState({loadingFiles:true})        
        var zip = new JSZip();
        var imgs = zip.folder('images')
        if(images.length !== 0 && videos.length !== 0){
            images.forEach((url)=>{
                var filename = url.name;
                imgs.file(filename, this.urlToPromise(constants.base_url + ':' + constants.apiPort + '/' + url.relative_url ), {binary:true});
            });
            var vds = zip.folder('videos')
            videos.forEach((url)=>{
                var filename = url.name;
                vds.file(filename, this.urlToPromise(constants.base_url + ':' + constants.apiPort + '/' + url.relative_url ), {binary:true});
            });
            zip.generateAsync({type:"blob"}).then((content) => {
                // see FileSaver.js
                this.setState({loadingFiles:false})
                saveAs(content, "cam_"+camera.num_cam+".zip");  
                        
            });
        } else {
            Axios.get(constants.base_url + ':' + constants.apiPort + '/cams/' + camera.id + '/data')
            .then(response => {
                const data = response.data
                console.log(data)
                images = data.data.photos
                videos = data.data.videos  
                if(images.length !== 0 && videos.length !== 0){              
                    images.forEach((url)=>{
                        var filename = url.name;
                        imgs.file(filename, this.urlToPromise(constants.base_url + ':' + constants.apiPort + '/' + url.relative_url ), {binary:true});
                    });
                    var vds = zip.folder('videos')
                    videos.forEach((url)=>{
                        var filename = url.name;
                        vds.file(filename, this.urlToPromise(constants.base_url + ':' + constants.apiPort + '/' + url.relative_url ), {binary:true});
                    });
                    zip.generateAsync({type:"blob"}).then((content) => {
                        // see FileSaver.js
                        this.setState({loadingFiles:false})
                        saveAs(content, "cam_"+camera.num_cam+".zip");  
                                
                    });
                } else {

                }

            })    
        }
    } 
  
    _toggleControlsBottom = (marker) => {        
        this.props.toggleControls(marker)
    }

  _changeDisplay = (value) => {
      this.setState({displayTipe:value})      
  }


            

    componentDidMount(){

        fetch(constants.base_url+':'+constants.apiPort+'/register-cams/all-cams')       
            .then((response) => {
                return response.json();
            })
            .then((camaras) => {
                let auxCamaras = []
                let actualCamera = {}
                let title = ''
                let idCamera = null
                camaras.map(value=>{
                    if (value.active === 1) {
                        auxCamaras.push({
                            id:value.id,
                            num_cam:value.num_cam,
                            lat:value.google_cordenate.split(',')[0], 
                            lng:value.google_cordenate.split(',')[1],                            
                            webSocket:this.state.webSocket + ':' +constants.webSocketPort+(value.num_cam>=10?'':'0') + value.num_cam,
                            name: value.street +' '+ value.number + ', ' + value.township+ ', ' + value.town+ ', ' + value.state
                        })
                        if(this.props.match.params.id){
                           if (parseInt(this.props.match.params.id) === value.id) {
                                title= value.street +' '+ value.number + ', ' + value.township+ ', ' + value.town+ ', ' + value.state
                                actualCamera = {
                                    id:value.id,
                                    num_cam:value.num_cam,
                                    lat:value.google_cordenate.split(',')[0], 
                                    lng:value.google_cordenate.split(',')[1],                            
                                    webSocket:this.state.webSocket + ':' +constants.webSocketPort+(value.num_cam>=10?'':'0') + value.num_cam,
                                    name: value.street +' '+ value.number + ', ' + value.township+ ', ' + value.town+ ', ' + value.state
                                }
                                idCamera = value.id
                           }                                          
                        }
                        
                    }
                    return true;
                })        
                if(idCamera== null){
                    this.setState({places:auxCamaras,loading: false})
                } else {
                    this.setState({laces:auxCamaras,loading: false,cameraID:idCamera,actualCamera:{title:title,extraData:actualCamera}})
                    this.setState({displayTipe:3})
                }                
            }).catch(error=>{
                this.setState({loading: false,error:error})
                console.log('eeeeeeeeeeeerrrrrooooooor',error)
            })
        
    }

    componentWillUnmount(){
        this.state.recordingProcess.map(value=>{
            Axios.put(constants.base_url + ':' + constants.apiPort + '/control-cams/stop-record/' + value.cam_id,
            {
                record_proccess_id:value.process_id 
            })
            .then((r) => { 
                const response = r.data
                console.log(response)
            })
            return value;
        })
    }
}

export default Analysis;