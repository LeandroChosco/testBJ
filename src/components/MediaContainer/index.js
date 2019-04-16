import React, { Component } from 'react';
import {  Card } from 'semantic-ui-react';
import { Modal } from 'react-bootstrap';
import { saveAs } from 'file-saver';
import constants from '../../constants/constants';
class MediaContainer extends Component {
    
    state = {
        modal : false,
    }

  render() {
    return (
    <div className='mediaContainer col-6 p10'>   
        <Card onClick={()=>this.setState({modal:true})}>
            {this.props.video?<video src={constants.base_url+':'+constants.apiPort+'/'+ this.props.src} style={{width:'100%'}}/>:null}
            {this.props.image?<img src={constants.base_url+':'+constants.apiPort+'/'+ this.props.src} style={{width:'100%'}} alt='img'/>:null}
        </Card>
        <Modal size="lg" show={this.state.modal} onHide={()=>this.setState({modal:false})}>
            <Modal.Header closeButton>                      
                <button type="button" onClick={this._saveFile}><i className='fa fa-download'></i></button>
            </Modal.Header>
            <Modal.Body>
                {this.props.video?<video ref='element' autoPlay controls src={constants.base_url+':'+constants.apiPort+'/'+ this.props.src} style={{width:'100%'}}/>:null}
                {this.props.image?<img id='imagecontainerfrommedia' src={constants.base_url+':'+constants.apiPort+'/'+ this.props.src} style={{width:'100%'}} crossOrigin='true' alt='img'/>:null}
            </Modal.Body>
        </Modal>
    </div>
    );
  }

    _saveFile = () => {
                    
        saveAs(this.props.src,this.props.video?'video.mp4':this.props.image?'image.jpg':'file')
                
    }

}

export default MediaContainer;