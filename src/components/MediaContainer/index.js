import React, { Component } from 'react';
import {  Card, Button } from 'semantic-ui-react';
import { Modal } from 'react-bootstrap';
import { saveAs } from 'file-saver';
import constants from '../../constants/constants';
import Axios from 'axios';
import { NOTFOUND } from 'dns';
import { stat } from 'fs';
import Clappr from 'clappr'
import HlsPlayer from '../HlsPlayer';
import Spinner from 'react-bootstrap/Spinner'

class MediaContainer extends Component {
    
    state = {
        modal : false,
        player: undefined        
    }

  render() {
    return (
    <div className='mediaContainer col-6 p10'>   
        <Card onClick={()=>this.setState({modal:true})}>
            {this.props.video? 
                <video 
                    poster={this.props.src_img ? this.props.dns_ip+':'+constants.apiPort+'/'+this.props.src_img : null} 
                    src={(this.props.dns_ip?this.props.dns_ip:this.props.servidorMultimedia)+':'+constants.apiPort+'/'+ this.props.src} 
                    style={{width:'100%'}}
                    />
            :null}
            {this.props.image? <img src={this.props.servidorMultimedia+':'+constants.apiPort+'/'+ this.props.src } style={{width:'100%'}} alt='img'/>:null}
            {this.props.hour}
        </Card>
        <Modal show={this.state.modal} onHide={()=>this.setState({modal:false})}>
            <Modal.Header closeButton>                      
            {
                        this.state.loading ?
                            <>
                                <Button variant="primary" disabled>
                                    <Spinner
                                    as="span"
                                    animation="grow"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                    />
                                    Descargando...
                                </Button>
                            </> :
                            
                        <Button basic onClick={this._saveFile}><i className='fa fa-download'></i> Descargar </Button> 
                    }   

            </Modal.Header>
            <Modal.Body>
                {/* {this.props.video?<video ref='element' autoPlay controls src={(this.props.dns_ip?this.props.dns_ip:constants.base_url)+':'+constants.apiPort+'/'+ this.props.src} style={{width:'100%'}}/>:null} */}
                {this.props.video?
                    <HlsPlayer src = {(this.props.dns_ip?this.props.dns_ip:this.props.servidorMultimedia)+':'+constants.apiPort+'/'+ this.props.src}
                    num_cam={this.props.value.id} />
                : null}
                {this.props.image?<img id='imagecontainerfrommedia' src={this.props.servidorMultimedia+':'+constants.apiPort+'/'+ this.props.src} style={{width:'100%'}} crossOrigin='true' alt='img'/>:null}
            </Modal.Body>
        </Modal>
    </div>
    );
    }

    componentDidMount() {     
        // console.log(this.props )
        
        //console.log('url',(this.props.dns_ip?this.props.dns_ip:constants.base_url)+':'+constants.apiPort+'/'+ this.props.src , this.props.servidorMultimedia) 
       
    }

    componentWillUnmount(){
        
    }
    _saveFile = async () => {
        this.setState({
            loading: true
        })
            const response={
                file: this.props.dns_ip ?
                    this.props.dns_ip + ":" + constants.apiPort + "/" + this.props.src :
                    this.props.servidorMultimedia + ":" + constants.apiPort + "/" + this.props.src
            };
            const statusResponse = await fetch(response.file)
            console.log("status: ", statusResponse)
            if(statusResponse.status === 200){
                window.saveAs(response.file, this.props.video ? 'video.mp4' : this.props.image ? 'image.jpg' : 'file')
                console.log(response.file)
                if (response.file.includes('video_history')) {
                    setTimeout(() => {
                        console.log('Video History Saved')
                        this.setState({loading:false})
                    }, 8500);
                } else {
                    setTimeout(() => {
                        this.setState({loading:false})
                    }, 300);
                }
            }else{
                const responseHistory={
                    file:this.props.dns_ip +":" +constants.apiPort +"/"+ this.props.src
                };
                window.saveAs(responseHistory.file, this.props.video ? 'video.mp4' : this.props.image ? 'image.jpg' : 'file')
                setTimeout(() => {
                    this.setState({loading:false})
                }, 300);
            }

    }

    _deleteFile = () => {
        //console.log(this.props.cam)
        Axios.delete(constants.base_url + ':' + constants.apiPort + '/cams/'+this.props.cam.id+'/'+this.props.value.id+'/1/V2')
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
