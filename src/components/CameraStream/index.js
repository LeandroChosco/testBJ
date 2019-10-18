import React, { Component } from 'react';
import { Card, Row, Col, Modal } from 'react-bootstrap'
import './style.css'
import MediaContainer from '../MediaContainer';
import constants from '../../constants/constants'
import conections from '../../conections'
import { Button, Form, Label, TextArea, Radio, Tab } from 'semantic-ui-react';
import Chips from 'react-chips'

import JSZipUtils from 'jszip-utils'
import JSZip from 'jszip'
import saveAs from 'file-saver'
import jsmpeg from 'jsmpeg';
import * as moment from 'moment';

var vis = (function(){
    var stateKey, eventKey, keys = {
        hidden: "visibilitychange",
        webkitHidden: "webkitvisibilitychange",
        mozHidden: "mozvisibilitychange",
        msHidden: "msvisibilitychange"
    };
    for (stateKey in keys) {
        if (stateKey in document) {
            eventKey = keys[stateKey];
            break;
        }
    }
    return function(c) {
        if (c) document.addEventListener(eventKey, c);
        return !document[stateKey];
    }
})();
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
        video_history:[],
        display:'auto',
        interval: null,
        isLoading:false,
        isRecording:false,
        process_id: 0,
        loadingSnap:false,
        loadingFiles:false,
        tryReconect: false,
        recordMessage:'',
        modal:false,
        lastCurrentTime:0,
        lastCurrentFrame:0,
        isVisible: true,
        isPlay:true,
        worker:null,
        modalProblem:false,
        problemDescription:'',
        typeReport:1,
        phones:[],
        mails:[],
        restarting: false
    }

    lastDecode= null
    tryReconect= false
    render() {
        if (this.props.marker.extraData.isIframe) {
            return(
                <Card style={{display:this.state.display}}> 
                    <Card.Title>
                        <div align='left'><i className='fa fa-video-camera'></i>  Camara {this.props.marker.extraData.num_cam}</div>
                    </Card.Title>
                    {/*<iframe onLoad={this.loaded} id={'the-iframe'+this.props.marker.extraData.id} src={this.props.marker.extraData.url} style={{width:'100%',height:'100%'}}/>*/}
                    <div style={{padding:10}}>
                        <video  autoplay id="videoElement"/>
                    </div>
                    <div align='left'>{this.props.marker.extraData.name}</div>
                </Card>
            )
        }
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
                        {this.props.hideTitle?null:<Card.Title>
                            <div align='left'><i className='fa fa-video-camera'></i>  Camara {this.state.num_cam}</div>
                        </Card.Title>}
                        {this.state.showData?
                        <div className="row dataHolder p10">
                            <div className="col snapshots">
                                Fotos
                                <div className="row">
                                    {this.state.photos.map((value,index)=><MediaContainer src={value.relative_url} value={value} cam={this.state.data} reloadData={this._loadFiles} image key={index} />)}
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
                                            {this.state.videos.map((value,index)=><MediaContainer src={value.relative_url} value={value} cam={this.state.data} reloadData={this._loadFiles} video key={index} />)}
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
                                        <div className="row">
                                        {this.state.video_history.items.map((row,index)=>
                                                <div className="col-12" align='center' key={index}>
                                                    <div className='row'>
                                                        <div className='col'><h5>{row.fecha}</h5></div>
                                                    </div>
                                                    <div className="row">
                                                        {row.videos.map((value,i)=><MediaContainer dns_ip={'http://'+this.state.video_history.dns_ip} hideDelete src={value.RecordProccessVideo.relative_path_file} value={value} cam={this.state.data} reloadData={this._loadFiles} video key={i} />)}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        {this.state.video_history.length === 0 ?
                                            <div align='center'>
                                                <p className="big-letter">No hay archivos que mostrar</p>
                                                <i className='fa fa-image fa-5x'></i>
                                            </div>
                                        :null}
                                    </Tab.Pane> }:{}:{},
                                ]} />
                            </div>
                        </div>:null} 
                        <div className={this.state.showData?"camHolder hideCamHolder":"camHolder"} style={{width:'100%'}} align='center'>
                            <div ref="camHolder" style={{width:'100%', height:'100%'}}>  
                                    <canvas ref="camRef" id={'canvasCamaraStream'+this.state.data.id} style={{width:'100%',height:'100%'}}></canvas>                      
                                    {this.state.tryReconect?'Reconectando...':null}
                            </div> 
                        </div>
                        {this.props.hideText?null:<div align='left'>{this.state.cameraName}</div>}
                        {this.props.showButtons?
                            <Card.Footer>
                                {this.props.moduleActions?this.props.moduleActions.btnsnap?<Button basic disabled={this.state.photos.length>=5||this.state.loadingSnap||this.state.isLoading||this.state.isRecording||this.state.restarting||this.state.loadingFiles} loading={this.state.loadingSnap} onClick={this._snapShot}><i className='fa fa-camera'></i></Button>:null:null}
                                <Button basic disabled={this.state.loadingSnap||this.state.isLoading||this.state.isRecording||this.state.restarting||this.state.loadingFiles} onClick={this._togglePlayPause}><i className={this.state.isPlay?'fa fa-pause':'fa fa-play'}></i></Button>
                                {this.props.moduleActions?this.props.moduleActions.btnrecord?<Button basic disabled={this.state.videos.length>=5||this.state.loadingSnap||this.state.isLoading||this.state.restarting||this.state.loadingFiles} loading={this.state.isLoading} onClick={() => this.recordignToggle()}><i className={ this.state.isRecording?'fa fa-stop-circle recording':'fa fa-stop-circle'} style={{color:'red'}}></i></Button>:null:null}
                                <Button basic disabled={this.state.loadingFiles||this.state.loadingSnap||this.state.isLoading||this.state.restarting} loading={this.state.loadingFiles} onClick={() => this._downloadFiles()}><i className='fa fa-download'></i></Button>            
                                {this.props.hideFileButton?null:<Button className="pull-right" variant="outline-secondary" onClick={()=>this.setState({showData:!this.state.showData})}><i className={this.state.showData?'fa fa-video-camera':'fa fa-list'}></i></Button>}
                                {this.props.showExternal?<Button basic disabled={this.state.loadingSnap||this.state.isLoading||this.state.isRecording||this.state.restarting||this.state.loadingFiles} onClick={()=>window.open(window.location.href.replace(window.location.pathname,'/') + 'analisis/' + this.state.data.id,'_blank','toolbar=0,location=0,directories=0,status=1,menubar=0,titlebar=0,scrollbars=1,resizable=1')}> <i className="fa fa-external-link"></i></Button>:null}
                                <Button basic disabled={this.state.loadingSnap||this.state.isLoading||this.state.isRecording||this.state.restarting||this.state.loadingFiles} onClick={()=>this.setState({modalProblem:true})}> <i className="fa fa-warning"></i></Button>
                                <Button basic disabled={this.state.loadingSnap||this.state.isLoading||this.state.isRecording||this.state.restarting||this.state.loadingFiles} onClick={this._restartCamStream}> <i className={!this.state.restarting?"fa fa-repeat":"fa fa-repeat fa-spin"}></i></Button>
                            </Card.Footer>:
                        null}
                    </Card.Body>   

                }
                {this.props.showFilesBelow?
                        <div className="row dataHolder p10">
                            <div className="col snapshots">
                                Fotos
                                <div className="row">
                                    {this.state.photos.map((value,index)=><MediaContainer src={value.relative_url} value={value} cam={this.state.data} reloadData={this._loadFiles} image key={index} />)}
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
                                            {this.state.videos.map((value,index)=><MediaContainer src={value.relative_url} value={value} cam={this.state.data} reloadData={this._loadFiles} video key={index} />)}
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
                                        <div className="row">
                                        {this.state.video_history.items.map((row,index)=>
                                                <div className="col-12" align='center' key={index}>
                                                    <div className='row'>
                                                        <div className='col'><h5>{row.fecha}</h5></div>
                                                    </div>
                                                    <div className="row">
                                                        {row.videos.map((value,i)=><MediaContainer dns_ip={'http://'+this.state.video_history.dns_ip} hideDelete src={value.RecordProccessVideo.relative_path_file} value={value} cam={this.state.data} reloadData={this._loadFiles} video key={i} />)}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        {this.state.video_history.length === 0 ?
                                            <div align='center'>
                                                <p className="big-letter">No hay archivos que mostrar</p>
                                                <i className='fa fa-image fa-5x'></i>
                                            </div>
                                        :null}
                                    </Tab.Pane>}:{}:{},
                                ]} />
                            </div>
                        </div>:null} 
                        <Modal size="lg" show={this.state.modal} onHide={()=>this.setState({modal:false})}>
                            <Modal.Header closeButton>                      
                                
                            </Modal.Header>
                            <Modal.Body>
                                {this.state.recordMessage}
                            </Modal.Body>
                        </Modal>

                        <Modal size="lg" show={this.state.modalProblem} onHide={()=>this.setState({modalProblem:false,problemDescription:'',phones:[],mails:[]})}>
                            <Modal.Header closeButton>                      
                            Reportar problema en camara {this.state.data.num_cam}
                            </Modal.Header>
                            <Modal.Body>
                                <Form>
                                    <Form.Field>

                                        <Form.Field>
                                            <Radio
                                                label='Reportar emergencia'
                                                name='typeReport'
                                                value={1}
                                                checked={this.state.typeReport === 1} 
                                                onChange={this.handleChange}
                                            />
                                        </Form.Field>
                                        <Form.Field>
                                            <Radio
                                                label='Mantenimiento de camara'
                                                name='typeReport'
                                                value={2}
                                                checked={this.state.typeReport === 2}
                                                onChange={this.handleChange}
                                            />
                                        </Form.Field>                                  
                                    </Form.Field>
                                    {this.state.typeReport === 2?null:<Form.Field>
                                        <Label>
                                            Se notificara a los numeros de emergencia registrados. Si se desea agregar un telefono extra ingreselo aqui indicando la lada del mismo(+525512345678).                                
                                        </Label>
                                        <Chips
                                            value={this.state.phones}
                                            onChange={this.onChange}
                                            fromSuggestionsOnly={false}   
                                            createChipKeys={[' ',13,32]}                                 
                                        />
                                    </Form.Field>}
                                    {this.state.typeReport === 2?null:<Form.Field>
                                        <Label>
                                            Se notificara a los emails de emergencia registrados. Si se desea agregar un email extra ingreselo aqui.                                
                                        </Label>
                                        <Chips
                                            value={this.state.mails}
                                            onChange={this.onChangeMail}
                                            fromSuggestionsOnly={false}   
                                            createChipKeys={[' ',13,32]}                                 
                                        />
                                    </Form.Field>}
                                    <Form.Field>
                                        {this.state.typeReport === 2?<Label>
                                            Se lo mas claro posible, indique si ha realizado 
                                            alguna accion para intentar resolver el problema.
                                        </Label>:<Label>
                                           Indique la emergencia que se presento en la camara.
                                        </Label>}
                                        <TextArea 
                                            value={this.state.problemDescription} 
                                            onChange={this.handleChange} 
                                            rows={10} 
                                            name = 'problemDescription'
                                            placeholder='Redacte aqui su problema' 
                                        />                                    
                                    </Form.Field>
                                </Form>
                                <Button className='pull-right' primary onClick={this._sendReport}>Enviar</Button>
                            </Modal.Body>
                        </Modal>
            </Card>
        );
    } 

    loaded = () => {
        console.log('loaded i frame')
        var iframe = document.getElementById('the-iframe'+this.props.marker.extraData.id);
        var style = document.createElement('style');
        style.textContent =
        'video {' +
        '  width: 100%;' +
        '  heigth: 100%;' +
        '}' 
        ;
        console.log(iframe.children)
        //iframe.contentDocument.head.appendChild(style);
    }

    onChange = chips => {
        this.setState({ phones:chips });
      }
      onChangeMail = chips => {
        this.setState({ mails:chips });
      }

    handleChange = (e, { name, value }) => this.setState({ [name]: value })

    _sendReport = () => {
        console.log(this.state.cameraProblem)
        this.setState({modalProblem:false})
        conections.sendTicket({
          "camera_id": this.state.data.id,
          "problem": this.state.problemDescription,
          "user_id": 1,
          "phones":this.state.phones.join(),
          "mails":this.state.mails.join(),
          "type_report":this.state.typeReport,          
        })
            .then(response => {              
                const data = response.data              
                this.setState({problemDescription:''})
                if (data.success) {
                  alert('Ticket creado correctamente')
                } else {
                  alert('Error al crear ticket')
                  console.log(data.error)
                }
            }) 
    }

    _togglePlayPause = () => {
        if (this.state.isPlay) {
            this.state.player.stop()
        } else {
            this.state.player.stop()                            
            if (this.state.webSocket) {
                this.state.webSocket.close()
            }
            this.tryRconection()
        }
        this.setState({isPlay:!this.state.isPlay})
    }

    recordignToggle = () => {
        if(this.state.isRecording){
            
            this.setState({isLoading:true})
            conections.stopRecord({
                record_proccess_id:this.state.process_id 
            },this.state.data.id)           
                .then((r) => { 
                    const response = r.data
                    console.log(response)
                    if (response.success === true) {
                        this.setState({isRecording:false,isLoading:false,modal:true,recordMessage:response.msg})                        
                        this._loadFiles()
                    } else {
                        this.setState({isRecording:false,isLoading:false,modal:true,recordMessage:response.msg})                        
                    }
                })
        } else {
            conections.startRecord({},this.state.data.id)
                .then((r) => { 
                    const response = r.data
                    if (response.success === true) {
                        this.setState({isRecording:true,process_id:response.id_record_proccess})                        
                        
                    }
                })
        }
    }
  componentDidMount(){      
      if (this.props.marker.extraData === undefined) {
          return false
      }
      if(this.props.marker.extraData.isIframe){
          console.log('is iframe')   
          if (window.flvjs.isSupported()) {
            setTimeout(()=>{
                var videoElement = document.getElementById('videoElement');
                videoElement.muted = true;
                videoElement.play();
                videoElement.controls= true;
                var flvPlayer = window.flvjs.createPlayer({
                    type: 'flv',
                    url: 'ws://wellkeeper.us:8000/live/mex.flv'
                });
                flvPlayer.attachMediaElement(videoElement);
                flvPlayer.load();
                flvPlayer.play();                
            },1000)
        }               
        return true;
      }
      this.setState({cameraName:this.props.marker.title,num_cam:this.props.marker.extraData.num_cam,cameraID:this.props.marker.extraData.id,data:this.props.marker.extraData})               
      try{
          var ws = new WebSocket(this.props.marker.extraData.webSocket)
          ws.onerror = this._wsError
          ws.onclose = function() {}                 
      } catch (err) {
        this._wsError(err)
      }
      try {
        var p = new jsmpeg(ws, {canvas:this.refs.camRef, autoplay:true,audio:false,loop: true, onload:this._endedPlay, /*ondecodeframe:this._decode,*/onfinished:this._endedPlay,disableGl:true,forceCanvas2D: true});
        let interval = setInterval(this._checkIsUp,60000)  
        this.setState({interval: interval})
      } catch (err) {
          this._playerError(err)
      }
           
      this.setState({
          webSocket: ws,
          player: p,
      })     
      if (this.props.width) {
        if (this.refs.camRef.getBoundingClientRect().width === 0) {
          this.refs.camHolder.style.width = window.visualViewport.width  * this.props.width+'px'  
        } else {
          this.refs.camHolder.style.width = this.refs.camRef.getBoundingClientRect().width * this.props.width+'px'   
        }        
    }
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
      vis(this._isVisisbleChange)
      window.addEventListener('restartCamEvent', this._restartCam, false)
  }




  _isVisisbleChange = () => {    
      this.setState({isVisible:vis()})
  }

  _endedPlay = (data) => {
      console.log('play ended', data)
  }

  _checkIsUp = () => {            
    if (this.state.lastCurrentTime === this.state.player.currentTime || this.state.lastCurrentFrame===this.state.player.currentFrame) {
        if (!this.tryReconect&&this.state.isVisible) {
            this.setState({tryReconect:true})
            this.tryReconect = true
            console.log('is delay, cam' + this.state.data.num_cam)                
            this.state.player.stop()                            
            if (this.state.webSocket) {
                this.state.webSocket.close()
            }
            this.tryRconection()

        }
    }
    this.setState({lastCurrentTime:this.state.player.currentTime,lastCurrentFrame:this.state.player.currentFrame})
    

  }

  _snapShot = () => {
      this.setState({loadingSnap:true})
      conections.snapShot(this.state.data.id?this.state.data.id:this.props.marker.extraData.id)
        .then(response => {
            this.setState({loadingSnap:false})
            const data = response.data
            console.log(data)
            if (data.success) {
                this._loadFiles()
            }
        })    

  }

  _loadFiles = () =>{  
      conections.getCamData(this.state.data.id?this.state.data.id:this.props.marker.extraData.id)   
      .then(response => {
        const data = response.data
        console.log(data)
        this.setState({videos:data.data.videos,photos:data.data.photos,video_history:data.data.videos_history})
    })      
    conections.getCamDataHistory(this.state.data.id?this.state.data.id:this.props.marker.extraData.id).then(response => {
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
            console.log('videos historicos',resHistory.data)
            this.setState({video_history:resHistory.data})

  		}
    })     
}

  _wsError = (err) => {
    //console.log('websocket error',err)
    //this.setState({display:'none'})
    //setTimeout(this.tryRconection,30000)
    this.setState({tryReconect:false})  
    this.tryReconect = false
  }

  
  tryRconection = () => {
    try{
        var ws = new WebSocket(this.props.marker.extraData.webSocket)          
        ws.onerror = this._wsError  
        ws.onclose = function() {}                         
        var p = new jsmpeg(ws, {canvas:this.refs.camRef, autoplay:true,audio:false,loop: true, onload:this._endedPlay/*, ondecodeframe:this._decode*/,onfinished:this._endedPlay,disableGl:true,forceCanvas2D: true});
        this.setState({
            webSocket: ws,
            player: p
        })   
        this.setState({tryReconect:false})  
        this.tryReconect = false
    } catch (err) {
      this._wsError(err)
    }           
  }

    _restartCam = () => {
        if (!this.tryReconect&&this.state.isVisible) {
            this.setState({tryReconect:true})
            this.tryReconect = true
            console.log('reconnecting, cam ' + this.state.data.num_cam)                
            this.state.player.stop()  
            if(this.state.player.destroy){
                this.state.player.destroy()  
            }                          
            if (this.state.webSocket) {
                this.state.webSocket.close()
            }
            setTimeout(this.tryRconection,5000)            

        }
    }

  _wsMessage = (msg) => {
    console.log('websock message',msg)
  }

  _playerError = (err) => {
    console.log('player error',err)
  }

    componentWillUnmount(){       
        if(this.state.player)
            this.state.player.stop()
        if(this.state.webSocket)
        {
            this.state.webSocket.close()
        }
        if (this.state.isRecording) {
            conections.stopRecord({record_proccess_id:this.state.process_id },this.state.data.id)            
        }
        clearInterval(this.state.interval)
        window.removeEventListener('restartCamEvent', this._restartCam, false)
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

    _restartCamStream = async () => {
        const dns = this.state.data.webSocket.split(':')[1]        
        this.setState({restarting:true})
        try{
            const response= await conections.restartOneStream(dns, this.state.data.id) 
            this.setState({restarting:false})
            this._restartCam()
            console.log(response)
            if(response.status === 200) {
                if (!response.data.success) {
                    alert("Error al reiniciar camara")
                }
            }
            return true
        }catch(err){
            this._restartCam()
            this.setState({restarting:false})
            alert("Error al reiniciar camara")
            console.log(err)
            return false
        }
    }
}
export default CameraStream;