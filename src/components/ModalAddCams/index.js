import React, { Component } from 'react';
import { Modal, ListGroup } from 'react-bootstrap';
import { Checkbox } from 'semantic-ui-react'
import './style.css'
class ModalAddCams extends Component{
    state = {
        auxCams:[1,2,3,4,5,6,7,8,9,10,11,12]
    }
    render () {
        return(
            <Modal show={this.props.modal} onHide={this.props.hide}>
                <Modal.Header closeButton>                      
                    <p>Agregar Camaras {this.props.name_cuadrante}</p>
                </Modal.Header>
                <Modal.Body className="camsGroup">
                    <ListGroup>
                        {this.state.auxCams.map((value)=> 
                            <ListGroup.Item>
                                <div className="row">
                                    <div className="col col-9">
                                        <Checkbox label={'Camara '+value} />
                                    </div>
                                    <div className="col col-3">
                                        <p style={{textAlign:'right'}}><b>Ver</b></p>
                                    </div>
                                </div>
                            </ListGroup.Item>
                        )}
                    </ListGroup>
                    <div style={{textAlign:'right', padding:0, marginTop:10}} className="col">
                        <button className="ui button">Agregar</button>
                    </div>
                </Modal.Body>
            </Modal>
        )
    }

}

export default ModalAddCams;