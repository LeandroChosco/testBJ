import React, { Component } from 'react';
import { Image, Card } from 'semantic-ui-react';
import { Modal } from 'react-bootstrap';

class MediaContainer extends Component {
    
    state = {
        modal : false,
    }

  render() {
    return (
    <div className='mediaContainer col-6 p10'>   
        <Card onClick={()=>this.setState({modal:true})}>
            {this.props.video?<video src={this.props.src} style={{width:'100%'}}/>:null}
            {this.props.image?<Image src={this.props.src} style={{width:'100%'}}/>:null}
        </Card>
        <Modal size="lg" show={this.state.modal} onHide={()=>this.setState({modal:false})}>
            <Modal.Header closeButton>
                
            </Modal.Header>
            <Modal.Body>
                {this.props.video?<video autoPlay controls src={this.props.src} style={{width:'100%'}}/>:null}
                {this.props.image?<Image src={this.props.src} style={{width:'100%'}}/>:null}
            </Modal.Body>
        </Modal>
    </div>
    );
  }

}

export default MediaContainer;