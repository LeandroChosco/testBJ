import React, { Component } from 'react';
import { Card, Row, Col } from 'react-bootstrap'
import './style.css'
import MediaContainer from '../MediaContainer';
import Axios from 'axios'
import constants from '../../constants/constants'
import { Button } from 'semantic-ui-react';

import JSZipUtils from 'jszip-utils'
import JSZip from 'jszip'
import saveAs from 'file-saver'

class CameraStream extends Component {
    state= {
        cameraID:'',
        cameraName:'',
        data:{},
        webSocket: null,
        player: null,
        showData:false,
        photos:[],
        videos:[],
        display:'auto',
        interval: null,
        isLoading:false,
        isRecording:false,
        process_id: 0,
        loadingSnap:false,
        loadingFiles:false
    }

    render() {

        return (
            <Card style={{display:this.state.display}}>                    
                {this.props.horizontal?
                    <Card.Body>
                                
                        <Card.Title>Camara {this.state.num_cam}</Card.Title>
                        <Card.Text>
                            <Row>
                                <Col lg={6}>
                                    <div className="camHolder">  
                                        <canvas id={'camcanvasstreamer'+this.state.cameraID} ref="camRef" style={{width:'100%',height:this.props.height?this.props.height:'100%'}}></canvas>                      
                                    </div>
                                </Col>
                                <Col lg={6}>
                                    {this.state.cameraName}
                                </Col>
                            </Row>
                        </Card.Text>
                        {this.props.showButtons?
                            <Card.Footer>
                                <Button variant="outline-secondary"><i className='fa fa-camera'></i></Button>
                                <Button variant="outline-secondary"><i className='fa fa-pause'></i></Button>
                                <Button variant="outline-secondary"><i className='fa fa-square'></i></Button>
                                <Button variant="outline-secondary"><i className='fa fa-repeat'></i></Button>
                            </Card.Footer>:
                        null}
                    </Card.Body>:
                    <Card.Body>                                                                          
                        <Card.Title>
                            <div align='left'><i className='fa fa-video-camera'></i>  Camara {this.state.num_cam}</div>
                        </Card.Title>
                        {this.state.showData?
                        <div className="row dataHolder p10">
                            <div className="col snapshots">
                                Fotos
                                <div className="row">
                                    {this.state.photos.map((value,index)=><MediaContainer src={'http://18.222.106.238:4000/'+value.relative_url} image key={index} />)}
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
                                <div className="row">
                                    {this.state.videos.map((value,index)=><MediaContainer src={'http://18.222.106.238:4000/'+value.relative_url} video key={index} />)}
                                </div>
                                {this.state.videos.length === 0 ?
                                    <div align='center'>
                                    <p className="big-letter">No hay archivos que mostrar</p>
                                    <i className='fa fa-image fa-5x'></i>
                                    </div>
                                    :null}
                            </div>
                        </div>:null} 
                        <div className={this.state.showData?"camHolder hideCamHolder":"camHolder"}>  
                                <canvas ref="camRef" style={{width:'100%',height:'100%'}}></canvas>                      
                        </div> 
                        <div align='left'>{this.state.cameraName}</div>                        
                        {this.props.showButtons?
                            <Card.Footer>
                                <Button basic loading={this.state.loadingSnap} onClick={this._snapShot}><i className='fa fa-camera'></i></Button>
                                <Button basic><i className='fa fa-pause'></i></Button>
                                <Button basic loading={this.state.isLoading} onClick={() => this.recordignToggle()}><i className={ this.state.isRecording?'fa fa-stop-circle recording':'fa fa-stop-circle'} style={{color:'red'}}></i></Button>            
                                <Button basic loading={this.state.loadingFiles} onClick={() => this._downloadFiles()}><i className='fa fa-download'></i></Button>            
                                {this.props.hideFileButton?null:<Button className="pull-right" variant="outline-secondary" onClick={()=>this.setState({showData:!this.state.showData})}><i className={this.state.showData?'fa fa-video-camera':'fa fa-list'}></i></Button>}
                                {this.props.showExternal?<Button basic onClick={()=>window.open(window.location.href.replace(window.location.pathname,'/') + 'analisis/' + this.state.data.id,'_blank','toolbar=0,location=0,directories=0,status=1,menubar=0,titlebar=0,scrollbars=1,resizable=1')}> <i class="fa fa-external-link"></i></Button>:null}
                            </Card.Footer>:
                        null}
                    </Card.Body>   

                }
                {this.props.showFilesBelow?
                        <div className="row dataHolder p10">
                            <div className="col snapshots">
                                Fotos
                                <div className="row">
                                    {this.state.photos.map((value,index)=><MediaContainer src={'http://18.222.106.238:4000/'+value.relative_url} image key={index} />)}
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
                                <div className="row">
                                    {this.state.videos.map((value,index)=><MediaContainer src={'http://18.222.106.238:4000/'+value.relative_url} video key={index} />)}
                                </div>
                                {this.state.videos.length === 0 ?
                                    <div align='center'>
                                    <p className="big-letter">No hay archivos que mostrar</p>
                                    <i className='fa fa-image fa-5x'></i>
                                    </div>
                                    :null}
                            </div>
                        </div>:null} 
            </Card>
        );
    } 


    recordignToggle = () => {
        if(this.state.isRecording){
            
            this.setState({isLoading:true})
            Axios.put(constants.base_url + ':' + constants.apiPort + '/control-cams/stop-record/' + this.state.data.id,
                {
                    record_proccess_id:this.state.process_id 
                })
                .then((r) => { 
                    const response = r.data
                    if (response.success === true) {
                        this.setState({isRecording:false,isLoading:false})                        
                        this._loadFiles()
                    }
                })
        } else {
           Axios.post(constants.base_url + ':' + constants.apiPort + '/control-cams/start-record/' + this.state.data.id,{                                       
            })
                .then((r) => { 
                    const response = r.data
                    if (response.success === true) {
                        this.setState({isRecording:true,process_id:response.id_record_proccess})                        
                        
                    }
                })
        }
    }
  componentDidMount(){      
      this.setState({cameraName:this.props.marker.title,num_cam:this.props.marker.extraData.num_cam,cameraID:this.props.marker.extraData.id,data:this.props.marker.extraData, onEnded:this._playerError})
      
      try{
          var ws = new WebSocket(this.props.marker.extraData.webSocket)          
      } catch (err) {
        this._wsError(err)
      }
      try {
        var p = new window.jsmpeg(ws, {canvas:this.refs.camRef, autoplay:true,audio:false,loop: true, onEnded:this._endedPlay, onStalled:this._playerError});
      } catch (err) {
          this._playerError(err)
      }
           
      this.setState({
          webSocket: ws,
          player: p,
      })      
      if (this.props.height) {
          if (this.refs.camRef.getBoundingClientRect().width === 0) {
            this.refs.camRef.style.height = (window.visualViewport.width - 50 ) * this.props.height+'px'  
          } else {
            this.refs.camRef.style.height = this.refs.camRef.getBoundingClientRect().width * this.props.height+'px'   
          }        
      }
      if(this.props.showButtons){
          this._loadFiles()
      }
  }


  _endedPlay = (data) => {
      console.log('play ended', data)
  }

  _snapShot = () => {
      this.setState({loadingSnap:true})
    if (this.state.data.id) {
        Axios.post(constants.base_url + ':' + constants.apiPort + '/control-cams/screenshot/' + this.state.data.id)
            .then(response => {
                this.setState({loadingSnap:false})
                const data = response.data
                console.log(data)
                if (data.success) {
                    this._loadFiles()
                }
            }) 
    } else {
        Axios.post(constants.base_url + ':' + constants.apiPort + '/control-cams/screenshot/' + this.props.marker.extraData.id)
            .then(response => {
                this.setState({loadingSnap:false})
                const data = response.data
                console.log(data)
                if (data.success) {
                    this._loadFiles()
                }
            })         
    } 
  }

  _loadFiles = () =>{            
    if (this.state.data.id) {
        Axios.get(constants.base_url + ':' + constants.apiPort + '/cams/' + this.state.data.id + '/data')
            .then(response => {
                const data = response.data
                console.log(data)
                this.setState({videos:data.data.videos,photos:data.data.photos})
            }) 
    } else {
        Axios.get(constants.base_url + ':' + constants.apiPort + '/cams/' + this.props.marker.extraData.id + '/data')
            .then(response => {
                const data = response.data
                console.log(data)
                this.setState({videos:data.data.videos,photos:data.data.photos})
            })         
    }     
          
}

  _wsError = (err) => {
    console.log('websocket error',err)
    this.setState({display:'none'})
    setTimeout(this.tryRconection,1000)
  }

  
  tryRconection = () => {
    try{
        var ws = new WebSocket(this.props.marker.extraData.webSocket)          
        var p = new window.jsmpeg(ws, {canvas:this.refs.camRef, autoplay:true,audio:false,loop: true});       
        this.setState({
            webSocket: ws,
            player: p
        })          
    } catch (err) {
      this._wsError(err)
    }           
  }

  _wsMessage = (msg) => {
    console.log('websock message',msg)
  }

  _playerError = (err) => {
    console.log('player error',err)
  }

    componentWillUnmount(){
        this.state.player.stop()
        this.state.webSocket.close()
        if (this.state.isRecording) {
            Axios.put(constants.base_url + ':' + constants.apiPort + '/control-cams/stop-record/' + this.state.data.id,
                {
                    record_proccess_id:this.state.process_id 
                })
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

    _downloadFiles = () => {
        this.setState({loadingFiles:true})        
        var zip = new JSZip();
        var imgs = zip.folder('images')
        this.state.photos.forEach((url)=>{
            var filename = url.name;
            imgs.file(filename, this.urlToPromise(constants.base_url + ':' + constants.apiPort + '/' + url.relative_url ), {binary:true});
        });
        var vds = zip.folder('videos')
        this.state.videos.forEach((url)=>{
            var filename = url.name;
            vds.file(filename, this.urlToPromise(constants.base_url + ':' + constants.apiPort + '/' + url.relative_url ), {binary:true});
        });
        zip.generateAsync({type:"blob"}).then((content) => {
            // see FileSaver.js
            this.setState({loadingFiles:false})
            saveAs(content, "cam_"+this.state.data.num_cam+".zip");  
                      
        });
    } 
}
export default CameraStream;