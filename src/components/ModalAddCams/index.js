import React, { Component, Fragment } from 'react';
import { Modal, ListGroup } from 'react-bootstrap';
import { Checkbox, Dimmer, Loader, Image, Segment, Button } from 'semantic-ui-react'
import ModalViewCam  from '../ModalViewCam'
import './style.css'
import conections from '../../conections';
import img from '../../assets/images/paragraph.png'
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
                    <p>Agregar Camaras {this.props.name_cuadrante.name}</p>
                </Modal.Header>
                <Modal.Body className="camsGroup">
                    {this.state.loading ? 
                        <Segment style={{height: '100%'}}>
                    
                            <Image src={img} />
                        </Segment>
                        :
                        <Fragment>
                            <ListGroup>
                                {this.state.auxCams.map((value)=> 
                                    <ListGroup.Item key={value.id}>
                                        <div className="row">
                                            <div className="col col-9">
                                                <Checkbox onChange={this._selectionCheckbox} value={value.id} checked={value.selected} label={'Camara '+value.num_cam} />
                                            </div>
                                            <div className="col col-3">
                                                <p style={{textAlign:'right', cursor:'pointer'}} onClick={() => this._viewCam(value)}><b>Ver</b></p>
                                            </div>
                                        </div>
                                    </ListGroup.Item>
                                )}
                            </ListGroup>
                            <div style={{textAlign:'right', padding:0, marginTop:10}} className="col">
                                <Button className="ui button" onClick={this._addCam}>Agregar</Button>
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
        let aux = []
        conections.loadCamsCuadrantes(this.props.name_cuadrante.id)
            .then((response) => {
                //console.log('camaras cuadrantesss', response)
                this.setState({loading:false, auxCams:response.data.data.map(item =>{
                    item.selected = item.RelCuadranteCam ? item.RelCuadranteCam.activo ? true: false : false
                    return item
                })})
                
        })
    }

    _viewCam = (cam) =>{
        //console.log('cammmm',cam)
        this.setState({showModalView: true, camare: cam})
    }

    _selectionCheckbox = (event, data) =>{
        //console.log(data)
        let aux = this.state.selection
        let found = false
        aux.map(select=>{
            if (select.id === data.value) {
                found = true
                select.selected = data.checked
            }
            return select
        })
        if (!found) {
            aux.push({id:data.value,selected:data.checked})
        }

        let cams = this.state.auxCams
        
        cams.map(cam=>{
            if (cam.id === data.value) {
                cam.selected = data.checked
            }
            return cam
        })

        this.setState({selection: aux, auxCams:cams})
        //console.log('selecccion',this.state.selection)
    }

    _addCam = () =>{
        let camsAdd = {
            id_cuadrante:this.props.name_cuadrante.id,
            cams:this.state.selection
        }
        console.log('dataAdd',camsAdd)
        if(this.state.selection.length != 0){
            conections.addCamsCuadrante(camsAdd).then((response) =>{
                console.log('resAdd',response)
                 this.props.hide(this.props.name_cuadrante.id)
            })
        }else
            this.props.hide()
    }

}

export default ModalAddCams;