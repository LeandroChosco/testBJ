import React, { Component } from 'react';
import {  Card, Button } from 'semantic-ui-react';
import { Modal } from 'react-bootstrap';
import { saveAs } from 'file-saver';
import constants from '../../constants/constants';
import Axios from 'axios';
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
        <Modal show={this.state.modal} onHide={()=>this.setState({modal:false})}>
            <Modal.Header closeButton>                      
                <Button basic onClick={this._saveFile}><i className='fa fa-download'></i> Descargar </Button>
                <Button basic negative onClick={this._deleteFile}><i className='fa fa-trash'></i> Eliminar</Button>
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

    _deleteFile = () => {
        console.log(this.props.value)
        Axios.delete(constants.base_url + ':' + constants.apiPort + '/cams/'+this.props.cam.id+'/'+this.props.value.id+'/1')
            .then(response=>{                
                if (response.data.success ) {
                    this.setState({modal:false, display:'none'})
                    this.props.reloadData()
                } else {
                    alert('Error al eliminar imagen')
                }
            })
    }

}

export default MediaContainer;