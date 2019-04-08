import React, { Component } from 'react';
import { Card, Button, Row, Col } from 'react-bootstrap'
import filesJson from '../../assets/json/files.json'
import './style.css'
import MediaContainer from '../MediaContainer';

class CameraStream extends Component {
    state= {
        cameraID:'',
        cameraName:'',
        data:{},
        webSocket: null,
        player: null,
        showData:false,
        photos:[],
        videos:[]
    }

    render() {

        return (
            <Card>                    
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
                                    {this.state.photos.map(value=><MediaContainer src={'http://18.222.106.238:4000/'+value} IMAGE key={value} />)}
                                </div>
                            </div>
                            <div className="col videos">
                                Videos
                                <div className="row">
                                    {this.state.videos.map(value=><MediaContainer src={'http://18.222.106.238:4000/'+value} video key={value} />)}
                                </div>
                            </div>
                        </div>:null} 
                        <div className={this.state.showData?"camHolder hideCamHolder":"camHolder"}>  
                                <canvas ref="camRef" style={{width:'100%',height:'100%'}}></canvas>                      
                        </div> 
                        <div align='left'>{this.state.cameraName}</div>                        
                        {this.props.showButtons?
                            <Card.Footer>
                                <Button variant="outline-secondary"><i className='fa fa-camera'></i></Button>
                                <Button variant="outline-secondary"><i className='fa fa-pause'></i></Button>
                                <Button variant="outline-secondary"><i className='fa fa-square'></i></Button>
                                <Button variant="outline-secondary"><i className='fa fa-repeat'></i></Button>
                                <Button className="pull-right" variant="outline-secondary" onClick={()=>this.setState({showData:!this.state.showData})}><i className={this.state.showData?'fa fa-video-camera':'fa fa-list'}></i></Button>
                            </Card.Footer>:
                        null}
                    </Card.Body>                    
                }
            </Card>
        );
    } 

  componentDidMount(){      
      this.setState({cameraName:this.props.marker.title,num_cam:this.props.marker.extraData.num_cam,cameraID:this.props.marker.extraData.id,data:this.props.marker.extraData})
      var ws = new WebSocket(this.props.marker.extraData.webSocket)
      var p = new window.jsmpeg(ws, {canvas:this.refs.camRef, autoplay:true,audio:false,loop: true});
      let images = []
            let videos = []
            let  check = 'cam'+(this.props.marker.extraData.num_cam>=10?'00':'000') + this.props.marker.extraData.num_cam + '/'
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
      this.setState({
          webSocket: ws,
          player: p,
          videos:videos,
          photos: images
      })
      if (this.props.height) {
          if (this.refs.camRef.getBoundingClientRect().width === 0) {
            this.refs.camRef.style.height = (window.visualViewport.width - 50 ) * this.props.height+'px'  
          } else {
            this.refs.camRef.style.height = this.refs.camRef.getBoundingClientRect().width * this.props.height+'px'   
          }        
      }
  }

    componentWillUnmount(){
        this.state.player.stop()
        this.state.webSocket.close()
    }
}
export default CameraStream;