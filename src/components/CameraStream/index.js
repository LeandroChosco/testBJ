import React, { Component } from 'react';
import { Card, Button, Row, Col } from 'react-bootstrap'

import './style.css'

class CameraStream extends Component {
    state= {
        cameraID:'',
        cameraName:'',
        data:{},
        webSocket: null,
        player: null
    }

    render() {

        return (
            <Card>                    
                {this.props.horizontal?
                    <Card.Body>
                                
                        <Card.Title>Camara {this.state.cameraID}</Card.Title>
                        <Card.Text>
                            <Row>
                                <Col lg={6}>
                                    <div className="camHolder">  
                                        <canvas ref="camRef" style={{width:this.props.height?'50%':'100%',height:this.props.height?this.props.height:'100%'}}></canvas>                      
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
                        <div className="camHolder">  
                            <canvas ref="camRef" style={{width:this.props.height?'50%':'100%',height:this.props.height?this.props.height:'100%'}}></canvas>                      
                        </div>
                        <Card.Title>Camara {this.state.cameraID}</Card.Title>
                        <Card.Text>
                            {this.state.cameraName}
                        </Card.Text>
                        {this.props.showButtons?
                            <Card.Footer>
                                <Button variant="outline-secondary"><i className='fa fa-camera'></i></Button>
                                <Button variant="outline-secondary"><i className='fa fa-pause'></i></Button>
                                <Button variant="outline-secondary"><i className='fa fa-square'></i></Button>
                                <Button variant="outline-secondary"><i className='fa fa-repeat'></i></Button>
                            </Card.Footer>:
                        null}
                    </Card.Body>                    
                }
            </Card>
        );
    } 

  componentDidMount(){      
      this.setState({cameraName:this.props.marker.title,cameraID:this.props.marker.extraData.id,data:this.props.marker.extraData})
      var ws = new WebSocket(this.props.marker.extraData.webSocket)
      var p = new window.jsmpeg(ws, {canvas:this.refs.camRef, autoplay:true,audio:false,loop: true});
      this.setState({
          webSocket: ws,
          player: p
      })
  }

    componentWillUnmount(){
        this.state.player.stop()
        this.state.webSocket.close()
    }
}
export default CameraStream;