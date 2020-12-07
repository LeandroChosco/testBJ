import React, { Component } from 'react';
import CameraStream from '../CameraStream';
import { Row,Col} from 'react-bootstrap'
import {  Button, Select, Tab } from 'semantic-ui-react'
import responseJson from '../../assets/json/suspects.json'
import './style.css'
import Match from '../Match';
import MediaContainer from '../MediaContainer';
import ReactPaginate from 'react-paginate';
import conections from '../../conections';
import moment from 'moment-timezone';
import {DateTime} from 'luxon'
import Spinner from 'react-bootstrap/Spinner'
const countryOptions = [{
    key: 5,
    text: 5,
    value: 5
  },{
    key: 10,
    text: 10,
    value: 10
  },{
    key: 15,
    text: 15,
    value: 15
  },{
    key: 20,
    text: 20,
    value: 20
  },{
    key: 25,
    text: 25,
    value: 25
  },{
    key: 30,
    text: 30,
    value: 30
  },{
    key: 50,
    text: 50,
    value: 50
  }]
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
        video_history:[],
        autoplay: true,
        selectedCamera:{},
        isRecording:false,
        recordingCams:[],
        recordingProcess:[],
        loadingRcord: false,
        limit:10,
        start:0,
        pageCount:1,
        isplay:true,
        servidorMultimedia: '',
        loadingSnap: false,
        videosLoading: false,
        imageLoading: false
    }

  render() {
      //console.log(this.props)
    return (
    <div className='gridCameraContainer' align='center'>    
        <Row >     
            {this.state.markers.map((value,index) => 
                (index<this.state.start+this.state.limit)&&index>=this.state.start?
                    <Col className={this.state.selectedCamera === value.extraData?'p-l-0 p-r-0 activeselectedcameragrid camcolgridholder':'p-l-0 p-r-0 camcolgridholder'}  lg={4} sm={6}   key={value.extraData.id} onClick = {() => this._openCameraInfo(value,index)} marker={value.id}>
                        <CameraStream  propsIniciales={this.props.propsIniciales} ref={'camrefgrid'+value.extraData.id} key={value.extraData.id} marker={value}/>
                    </Col>:
                    null
            )}        
        </Row>               
        {this.props.loading?null:
        <Row className={!this.props.showMatches ? "hide-matches paginatorContainerOnGrid2" : "show-matches paginatorContainerOnGrid"}>
            <Col style={{height:'100%'}}>
             Camaras por pagina <Select placeholder='Camaras por pagina' options={countryOptions}  value={this.state.limit} onChange={(e,value)=>{                
                const pageCount = Math.ceil(this.state.markers.length / value.value)
                // console.log("paginas a mostar",pageCount)
                this.setState({start:0,limit:value.value,pageCount:pageCount})
            }}/>
            </Col>
            <Col>
                <ReactPaginate
                    previousLabel={'Anterior'}
                    nextLabel={'Siguiente'}
                    breakLabel={'...'}
                    pageCount={ this.state.pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={this.handlePageClick}

                    containerClassName={'pagination'}
                    subContainerClassName={'pages pagination'}
                    activeClassName={'active'}
                /> 
            </Col>
        </Row>}  
            {this.props.error&&this.state.markers.length===0?<div className="errorContainer">
                Error al cargar informacion: {JSON.stringify(this.props.error)}
            </div>:null}
            <div className={!this.state.autoplay ?
            !this.props.showMatches ? "sin-margin camGridControl showfiles" : "con-margin camGridControl showfiles"
            :
            !this.props.showMatches ? "sin-margin camGridControl" : "con-margin camGridControl"}>
            {/* <div className={!this.props.showMatches ? "hide-matches" : "show-matches"}> */}

        
            <div className='row stiky-top'>
                <div className='col-4'>
                    
                        {this.props.moduleActions?this.props.moduleActions.btnsnap?<Button basic circular  disabled={this.state.photos.length>=5||this.state.loadingSnap||this.state.loadingRcord||this.props.loadingFiles||this.state.restarting||this.state.recordingCams.indexOf(this.state.selectedCamera)>-1}  loading={this.state.loadingSnap} onClick={()=>this._snapShot(this.state.selectedCamera)}><i className='fa fa-camera'></i></Button>:null:null}
                        {/* <Button basic disabled={this.state.loadingSnap||this.state.loadingRcord||this.props.loadingFiles||this.state.restarting||this.state.recordingCams.indexOf(this.state.selectedCamera)>-1} circular onClick={this._playPause}><i className={this.state.isplay?'fa fa-pause':'fa fa-play'}></i></Button> */}
                        {this.props.moduleActions?this.props.moduleActions.btnrecord?<Button basic circular  disabled={this.state.videos.length>=5||this.state.loadingSnap||this.state.loadingRcord||this.props.loadingFiles||this.state.restarting}  loading={this.state.loadingRcord} onClick={()=>this._recordignToggle(this.state.selectedCamera)}><i className={ this.state.recordingCams.indexOf(this.state.selectedCamera)>-1?'fa fa-stop-circle recording':'fa fa-stop-circle'} style={{color:'red'}}></i></Button>:null:null}
                        <Button basic disabled={this.state.loadingSnap||this.state.loadingRcord||this.props.loadingFiles||this.state.restarting||this.state.recordingCams.indexOf(this.state.selectedCamera)>-1} circular onClick={()=>window.open(window.location.href.replace(window.location.pathname,'/') + 'analisis/' + this.state.selectedCamera.id,'_blank','toolbar=0,location=0,directories=0,status=1,menubar=0,titlebar=0,scrollbars=1,resizable=1')}> <i className="fa fa-external-link"></i></Button>
                        <Button basic disabled={this.state.loadingSnap||this.state.loadingRcord||this.props.loadingFiles||this.state.restarting||this.state.recordingCams.indexOf(this.state.selectedCamera)>-1} circular onClick={()=>this.props.downloadFiles(this.state.selectedCamera, {videos:this.state.videos,images:this.state.photos, servidorMultimedia:this.state.servidorMultimedia})} loading={this.props.loadingFiles}> <i className="fa fa-download"></i></Button>
                        <Button basic disabled={this.state.loadingSnap||this.state.loadingRcord||this.props.loadingFiles||this.state.restarting||this.state.recordingCams.indexOf(this.state.selectedCamera)>-1} circular onClick={()=>this.props.makeReport(this.state.selectedCamera)}> <i className="fa fa-warning"></i></Button>
                        {/* <Button basic circular disabled={this.state.loadingSnap||this.state.loadingRcord||this.props.loadingFiles||this.state.restarting||this.state.recordingCams.indexOf(this.state.selectedCamera)>-1} onClick={this._restartCamStream}> <i className={!this.state.restarting?"fa fa-repeat":"fa fa-repeat fa-spin"}></i></Button> */}
                        <Button basic circular onClick={()=>this.props.changeStatus(this.state.selectedCamera)}> <i className="fa fa-exchange"></i></Button>
                        {this.state.selectedCamera.dataCamValue === undefined ? null : this.state.selectedCamera.dataCamValue.tipo_camara === 2 && this.state.selectedCamera.dataCamValue.dns != null ? <i><Button basic circular onClick={() => this.Clicked(this.state.selectedCamera.dataCamValue.dns)}><i className="fa fa-sliders"></i></Button></i> : null}
                </div>
                <div className='col-5'>
                    <b>Camara  {console.log('la camara', this.state.selectedCamera), this.state.selectedCamera.num_cam}</b> {this.state.selectedCamera.name} 
                </div>
                <div className='col-3'>                    
                    <Button onClick={()=>this._openCameraInfo(false)} className='pull-right' primary> { this.state.autoplay?'':'Ocultar controles'} <i className={ this.state.autoplay?'fa fa-chevron-up':'fa fa-chevron-down'}></i></Button>                
                </div>
            </div>
            <div className={!this.state.autoplay?'row showfilesinfocameragrid':'row hidefiles'}>
                <div className="col snapshotsgrid">
                    Fotos
                    <div className="row">
                        {this.state.photos.map((value,index)=><MediaContainer servidorMultimedia={this.state.servidorMultimedia} image value={value} cam={this.state.selectedCamera} reloadData={this._loadFiles} key={index} src={value.relative_url}/>)}
                    </div>
                    {this.state.imageLoading ? 
                            <div><Spinner animation="border" variant="info" role="status" size="xl">
                            <span className="sr-only">Loading...</span>
                            </Spinner></div>:this.state.photos.length === 0 ?
                            <div align='center'>
                             <p className="big-letter">No hay archivos que mostrar</p>
                             <i className='fa fa-image fa-5x'></i>
                            </div>
                            :null}
                </div>
                <div className="col videosgrid">
                    Videos
                    <Tab menu={{ secondary: true, pointing: true }} panes={[
                        { menuItem: 'Actuales', render: () => <Tab.Pane attached={false}><div>
                            <div className="row">
                                {this.state.videos.map((value, index) => <MediaContainer
                                    servidorMultimedia={this.state.servidorMultimedia}
                                    src={value.relative_url} value={value}
                                    cam={this.state.markers[this.state.slideIndex].extraData}
                                    reloadData={this._loadFiles} video key={index} />)}
                            </div>
                            {this.state.videosLoading ? 
                                    <div><Spinner animation="border" variant="info" role="status" size="xl">
                                    <span className="sr-only">Loading...</span>
                                </Spinner></div> :
                                this.state.videos.length < 1 ?
                                <div align='center'>
                                    <p className="big-letter">No hay archivos que mostrar</p>
                                    <i className='fa fa-image fa-5x'></i>
                                </div>:null
                            }

                            </div>
                        </Tab.Pane> },
                                this.props.moduleActions?this.props.moduleActions.viewHistorial?{ menuItem: 'Historico', render: () => <Tab.Pane attached={false}>
                                {this.state.video_history !== null ?
                                    this.state.video_history[0] ?
                                        this.state.video_history[1].map((row,count)=>
                                            <div key={count} className="row">
                                                <div className="col-12">
                                                    <h4>{`${row.videos[0].fecha} - ${row.videos[0].hour}`}</h4>
                                                </div>
                                                    {row.videos.map((e, count) => 
                                                      <MediaContainer
                                                            dns_ip={`http://${this.state.video_history[0]}`}
                                                            hideDelete 
                                                            src={e.exists_video ? e.relative_path_video: '/images/no_video.jpg'}
                                                            flag_video={e.exists_video}
                                                            hour={e.real_hour}
                                                            src_img={e.relative_path_image}
                                                            flag_img={e.exists_image}
                                                            value={e}
                                                            cam={this.state.markers[this.state.slideIndex].extraData}
                                                            reloadData={this._loadFiles}
                                                            video
                                                            key={count}
                                                        />

                                                    )}
                                            </div>
                                            )
                                        :
                                        <div align='center'>
                                            <p className="big-letter">No hay archivos que mostrar111</p>
                                            <i className='fa fa-image fa-5x'></i>
                                        </div>
                                    :
                                    <div align='center'>
                                         {this.state.loading ? 
                                            <div><Spinner animation="border" variant="info" role="status" size="xl">
                                                <span className="sr-only">Loading...</span>
                                                </Spinner></div> :
                                                this.state.videos.length < 1 ?
                                            <div align='center'>
                                            <p className="big-letter">No hay archivos que mostrar</p>
                                            <i className='fa fa-image fa-5x'></i>
                                        </div>:null
                            }
                                    </div>
                                }
                        </Tab.Pane> }:{}:{},
                    ]} />    
                </div>
                <div className="col matchesgrid" align="center">
                    Historial
                    {/*  ---matches reales---
                     {this.state.matches.length>0?this.state.matches.map((value, index)=>
                        {
                            return(<Match key={index} info={value} toggleControls={this._closeControl} />)
                        })
                    :<h4>Sin historial de matches</h4>} */}
                    {/* ---matches planchados */}
                    {this.props.matches?this.props.matches.map((value, index)=>
                        {
                            if(index%this.state.selectedCamera.num_cam!==0)
                                return(null);
                            return(<Match key={index} info={value} toggleControls={this._closeControl} />)
                        })
                    :null}

                </div>
            </div>            
        </div> 
        </div>
    
    
    );
  }

  Clicked = (dns) => {

    window.open("http://" + dns, 'Ficha de Incidencias', 'height=600,width=1200');

}

    _snapShot = (camera) => {
        this.setState({loadingSnap:true})

        conections.snapShotV2(camera.id,this.state.user_id)
            .then(response => {
                // console.log(response)
                this.setState({loadingSnap:false})
                const data = response.data              
                if (data.success) {
                    //console.log('refs',this.refs)
                    this._loadFiles(camera)
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
    
                conections.stopRecordV2({clave:process_id},selectedCamera.id)
                .then((r) => {
                    const response = r.data
                    if (response.success === true) {
    
                        let stateRecordingProcess = this.state.recordingProcess
                        let stateRecordingCams = this.state.recordingCams
                        stateRecordingCams = stateRecordingCams.filter(el => el !== selectedCamera)
                        stateRecordingProcess = stateRecordingProcess.filter(el => el.cam_id !== selectedCamera.id)
                        this.setState({recordingCams:stateRecordingCams, recordingProcess: stateRecordingProcess, isRecording: false,loadingRcord:false,modal:true,recordMessage:response.msg})
                        // console.log(selectedCamera)
                        this._loadFiles(selectedCamera)
                    } else {
                        let stateRecordingProcess = this.state.recordingProcess
                        let stateRecordingCams = this.state.recordingCams
                        stateRecordingCams = stateRecordingCams.filter(el => el !== selectedCamera)
                        stateRecordingProcess = stateRecordingProcess.filter(el => el.cam_id !== selectedCamera.id)
                        this.setState({recordingCams:stateRecordingCams, recordingProcess: stateRecordingProcess, isRecording: false,loadingRcord:false,modal:true,recordMessage:response.msg})
                    }
                })
        } else {
           conections.startRecordV2({},selectedCamera.id)
                .then((r) => {
                    const response = r.data
                    if (response.success === true) {
                        let recordingProcess = {
                            cam_id: selectedCamera.id,
                            process_id: response.clave,
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

                    conections.stopRecord({record_proccess_id:value.process_id }).then(response=>{                        
                        let stateRecordingProcess = this.state.recordingProcess
                        let stateRecordingCams = this.state.recordingCams
                        stateRecordingCams = stateRecordingCams.filter(el => el.id !== value.cam_id)
                        stateRecordingProcess = stateRecordingProcess.filter(el => el.cam_id !== value.cam_id)
                        this.setState({recordingCams:stateRecordingCams, recordingProcess: stateRecordingProcess, isRecording: false,loadingRcord:false})
                        this._loadFiles()
                    })
                }
                return value
            })
        } else {
            clearInterval(this.interval)
            this.setState({interval: null})
        }
    }

    _playPause =() => {          
        let isplaying = this.state.isplaying
        // console.log(isplaying)
        isplaying[this.state.slideIndex] = !isplaying[this.state.slideIndex]                
        // console.log(isplaying)
        this.setState({isplaying:isplaying,isplay:isplaying[this.state.slideIndex]})
        this.refs['camrefgrid'+this.state.selectedCamera.id]._togglePlayPause()
    }

    _refreshComponent = () => {
        this.setState({loading: true})
        setTimeout(() => { 
            this.spinnerif()
          },2500)
          
    }


    _restartCamStream = async () => {
        this.setState({restarting:true})
        await this.refs["camrefgrid"+this.state.selectedCamera.id]._restartCamStream()
        this.setState({restarting:false})
    }


    handlePageClick = data => {
        // console.log(data)
        this.setState({start:data.selected*this.state.limit})
      };
    
    _loadFiles = (cam) => {
        console.log(cam)
        // console.log("LOAD FILE EMPEZO")
        // console.log("CAMMMMMMMM: ", cam?cam.id:this.state.selectedCamera?this.state.selectedCamera.id:0)
        this.setState({
            loading: true,
            videos: [],
            photos: [],
            video_history: null,
            videosLoading: true,
            imageLoading: true
        })
        
        const last_day = DateTime.local()
        .plus({ days: -1 })
        .setZone("America/Mexico_City")
        .toISODate();
        
        const current_day = DateTime.local()
        .setZone("America/Mexico_City")
        .toISODate();
        
        const createArrDate = (arr) => {
            let nuevoObjeto = {};
            arr.forEach((x) => {
                if (!nuevoObjeto.hasOwnProperty(x.fecha)) {
                    nuevoObjeto[x.fecha] = {
                        videos: [],
                    }
                }
                nuevoObjeto[x.fecha].videos.push(x);
            });
            return nuevoObjeto;
        }
        
        const createArrHour = (arr) => {
            let nuevoObjeto = {};
            arr.forEach((x) => {
                if (!nuevoObjeto.hasOwnProperty(x.hour)) {
                    nuevoObjeto[x.hour] = {
                        videos: [],
                    };
                }
                nuevoObjeto[x.hour].videos.push(x);
            });
            return nuevoObjeto;
        };
        // console.log("SELECCTED CAMARA", this.state.selectedCamera)
        // console.log(cam)
        conections.getCamDataHistory(cam.dataCamValue.id, cam.dataCamValue.num_cam)
            .then(response => {
                console.log("HISTORICOS", response)

                let resHistory = response.data
                if(resHistory.data.items.length > 0) {
                    let dns_ip = resHistory.data.dns_ip
                    if(resHistory.success){
                        let dates = createArrDate(resHistory.data.items)
                        let hours_last_day = createArrHour(dates[last_day].videos)
                        let hours_current_day = createArrHour(dates[current_day].videos);
                        this.setState({
                            video_history: [
                                dns_ip,
                                Object.values(hours_last_day)
                                    .reverse()
                                    .concat(Object.values(hours_current_day).reverse()).reverse(),
                            ]
                        });
                        setTimeout(() => {
                            this.spinnerif()
                        }, 400);
                       
                    } else {
                        this.setState({ video_history: null })
                        this.spinnerif()
                    }
                } else {
                    this.setState({ video_history: null })
                    this.spinnerif()
                    
                }
        })

        conections.getCamDataV2(cam?cam.id:this.state.selectedCamera?this.state.selectedCamera.id:0)
            .then(async response => {
                console.log(response)
                this.setState({
                    loadingPhotos: false,
                    videos:response.data.data.files_multimedia.videos,
                    photos:response.data.data.files_multimedia.photos, 
                    servidorMultimedia: 'http://'+ response.data.data.dns_ip
                })
                
                setTimeout(() => {
                    // console.log("VIDEOS SPINNER")
                    this.spinnerif()
                    this.setState({videosLoading: false, imageLoading: false})
                }, 100);
            }).catch(err => {
                console.log(err)
                setTimeout(() => {
                    this.setState({videosLoading: false, imageLoading: false})
                }, 100);
            })
    }


    _openCameraInfo = (marker) => {   
        this.setState({loading: true})
        setTimeout(() => { 
            this.spinnerif()
            },2500)

        if (marker) {
            let index = this.state.markers.indexOf(marker)            
            let recording = false       
            if(this.state.recordingCams.indexOf(marker.extraData)>-1){
                recording = true
            }
            if(this.state.isplaying.length === 0){
                let isp = {}
                this.state.markers.map((value,index)=>{
                    isp[index] = true
                    return true;
                })
                this.setState({isplaying:isp})
            }
        /*  --- matches reales ---  
            this.setState({ matches:[],selectedCamera: marker.extraData, autoplay:false, slideIndex: index, isRecording: recording,isplay:this.state.isplaying[this.state.slideIndex]===undefined?true:this.state.isplaying[this.state.slideIndex]})
            this._loadFiles(marker.extraData)
        } else {
            this.setState({selectedCamera: {}, autoplay:true, videos:[],photos:[], video_history:[], matches:[]})
        }             
        */

        // --- matches forzados
        this.setState({selectedCamera: marker.extraData, autoplay:false, slideIndex: index, isRecording: recording,isplay:this.state.isplaying[this.state.slideIndex]===undefined?true:this.state.isplaying[this.state.slideIndex]})
            this._loadFiles(marker.extraData)
        } else {
            this.setState({selectedCamera: {}, autoplay:true, videos:[],photos:[], video_history:[]})
        } 

    }

    spinnerif = () => {
        if (this.state.loading) {
            setTimeout(() => { 
            this.setState({loading: false})
          },2500)}
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
                   
        /* --- matches reales---
        const pageCount = Math.ceil(markersForLoop.length /this.state.limit)        
        this.setState({markers:markersForLoop,pageCount:pageCount})
        */

        // --- matches forzados ---
        let cameras = []
          for(let item in responseJson.items){
            let suspect = responseJson.items[item]            
            //if(suspect.person_classification !== "Victim"){
              suspect.description = suspect.description.replace(/<p>/g,'').replace(/<\/p>/g,'')                            
              cameras.push(suspect)
            //}
          }               
        const pageCount = Math.ceil(cameras.length /this.state.limit)        
        this.setState({markers:markersForLoop, matches:cameras,pageCount:pageCount})


    }

    componentWillUnmount(){

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
        const pageCount = Math.ceil(markersForLoop.length /state.limit)
        aux.markers= markersForLoop
        aux.pageCount= pageCount
        return aux        
    }
}

export default GridCameraDisplay;
