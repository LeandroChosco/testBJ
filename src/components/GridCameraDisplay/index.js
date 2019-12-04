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
import * as moment from 'moment'

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
        isplay:true
    }

  render() {
    return (
    <div className='gridCameraContainer' align='center'>                
        <Row >     
            {this.state.markers.map((value,index) => 
                (index<this.state.start+this.state.limit)&&index>=this.state.start?
                    <Col className={this.state.selectedCamera === value.extraData?'p-l-0 p-r-0 activeselectedcameragrid camcolgridholder':'p-l-0 p-r-0 camcolgridholder'}  lg={4} sm={6}   key={value.extraData.id} onClick = {() => this._openCameraInfo(value,index)} marker={value.id}>
                        <CameraStream ref={'camrefgrid'+value.extraData.id} key={value.extraData.id} marker={value}/>
                    </Col>:
                    null
            )}        
        </Row>               
        {this.props.loading?null:
        <Row className='paginatorContainerOnGrid'>
            <Col style={{height:'100%'}}>
             Camaras por pagina <Select placeholder='Camaras por pagina' options={countryOptions}  value={this.state.limit} onChange={(e,value)=>{                
                const pageCount = Math.ceil(this.state.markers.length / value.value)
                console.log("paginas a mostar",pageCount)
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
        <div className={!this.state.autoplay?'camGridControl showfiles':'camGridControl'}>
            <div className='row stiky-top'>
                <div className='col-4'>
                    
                        {this.props.moduleActions?this.props.moduleActions.btnsnap?<Button basic circular  disabled={this.state.photos.length>=5||this.props.loadingSnap||this.props.loadingRcord||this.props.loadingFiles||this.state.restarting||this.props.recordingCams.indexOf(this.state.selectedCamera)>-1}  loading={this.props.loadingSnap} onClick={()=>this.props.snapShot(this.state.selectedCamera)}><i className='fa fa-camera'></i></Button>:null:null}
                        {/* <Button basic disabled={this.props.loadingSnap||this.props.loadingRcord||this.props.loadingFiles||this.state.restarting||this.props.recordingCams.indexOf(this.state.selectedCamera)>-1} circular onClick={this._playPause}><i className={this.state.isplay?'fa fa-pause':'fa fa-play'}></i></Button> */}
                        {this.props.moduleActions?this.props.moduleActions.btnrecord?<Button basic circular  disabled={this.state.videos.length>=5||this.props.loadingSnap||this.props.loadingRcord||this.props.loadingFiles||this.state.restarting}  loading={this.props.loadingRcord} onClick={()=>this.props.recordignToggle(this.state.selectedCamera)}><i className={ this.props.recordingCams.indexOf(this.state.selectedCamera)>-1?'fa fa-stop-circle recording':'fa fa-stop-circle'} style={{color:'red'}}></i></Button>:null:null}
                        <Button basic disabled={this.props.loadingSnap||this.props.loadingRcord||this.props.loadingFiles||this.state.restarting||this.props.recordingCams.indexOf(this.state.selectedCamera)>-1} circular onClick={()=>window.open(window.location.href.replace(window.location.pathname,'/') + 'analisis/' + this.state.selectedCamera.id,'_blank','toolbar=0,location=0,directories=0,status=1,menubar=0,titlebar=0,scrollbars=1,resizable=1')}> <i className="fa fa-external-link"></i></Button>
                        <Button basic disabled={this.props.loadingSnap||this.props.loadingRcord||this.props.loadingFiles||this.state.restarting||this.props.recordingCams.indexOf(this.state.selectedCamera)>-1} circular onClick={()=>this.props.downloadFiles(this.state.selectedCamera, {videos:this.state.videos,images:this.state.photos})} loading={this.props.loadingFiles}> <i className="fa fa-download"></i></Button>
                        <Button basic disabled={this.props.loadingSnap||this.props.loadingRcord||this.props.loadingFiles||this.state.restarting||this.props.recordingCams.indexOf(this.state.selectedCamera)>-1} circular onClick={()=>this.props.makeReport(this.state.selectedCamera)}> <i className="fa fa-warning"></i></Button>
                        {/* <Button basic circular disabled={this.props.loadingSnap||this.props.loadingRcord||this.props.loadingFiles||this.state.restarting||this.props.recordingCams.indexOf(this.state.selectedCamera)>-1} onClick={this._restartCamStream}> <i className={!this.state.restarting?"fa fa-repeat":"fa fa-repeat fa-spin"}></i></Button> */}
                        <Button basic circular onClick={()=>this.props.changeStatus(this.state.selectedCamera)}> <i className="fa fa-exchange"></i></Button>
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
                        {this.state.photos.map((value,index)=><MediaContainer image value={value} cam={this.state.selectedCamera} reloadData={this._loadFiles} key={index} src={value.relative_url}/>)}
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

                                        {row.videos.map((value,index)=><MediaContainer dns_ip={'http://'+this.state.video_history.dns_ip} hideDelete src={value.RecordProccessVideo.relative_path_file} value={value} cam={this.state.markers[this.state.slideIndex].extraData} reloadData={this._loadFiles} video key={index} />)}                                        
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
                <div className="col matchesgrid" align="center">
                    Historial
                    {this.state.matches.length>0?this.state.matches.map((value, index)=>
                        {
                            return(<Match key={index} info={value} toggleControls={this._closeControl} />)
                        })
                    :<h4>Sin historial de matches</h4>}
                </div>
            </div>            
        </div> 
    </div>
    );
  }

    

    _playPause =() => {          
        let isplaying = this.state.isplaying
        console.log(isplaying)
        isplaying[this.state.slideIndex] = !isplaying[this.state.slideIndex]                
        console.log(isplaying)
        this.setState({isplaying:isplaying,isplay:isplaying[this.state.slideIndex]})
        this.refs['camrefgrid'+this.state.selectedCamera.id]._togglePlayPause()
    }

    _restartCamStream = async () => {
        this.setState({restarting:true})
        await this.refs["camrefgrid"+this.state.selectedCamera.id]._restartCamStream()
        this.setState({restarting:false})
    }


    handlePageClick = data => {
        console.log(data)
        this.setState({start:data.selected*this.state.limit})
      };

    _loadFiles = (cam) =>{
        conections.getCamData(cam?cam.id:this.state.selectedCamera?this.state.selectedCamera.id:0)
        .then(response => {
            const data = response.data
            console.log(data)
            this.setState({videos:data.data.videos,photos:data.data.photos,video_history:data.data.videos_history})
        })  
        conections.getCamDataHistory(cam?cam.id:this.state.selectedCamera?this.state.selectedCamera.id:0)
        .then(response => {
            let resHistory = response.data
              console.log('history', resHistory)
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
                console.log(items)
                resHistory.data.items = items
                
                this.setState({video_history:resHistory.data})
    
              }
        }) 
        conections.getCamMatches(cam?cam.num_cam:this.state.selectedCamera?this.state.selectedCamera.num_cam:0).then(response=>{
            if (response.status === 200) {
                this.setState({matches:response.data})
            }
        })
    }


    _openCameraInfo = (marker) => {   
        if (marker) {
            let index = this.state.markers.indexOf(marker)            
            let recording = false       
            if(this.props.recordingCams.indexOf(marker.extraData)>-1){
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
            this.setState({selectedCamera: marker.extraData, autoplay:false, slideIndex: index, isRecording: recording,isplay:this.state.isplaying[this.state.slideIndex]===undefined?true:this.state.isplaying[this.state.slideIndex]})
            this._loadFiles(marker.extraData)
        } else {
            this.setState({selectedCamera: {}, autoplay:true, videos:[],photos:[], video_history:[]})
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
        const pageCount = Math.ceil(markersForLoop.length /this.state.limit)        
        this.setState({markers:markersForLoop,pageCount:pageCount})
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