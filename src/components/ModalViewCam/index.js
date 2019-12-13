import React, { Component } from 'react';
import { Modal} from 'react-bootstrap';
import HlsPlayer from '../HlsPlayer'
import './style.css'
import conections from '../../conections';
class ModalViewCam extends Component{
    state = {
    }
    render () {
        return(
            <Modal show={this.props.modal} onHide={this.props.hide}>
                <Modal.Header closeButton>                      
                    <p>Camara {this.props.dataCam.num_cam}</p>
                </Modal.Header>
                <Modal.Body style={{height: '400px'}}>
                    <HlsPlayer src={'http://'+this.props.dataCam.UrlStreamMediaServer.ip_url_ms+':'+this.props.dataCam.UrlStreamMediaServer.output_port+this.props.dataCam.UrlStreamMediaServer.name+this.props.dataCam.channel} 
                        num_cam={this.props.dataCam.num_cam}/>

                </Modal.Body>
            </Modal>
        )
    }
     
}

export default ModalViewCam;