import React, { Component, Fragment } from 'react';
import { Modal, ListGroup } from 'react-bootstrap';
import { Checkbox, Dimmer, Loader, Image, Segment, Button, Icon } from 'semantic-ui-react'
import ModalViewCam  from '../ModalViewCam'
import './style.css'
import conections from '../../conections';
import img from '../../assets/images/paragraph.png'
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';
class ModalAddCams extends Component{
    state = {
        auxCams:[],
        loading: true,
        showModalView: false,
        camare: [],
        selection: [],
        checkboxSelect: [],
        
    }
    render () {
        const columns = [{
            dataField: "num_cam",
            text: 'Camara',
            formatter:(cel,row) =>this._formatoCell(cel,row),
            filter: textFilter({
                placeholder: 'Buscar Número'
            })
          },{
            dataField: "direccion",
            text: 'Dirección',
            style: { width: '200px' },
            filter: textFilter({
                placeholder: 'Buscar Dirección'
            })
          }, {
            dataField: 'ver',
            formatter:(cel,row) =>this._buttonVer(cel,row) ,
            text: '',
            style:{
                textAlign:'center'
            }
          }]
        const selectRow = {
            mode: 'checkbox',
            clickToSelect: false,
            onSelect: (row, isSelect, rowIndex, e) => this._selectionCheckbox(row, isSelect, rowIndex, e),
            hideSelectAll: true,
            selected: this.state.checkboxSelect
            // onSelectAll: (isSelect, rows, e) => this._selectionAll(isSelect, rows, e)
        }
        return(
            <Modal style={{display: this.state.showModalView ? 'none' : 'block'}} size="xl" backdrop={'static'} show={this.props.modal} onHide={this.props.hide}>
                <Modal.Header closeButton>                      
                    <p>Agregar Camaras <b style={{color:'black'}}>{this.props.name_cuadrante.name}</b></p>
                </Modal.Header>
                <Modal.Body className="camsGroup">
                    {this.state.loading ? 
                        <Segment style={{height: '100%'}}>
                    
                            <Image src={img} />
                        </Segment>
                        :
                        <Fragment>
                            <BootstrapTable keyField='id' data={ this.state.auxCams } columns={ columns } pagination={paginationFactory()} filter={filterFactory()} selectRow={ selectRow } />
                            <div style={{textAlign:'center', padding:0, marginTop:10}} className="col">
                                <Button style={{width:'360px',marginLeft:'30px'}} onClick={this._addCam} disabled={this.state.selection.length === 0}>Agregar<Icon style={{marginLeft:'3px'}} name='add' /></Button>
                                {/* <Button style={{fontSize:'16px'}} onClick={this._addCam} disabled={this.state.selection.length === 0} circular icon='add' /> */}
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
                console.log('camaras cuadrantesss', response)
                this.setState({loading:false, auxCams:response.data.data.map(item =>{
                    item.direccion = item.street+' '+item.number+', '+item.township+', '+item.town+', '+item.state
                    if(item.RelCuadranteCams.length != 0){
                        item.RelCuadranteCams.map(cam =>{
                            if(cam.id_cuadrante === this.props.name_cuadrante.id){
                                if(cam.activo)
                                    item.selected =true
                                else
                                    item.selected = false
                            }
                        })
                    }else{
                        item.selected = false
                    }   
                    return item
                    }).sort(function(a, b) {
                        if (a.num_cam > b.num_cam) {
                          return 1;
                        }
                        if (a.num_cam < b.num_cam) {
                          return -1;
                        }
                        return 0;
                      })
                })

                let auxSelection = []
                console.log('data',this.state.auxCams)
                this.state.auxCams.map(item =>{
                    if(item.selected){
                        auxSelection.push(item.id)
                    }
                })

                //console.log('seleccionCheckbox',auxSelection)
                this.setState({checkboxSelect:auxSelection})

                // let aux = this.state.selectRow
                // aux.selected = auxSelection
                // this.setState({selectRow:aux})
                        
                })

        
    }

    _viewCam = (cam) =>{
        //console.log('cammmm',cam)
        this.setState({showModalView: true, camare: cam})
    }

    _selectionCheckbox = (data, isSelect, rowIndex, e) =>{
        //console.log(data)
        let aux = this.state.selection
        let auxSelection = this.state.checkboxSelect
        let found = false
        //console.log('auxSelection',auxSelection)
        aux.map(select=>{
            if (select.id === data.id) {
                found = true
                select.selected = isSelect

                if(isSelect){
                    auxSelection.push(select.id)
                }else{
                    auxSelection = auxSelection.filter(x =>{
                        return x !== select.id
                    })
                }
            }

            return select
        })

        if (!found) {
            aux.push({id:data.id,selected:isSelect})
            if(isSelect){
                auxSelection.push(data.id)
            }else{
                auxSelection = auxSelection.filter(x =>{
                    return x !== data.id
                })
            }
        }

        let cams = this.state.auxCams
        
        cams.map(cam=>{
            if (cam.id === data.id) {
                cam.selected = isSelect
            }
            return cam
        })

        this.setState({checkboxSelect:auxSelection, selection: aux, auxCams:cams})
        //console.log('selecccion',this.state.selection)
    }

    _selectionAll = (isSelect, rows, e) =>{
        let aux = this.state.selection
        let found = false

        rows.map(data=>{
            aux.map(select=>{
                if(select.id === data.id){
                    found = true
                    select.selected = isSelect
                }
                return select
            })
            if(!found){
                aux.push({id:data.id,selected:isSelect})
            }
        })

        let cams = this.state.auxCams

        cams.map(cam=>{
            rows.map(data=>{
                if (cam.id === data.id) {
                    cam.selected = isSelect
                }
                return cam
            })
        })

        this.setState({selection: aux, auxCams:cams})
        console.log('selecccionDespuesDelAll',this.state.selection)

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

     _formatoCell = (cell,row) =>{
        //console.log(row)
        return(<span>Camara {row.num_cam}</span>);
    }

    _buttonVer = (cell,row) =>{
        return(
            <Button onClick={() => this._viewCam(row)} style={{fontSize:'14px', margin:'auto', textAlign:'center', padding:'0px', height:'30px', width:'150px'}}>Ver</Button>
        )
    }

}

export default ModalAddCams;