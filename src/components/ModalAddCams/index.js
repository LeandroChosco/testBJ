import React, { Component, Fragment } from 'react';
import { Modal } from 'react-bootstrap';
import { Image, Segment, Button, Icon } from 'semantic-ui-react'
import ModalViewCam from '../ModalViewCam'
import './style.css'
import conections from '../../conections';
import img from '../../assets/images/paragraph.png'
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';
import { MODE } from '../../constants/token';
class ModalAddCams extends Component {
    state = {
        auxCams: [],
        loading: true,
        showModalView: false,
        camare: [],
        selection: [],
        checkboxSelect: [],

    }
    render() {
        const columns = [{
            dataField: "camara",
            text: 'Cámara',
            filter: textFilter({
                placeholder: 'Buscar por número'
            })
        }, {
            dataField: "direccion",
            text: 'Dirección',
            filter: textFilter({
                placeholder: 'Buscar por dirección'
            })
        }, {
            dataField: 'ver',
            formatter: (cel, row) => this._buttonVer(cel, row),
            text: '',
            style: {
                textAlign: 'center'
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

        return (
            <Modal style={{ display: this.state.showModalView ? 'none' : 'block', color: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) && "white" }} size="xl" backdrop={'static'} show={this.props.modal} onHide={this.props.hide}>
                <Modal.Header style={{ background: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "var(--dark-mode-color)" : "white", color: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "white" : "#666666" }} closeButton>
                    <p style={{ color: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "white" : "#666666" }}>Agregar cámaras a cuadrante: <b style={{ color: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "white" : "black" }}>{this.props.name_cuadrante.name}</b></p>
                </Modal.Header>
                <Modal.Body style={{ background: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "var(--dark-mode-color)" : "white", color: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "white" : "#666666" }} className="camsGroup">
                    {this.state.loading ?
                        <Segment style={{ background: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "var(--dark-mode-color)" : "white", color: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "white" : "#666666", height: "100%" }}>

                            <Image src={img} />
                        </Segment>
                        :
                        <Fragment style={{ color: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "white" : "#666666" }}>
                            <BootstrapTable bootstrap4 keyField='id' data={this.state.auxCams} columns={columns} pagination={paginationFactory()} filter={filterFactory()} selectRow={selectRow} rowClasses={(localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "dark-row" : "light-row"} headerClasses={(localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "dark-header" : "light-header"} />
                            <div style={{ textAlign: 'center', padding: "0 0 0.3rem 0", marginTop: 10 }} className="col">
                                <Button style={{ width: '360px', marginLeft: '30px', marginBottom: "1rem" }} onClick={this._addCam} disabled={this.state.selection.length === 0}>Actualizar<Icon style={{ marginLeft: '3px' }} name='add' /></Button>
                                {/* <Button style={{fontSize:'16px'}} onClick={this._addCam} disabled={this.state.selection.length === 0} circular icon='add' /> */}
                            </div>
                        </Fragment>
                    }
                    {this.state.showModalView ?
                        <ModalViewCam modal={this.state.showModalView} hide={() => this.setState({ showModalView: false })} dataCam={this.state.camare} />
                        : null}
                </Modal.Body>
            </Modal>
        )
    }

    componentDidMount() {
        this._loadCameras()
    }

    _loadCameras = () => {

        conections.loadCamsCuadrantes(this.props.name_cuadrante.id)
            .then((response) => {
                // console.log('camaras cuadrantesss', response)
                this.setState({
                    loading: false, auxCams: response.data.data.map(item => {
                        item.camara = 'Camara ' + item.num_cam
                        item.direccion = item.street + ' ' + item.number + ', ' + item.township + ', ' + item.town + ', ' + item.state
                        if (item.RelCuadranteCams.length !== 0) {
                            item.RelCuadranteCams.map(cam => {
                                if (cam.id_cuadrante === this.props.name_cuadrante.id) {
                                    if (cam.activo)
                                        item.selected = true
                                    else
                                        item.selected = false
                                }
                                return cam;
                            })
                        } else {
                            item.selected = false
                        }
                        return item
                    }).sort(function (a, b) {
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
                // console.log('data',this.state.auxCams)
                this.state.auxCams.map(item => {
                    if (item.selected) {
                        auxSelection.push(item.id)
                    }
                    return item;
                })

                //console.log('seleccionCheckbox',auxSelection)
                this.setState({ checkboxSelect: auxSelection })

                // let aux = this.state.selectRow
                // aux.selected = auxSelection
                // this.setState({selectRow:aux})

            })


    }

    _viewCam = (cam) => {
        // console.log('cammmm',cam)
        this.setState({ showModalView: true, camare: cam })
    }

    _selectionCheckbox = (data, isSelect, rowIndex, e) => {
        //console.log(data)
        let aux = this.state.selection
        let auxSelection = this.state.checkboxSelect
        let found = false
        //console.log('auxSelection',auxSelection)
        aux.map(select => {
            if (select.id === data.id) {
                found = true
                select.selected = isSelect

                if (isSelect) {
                    auxSelection.push(select.id)
                } else {
                    auxSelection = auxSelection.filter(x => {
                        return x !== select.id
                    })
                }
            }

            return select
        })

        if (!found) {
            aux.push({ id: data.id, selected: isSelect })
            if (isSelect) {
                auxSelection.push(data.id)
            } else {
                auxSelection = auxSelection.filter(x => {
                    return x !== data.id
                })
            }
        }

        let cams = this.state.auxCams

        cams.map(cam => {
            if (cam.id === data.id) {
                cam.selected = isSelect
            }
            return cam
        })

        this.setState({ checkboxSelect: auxSelection, selection: aux, auxCams: cams })
        //console.log('selecccion',this.state.selection)
    }

    _selectionAll = (isSelect, rows, e) => {
        let aux = this.state.selection
        let found = false

        rows.map(data => {
            aux.map(select => {
                if (select.id === data.id) {
                    found = true
                    select.selected = isSelect
                }
                return select
            })
            if (!found) {
                aux.push({ id: data.id, selected: isSelect })
            }
            return data;
        })

        let cams = this.state.auxCams

        cams.map(cam => {
            rows.map(data => {
                if (cam.id === data.id) {
                    cam.selected = isSelect
                }
                return data;

            })
            return cam;
        })

        this.setState({ selection: aux, auxCams: cams })
        // console.log('selecccionDespuesDelAll',this.state.selection)

    }

    _addCam = () => {
        let camsAdd = {
            id_cuadrante: this.props.name_cuadrante.id,
            cams: this.state.selection
        }
        // console.log('dataAdd',camsAdd)
        if (this.state.selection.length !== 0) {
            conections.addCamsCuadrante(camsAdd).then((response) => {
                // console.log('resAdd',response)
                this.props.hide(this.props.name_cuadrante.id)
            })
        } else
            this.props.hide()
    }

    _formatoCell = (cell, row) => {
        //console.log(row)
        return (<span>Camara {row.num_cam}</span>);
    }

    _buttonVer = (cell, row) => {
        return (
            <button className={`btn btn-${(localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "dark" : "secondary"}`} onClick={() => this._viewCam(row)} style={{ fontSize: '14px', margin: 'auto', textAlign: 'center', padding: '0px', height: '30px', width: '150px' }}>Ver</button>
        )
    }

}

export default ModalAddCams;
