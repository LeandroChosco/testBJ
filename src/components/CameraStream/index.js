import React, { Component } from 'react';
import { Card, Button } from 'react-bootstrap'

import './style.css'

class CameraStream extends Component {
    state= {
        player:false,
        cameraID:'',
        cameraName:'',
        data:{}
    }

    render() {

        return (
            <Card>                    
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
            </Card>
        );
    } 

  componentDidMount(){      
      this.setState({cameraName:this.props.marker.title,cameraID:this.props.marker.extraData.id,data:this.props.marker.extraData})
      var ws = new WebSocket(this.props.marker.extraData.webSocket)
      var player = new window.jsmpeg(ws, {canvas:this.refs.camRef, autoplay:true,audio:false,loop: true});
  }
}
export default CameraStream;