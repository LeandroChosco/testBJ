import React, { Component, Fragment } from 'react';
import { Modal, ListGroup } from 'react-bootstrap';
import { Checkbox, Dimmer, Loader, Image, Segment } from 'semantic-ui-react'
import ModalViewCam  from '../ModalViewCam'
import './style.css'
import conections from '../../conections';
class ModalAddCams extends Component{
    state = {
        auxCams:[],
        loading: true,
        showModalView: false,
        camare: [],
        selection: []
    }
    render () {
        return(
            <Modal backdrop={'static'} show={this.props.modal} onHide={this.props.hide}>
                <Modal.Header closeButton>                      
                    <p>Agregar Camaras {this.props.name_cuadrante}</p>
                </Modal.Header>
                <Modal.Body className="camsGroup">
                    {this.state.loading ? 
                        <Segment style={{height: '100%'}}>
                    
                            <Image src='https://react.semantic-ui.com/images/wireframe/paragraph.png' />
                        </Segment>
                        :
                        <Fragment>
                            <ListGroup>
                                {this.state.auxCams.map((value)=> 
                                    <ListGroup.Item key={value.num_cam}>
                                        <div className="row">
                                            <div className="col col-9">
                                                <Checkbox onChange={this._selectionCheckbox} value={value.num_cam} label={'Camara '+value.num_cam} />
                                            </div>
                                            <div className="col col-3">
                                                <p style={{textAlign:'right', cursor:'pointer'}} onClick={() => this._viewCam(value)}><b>Ver</b></p>
                                            </div>
                                        </div>
                                    </ListGroup.Item>
                                )}
                            </ListGroup>
                            <div style={{textAlign:'right', padding:0, marginTop:10}} className="col">
                                <button className="ui button" onClick={this._addCam}>Agregar</button>
                            </div>
                            </Fragment>
                    }
                    {this.state.showModalView ?
                        <ModalViewCam modal={this.state.showModalView} hide={()=>this.setState({showModalView:false})} dataCam={this.state.camare} />
                    :null}
                </Modal.Body>
            </Modal>
        )
    }

    componentDidMount(){
        this._loadCameras()
    }

    _loadCameras = () => {
        conections.getAllCams()
            .then((response) => {
                this.state.auxCams = response.data.filter(item =>{
                    return (item.active === 1 && item.flag_streaming === 1)
                }).sort((a,b) => {
                    if (a.num_cam > b.num_cam) {
                        return 1;
                      }
                      if (a.num_cam < b.num_cam) {
                        return -1;
                      }
                      return 0;
                })
            //console.log('CAMARAS MODALL',this.state.auxCams)
            this.setState({loading:false})
        })
    }

    _viewCam = (cam) =>{
        //console.log('cammmm',cam)
        this.setState({showModalView: true, camare: cam})
    }

    _selectionCheckbox = (event, data) =>{
        //console.log(data)
        let aux = this.state.selection
        if(data.checked){
            aux.push(data.value)
        }else{
            delete aux[aux.indexOf(data.value)]
        }

        

        this.setState({selection: aux})

    }

    _addCam = () =>{
        let camsAdd = this.state.selection.filter(item =>{return item != 'empty' })
        console.log('selection',camsAdd, this.props.name_cuadrante)
    }

}

export default ModalAddCams;