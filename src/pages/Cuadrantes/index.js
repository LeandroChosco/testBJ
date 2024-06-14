import React, { Component, Fragment } from 'react';
import { Input, Icon, TextArea, Form, Label, Button, Radio, Dropdown } from 'semantic-ui-react';
import { ToggleButton, ToggleButtonGroup, Modal } from 'react-bootstrap';
// import { JellyfishSpinner } from 'react-spinners-kit';

import JSZipUtils from 'jszip-utils';
import saveAs from 'file-saver';
import Chips from 'react-chips';
import moment from 'moment';
import JSZip from 'jszip';

import conections from '../../conections';
import constants from '../../constants/constants';
import CameraStream from '../../components/CameraStream';
import ModalAddCams from '../../components/ModalAddCams';
import GridCameraDisplay from '../../components/GridCameraDisplay';
import LoopCamerasDisplay from '../../components/LoopCamerasDisplay';
import SearchCamera from '../../components/SearchCamera';
import LoadingLogo from '../../components/LoadingLogo';
import Strings from '../../constants/strings';
import { urlHttpOrHttps } from '../../functions/urlHttpOrHttps';
import NotificationSystem from 'react-notification-system';

import './style.css';
import '../../assets/styles/util.css';
import '../../assets/styles/main.css';
import '../../assets/fonts/iconic/css/material-design-iconic-font.min.css';
import { LANG, MODE } from '../../constants/token';

class Cuadrantes extends Component {
  notificationSystem = React.createRef();
  state = {
    cuadrantes: [],
    index: 2,
    showInput: false,
    valueNew: '',
    showModal: false,
    cuadranteSelection: 0,
    camsCuadrante: [],
    actualCamera: {
      title: '',
      extraData: {}
    },
    displayTipe: 1,
    cameraID: null,
    webSocket: constants.webSocket,
    loading: true,
    error: null,
    recordingCams: [],
    recordingProcess: [],
    loadingRcord: false,
    isRecording: false,
    interval: null,
    loadingSnap: false,
    loadingFiles: false,
    modal: false,
    recordMessage: '',
    cameraProblem: {},
    problemDescription: '',
    typeReport: 1,
    phones: [],
    mails: [],
    user_id: 0,
    userInfo: {},
    moduleActions: {},
    id_cam: 0,
    cuadranteActual: '',
    optionsCuadrantes: [
      {
        key: 'Cuadrante 1',
        text: 'Cuadrante 1',
        value: 'Cuadrante 1',
      }, {
        key: 'Cuadrante 2',
        text: 'Cuadrante 2',
        value: 'Cuadrante 2',
      }, {
        key: 'Cuadrante 3',
        text: 'Cuadrante 3',
        value: 'Cuadrante 3',
      }, {
        key: 'Cuadrante 4',
        text: 'Cuadrante 4',
        value: 'Cuadrante 4',
      }, {
        key: 'Cuadrante 5',
        text: 'Cuadrante 5',
        value: 'Cuadrante 5',
      }, {
        key: 'Cuadrante 6',
        text: 'Cuadrante 6',
        value: 'Cuadrante 6',
      }, {
        key: 'Cuadrante 7',
        text: 'Cuadrante 7',
        value: 'Cuadrante 7',
      }, {
        key: 'Cuadrante 8',
        text: 'Cuadrante 8',
        value: 'Cuadrante 8',
      }, {
        key: 'Cuadrante 9',
        text: 'Cuadrante 9',
        value: 'Cuadrante 9',
      }, {
        key: 'Cuadrante 10',
        text: 'Cuadrante 10',
        value: 'Cuadrante 10',
      }, {
        key: 'Otro',
        text: 'Otro',
        value: 'Otro',
      }
    ],
    flagOtroName: false,
    flagDelete: false,
    showSearch: false,
    is_quadrant_filter: false,
    filterData: [],
    showAllQuadrants: false,
    arrayCamsNoStream: [],
    update: false
  }

  render() {
    const { camsCuadrante, is_quadrant_filter, showAllQuadrants } = this.state;
    return (
      <div style={{ background: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "var(--dark-mode-color)" : "white" }}>
        <NotificationSystem ref={this.notificationSystem} />
        {showAllQuadrants ?
          <>
            <div className="containerCuadrantes">
              {this.state.cuadrantes.length > 0 && this.state.cuadrantes.map((value) =>

                <Button key={value.id} className="buttonCuadrantes" as='div' labelPosition='left'>
                  {
                    this.state.flagDelete
                      ? <Button style={{ borderRadius: '.28571429rem' }} color='red' icon='minus' onClick={() => this._deleteCuadrante(value)} />
                      : null
                  }
                  <Label as='a' basic pointing='right' className={this.state.cuadranteActual === value.id ? 'colorSelected' : 'colorNormal'} onClick={() => this._camsCuadrante(value.id)}>
                    {value.name}
                  </Label>
                  <Button icon onClick={() => this._addCams(value)}>
                    <Icon name='add' />
                  </Button>
                </Button>

              )
              }
              {
                this.state.flagDelete
                  ? <Button className="buttonCuadrantes" onClick={() => this.setState({ flagDelete: false, cuadranteActual: 1 })}>{localStorage.getItem(LANG) === "english" ? "Cancel" : "Cancelar"}</Button>
                  :
                  this.state.cuadrantes.length !== 0
                    ? <Button style={{ width: '50px', margin: '0px' }} className="buttonCuadrantes delete" color="red" onClick={() => this.setState({ flagDelete: true, cuadranteActual: '' })}>
                      <Icon name='trash alternate' />
                    </Button>
                    : null
              }
              <Button className="buttonCuadrantes" onClick={() => this._newCuadrante(true)}>{localStorage.getItem(LANG) === "english" ? "New Quadrant" : "Crear Cuadrante"}</Button>
              {this.state.showInput ?
                <div className="ui action input">
                  <Button style={{ marginRight: '3px' }} onClick={() => this.setState({ showInput: false, valueNew: '' })} icon='close' />
                  {
                    this.state.flagOtroName
                      ? <Input focus className="formatInput" onChange={(e, { value }) => this.setState({ valueNew: value })} value={this.state.valueNew} placeholder='Nombre Cuadrante' />
                      : <Dropdown className="formatInput" onChange={(e, { value }) => this._changeName(value)} placeholder={localStorage.getItem(LANG) === "english" ? "Cancel" : 'Nombre Cuadrante'} selection options={this.state.optionsCuadrantes} />
                  }
                  <Button style={{ marginLeft: '4px' }} onClick={() => this._newCuadrante(false)} disabled={this.state.valueNew === ''}>Agregar</Button>
                </div>
                : null}
              {this.state.showModal ?
                <ModalAddCams modal={this.state.showModal} hide={(flag) => this._hideModal(flag)} name_cuadrante={this.state.cuadranteSelection} />
                : null}
            </div>
            {
              this.state.cuadrantes.length > 25 &&
              <Button onClick={this._hideAndShowQuadrants} style={{ height: "4rem", marginTop: "1rem", width: "100%", position: "absolute", zIndex: "2" }}>{localStorage.getItem(LANG) === "english" ? "Hide quadrants" : "Ocultar cuadrantes"}</Button>
            }
          </>
          :
          <>
            <div className="containerCuadrantes" style={{ maxHeight: "60px" }}>
              {this.state.cuadrantes.length > 0 && this.state.cuadrantes.map((value) =>

                <Button key={value.id} className="buttonCuadrantes" as='div' labelPosition='left'>
                  {
                    this.state.flagDelete
                      ? <Button style={{ borderRadius: '.28571429rem' }} color='red' icon='minus' onClick={() => this._deleteCuadrante(value)} />
                      : null
                  }
                  <Label as='a' basic pointing='right' className={this.state.cuadranteActual === value.id ? 'colorSelected' : 'colorNormal'} onClick={() => this._camsCuadrante(value.id)}>
                    {value.name}
                  </Label>
                  <Button icon onClick={() => this._addCams(value)}>
                    <Icon name='add' />
                  </Button>
                </Button>
              )
              }
              {
                this.state.flagDelete
                  ? <Button className="buttonCuadrantes" onClick={() => this.setState({ flagDelete: false, cuadranteActual: 1 })}>Cancelar</Button>
                  :
                  this.state.cuadrantes.length !== 0
                    ? <Button style={{ width: '50px', margin: '0px' }} className="buttonCuadrantes delete" color="red" onClick={() => this.setState({ flagDelete: true, cuadranteActual: '' })}>
                      <Icon name='trash alternate' />
                    </Button>
                    : null
              }
              <Button className="buttonCuadrantes" onClick={() => this._newCuadrante(true)}>Crear Cuadrante</Button>
              {this.state.showInput ?
                <div className="ui action input">
                  <Button style={{ marginRight: '3px' }} onClick={() => this.setState({ showInput: false, valueNew: '' })} icon='close' />
                  {
                    this.state.flagOtroName
                      ? <Input focus className="formatInput" onChange={(e, { value }) => this.setState({ valueNew: value })} value={this.state.valueNew} placeholder={localStorage.getItem(LANG) === "english" ? "Cancel" : 'Nombre Cuadrante'} />
                      : <Dropdown className="formatInput" onChange={(e, { value }) => this._changeName(value)} placeholder={localStorage.getItem(LANG) === "english" ? "Cancel" : 'Nombre Cuadrante'} selection options={this.state.optionsCuadrantes} />
                  }
                  <Button style={{ marginLeft: '4px' }} onClick={() => this._newCuadrante(false)} disabled={this.state.valueNew === ''}>Agregar</Button>
                </div>
                : null}
              {this.state.showModal ?
                <ModalAddCams modal={this.state.showModal} hide={(flag) => this._hideModal(flag)} name_cuadrante={this.state.cuadranteSelection} />
                : null}
            </div>
            {
              this.state.cuadrantes.length > 25 &&
              <Button onClick={this._hideAndShowQuadrants} style={{ height: "4rem", marginTop: "1rem", width: "100%", position: "absolute", zIndex: "2" }}>{localStorage.getItem(LANG) === "english" ? "Show more quadrants" : "Mostrar más cuadrantes"}</Button>
            }
          </>
        }
        <div id="analisis_holder" className={!this.props.showMatches ? "hide-matches" : "show-matches"} style={{ position: "absolute", zIndex: "2", background: "white", marginTop: "5rem", width: "100%" }}>
          {this.state.loading ?
            <LoadingLogo />
            : this.state.camsCuadrante.length !== 0 || this.state.is_quadrant_filter ?
              // <GridCameraDisplay
              //     ref='myChild'
              //     error={this.state.error}
              //     loading={this.state.loading}
              //     places = {this.state.camsCuadrante}
              //     toggleControlsBottom = {this._toggleControlsBottom}
              //     recordignToggle={this._recordignToggle}
              //     loadingRcord={this.state.loadingRcord}
              //     isRecording={this.state.isRecording}
              //     recordingCams={this.state.recordingCams}
              //     recordingProcess={this.state.recordingProcess}
              //     loadingSnap={this.state.loadingSnap}
              //     downloadFiles={this._downloadFiles}
              //     loadingFiles={this.state.loadingFiles}
              //     makeReport={this._makeReport}
              //     moduleActions={this.state.moduleActions}
              //     matches={this.props.matches}
              //     snapShot={this._snapShot}
              //     changeStatus={this._chageCamStatus}/>
              <Fragment>
                {this.state.displayTipe !== 3 && !this.state.loading ? <div className="toggleViewButton row" style={{ background: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "var(--dark-mode-color)" : "white", transition: "all 0.2s linear" }}>
                  <div className='col-12' style={{ marginTop: "1rem" }}>
                    {this.state.is_quadrant_filter && <Button onClick={() => this._loadCuadrantes()} className={`pull-right btn btn-${(localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "secondary" : "outline-primary"}`} style={{ margin: "0.5rem", height: "3rem", width: "3rem" }}><i className="fa fa-trash" aria-hidden="true"></i></Button>}
                    <button onClick={() => this.setState({ showSearch: true })} className={`pull-right btn btn-${(localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "secondary" : "outline-primary"}`} style={{ margin: "0.5rem", height: "3rem", width: "3rem" }}><i className="fa fa-filter" aria-hidden="true"></i></button>
                    <button onClick={() => this.setState({ update: true })} className={`pull-right btn btn-${(localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "secondary" : "outline-primary"}`} style={{ margin: "0.5rem", height: "3rem", width: "3rem" }}><i className="fa fa-refresh" aria-hidden="true"></i></button>
                  </div>
                  {/* {camsCuadrante.length !== 0 &&
                    <ToggleButtonGroup className='col-12' type="radio" name="options" defaultValue={2} onChange={this._changeDisplay} value={this.state.displayTipe} style={{ marginTop: '1%' }}>
                      <ToggleButton value={1} variant='outline-dark' ><Icon name="grid layout" /></ToggleButton>
                      <ToggleButton value={2} variant='outline-dark' ><Icon name="clone" /></ToggleButton>
                      {this.state.cameraID ? <ToggleButton value={3} variant='outline-dark' ><Icon name="square" /></ToggleButton> : null}
                    </ToggleButtonGroup>

                  } */}
                  {
                    camsCuadrante.length === 0 && is_quadrant_filter &&
                    <div align="center" className='col-12' style={{color: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "white" : "#666666"}}><br />
                      {Strings.noResults}
                    </div>

                  }
                </div> : null}
                <div style={{ position: 'absolute', top: '30%', background: 'transparent', width: '100%' }} align='center'>

                </div>
                {
                  this._showDisplay()
                }
              </Fragment>
              : this.state.cuadrantes.length !== 0
                ? <div className="errorContainer">
                  {localStorage.getItem(LANG) === "english" ? "Quadrant without cameras" : "Cuadrante sin cámaras asignadas"}
                </div>
                : <div className="errorContainer">
                  {localStorage.getItem(LANG) === "english" ? "No quadrants to show" : "No hay cuadrantes que mostrar"}
                </div>
          }
        </div>
        {
          this._renderModals()
        }
        {this._searchModal()}

      </div>
    )
  }

  componentDidMount() {


    if (!this.props.match.params.id) {
      const isValid = this.props.canAccess(2)
      if (!isValid) {
        this.props.history.push('/welcome')
      }
      if (isValid.UserToModules[0]) {
        this.setState({ moduleActions: JSON.parse(isValid.UserToModules[0].actions) })
      }
    } else {
      this.setState({ moduleActions: { btnrecord: true, btnsnap: true, viewHistorial: true }, id_cam: this.props.match.params.id })
    }
    this._loadCuadrantes()
    //window.addEventListener('restartCamEvent', this._loadCameras, false)
  }

  changeUpdate = (state) => this.setState({ update: state });

  _changeDisplay = (value) => {
    this.setState({ displayTipe: value })
  }

  _showDisplay = () => {
    switch (this.state.displayTipe) {
      case 1:
        return (<GridCameraDisplay
          ref='myChild'
          error={this.state.error}
          loading={this.state.loading}
          places={this.state.camsCuadrante}
          toggleControlsBottom={this._toggleControlsBottom}
          recordignToggle={this._recordignToggle}
          loadingRcord={this.state.loadingRcord}
          isRecording={this.state.isRecording}
          recordingCams={this.state.recordingCams}
          recordingProcess={this.state.recordingProcess}
          loadingSnap={this.state.loadingSnap}
          downloadFiles={this._downloadFiles}
          loadingFiles={this.state.loadingFiles}
          makeReport={this._makeReport}
          moduleActions={this.state.moduleActions}
          matches={this.props.matches}
          snapShot={this._snapShot}
          changeStatus={this._chageCamStatus}
          showMatches={this.props.showMatches}
          setCountError={this._setCountError}
          propsIniciales={this.props}
          update={this.state.update}
          changeUpdate={this.changeUpdate}
          quadrantNotification={this._quadrantNotification}
        />
        )
      case 2:
        return (<LoopCamerasDisplay
          ref='myChild'
          error={this.state.error}
          loading={this.state.loading}
          places={this.state.camsCuadrante}
          toggleControlsBottom={this._toggleControlsBottom}
          recordignToggle={this._recordignToggle}
          loadingRcord={this.state.loadingRcord}
          isRecording={this.state.isRecording}
          recordingCams={this.state.recordingCams}
          recordingProcess={this.state.recordingProcess}
          loadingSnap={this.state.loadingSnap}
          downloadFiles={this._downloadFiles}
          loadingFiles={this.state.loadingFiles}
          makeReport={this._makeReport}
          moduleActions={this.state.moduleActions}
          matches={this.props.matches}
          snapShot={this._snapShot}
          changeStatus={this._chageCamStatus}
          showMatches={this.props.showMatches}
          setCountError={this._setCountError}
          propsIniciales={this.props}
          update={this.state.update}
          changeUpdate={this.changeUpdate}
        />)
      case 3:
        return (<div className="camUniqueHolder"><CameraStream marker={this.state.actualCamera} showButtons height={450} hideFileButton showFilesBelow moduleActions={this.state.moduleActions} setCountError={this._setCountError} arrayCamsNoStream={this.state.arrayCamsNoStream} /></div>)
      default:
        return null
    }
  }

  _changeName = (value) => {
    if (value === 'Otro') {
      this.setState({ flagOtroName: true })
    } else {
      this.setState({ valueNew: value })
    }

  }

  _deleteCuadrante = (cuadrante) => {
    if (window.confirm("¿Esta seguro de eliminar " + cuadrante.name + " ?")) {
      conections.deleteCuadrante(cuadrante.id).then((res) => {
        //console.log('resDelete',res)
        if (res.data.success) {
          this._loadCuadrantes()
        }
      })
    }

  }

  _loadCuadrantes = (quadrantFilter = false, params) => {
    if (params) {
      this.setState({ filterData: params });
    }

    let userId = JSON.parse(sessionStorage.getItem("isAuthenticated")).userInfo.user_id;

    this.setState({ loading: true })
    conections.getCuadrantes("user_id", userId).then((response) => {
      if (response.data.data.length !== 0) {
        this.setState({ cuadrantes: response.data.data })
        if (this.props.match.params.id) {
          if (!quadrantFilter) {
            this._camsCuadrante(this.props.match.params.id)
          } else {
            this._camsCuadrante(this.props.match.params.id, quadrantFilter.data)
          }
          this.setState({ cuadranteActual: this.props.match.params.id })
        }
        else {
          if (!quadrantFilter) {
            if (this.state.cuadrantes[0]) {
              this._camsCuadrante(this.state.cuadrantes[0].id);
              this.setState({ cuadranteActual: this.state.cuadrantes[0].id, is_quadrant_filter: false, filterData: [] });
            }
          } else {
            this._camsCuadrante(quadrantFilter.quadrant_id, quadrantFilter.data);
            this.setState({ cuadranteActual: quadrantFilter.quadrant_id, is_quadrant_filter: true })
          }

        }
      } else {
        this.setState({ loading: false })
      }

    })
  }

  _hideAndShowQuadrants = () => {
    let { showAllQuadrants } = this.state;
    this.setState({ showAllQuadrants: !showAllQuadrants })
  }

  _newCuadrante = (action) => {
    if (action)
      this.setState({ showInput: true, flagOtroName: false })
    else {
      this.setState({ showInput: false, flagOtroName: false })
      conections.newCuadrante({ name: this.state.valueNew, activo: 1 }).then((resNew) => {
        this.setState({ valueNew: '' })
        if (resNew.data.success) {
          this._loadCuadrantes()
        }
      })
    }

  }

  _hideModal = (id) => {
    this.setState({ showModal: false })
    if (id) {
      this.setState({ loading: true })
      this._camsCuadrante(id)
    }
  }

  _quadrantNotification = (info) => {
    const notification = this.notificationSystem.current;
    notification.addNotification({
      message: info.message,
      level: info.level,
      position: 'tc',
      title: info.title
    });
  };

  _addCams = (dataCam) => {
    //console.log('datadataCam',dataCam)
    this.setState({ showModal: true, cuadranteSelection: dataCam })
  }

  _camsCuadrante = (id, quadrantFilter) => {
    this.setState({ is_quadrant_filter: false });
    this.state.cuadrantes.map(item => {
      if (item.id === id) {
        this.setState({ cuadranteActual: item.id, arrayCamsNoStream: [] })
      }
      return item
    });
    if (!quadrantFilter) {
      conections.getCamsCuadrante(id).then((response) => {
        const camaras = response.data.data
        this._getQuadrants(camaras);
      }).catch(error => {
        this.setState({ loading: false, error: 'Error de conexion' })
      })
    } else {
      this._getQuadrants(quadrantFilter);
    }
  }

  _getQuadrants = (camaras) => {
    let auxCamaras = []
    let offlineCamaras = []
    let actualCamera = {}
    let title = ''
    let idCamera = null
    let index = 1
    let indexFail = 1
    if (camaras.length !== 0) {
      camaras.map(value => {
        //console.log('camara',value)
        if (value.active === 1 && value.flag_streaming === 1) {

          let urlHistory = null
          let urlHistoryPort = null

          if ("urlhistory" in value) {
            urlHistory = value.urlhistory
          }

          if ("urlhistoryport" in value) {
            urlHistoryPort = value.urlhistoryport
          }

          //let url = 'rtmp://18.212.185.68/live/cam';                                               
          auxCamaras.push({
            id: value.id,
            num_cam: index,
            lat: value.google_cordenate.split(',')[0],
            lng: value.google_cordenate.split(',')[1],
            name: value.street + ' ' + value.number + ', ' + value.township + ', ' + value.town + ', ' + value.state + ' #cam' + value.num_cam,
            isHls: true,
            url: urlHttpOrHttps(value.UrlStreamMediaServer.ip_url_ms, value.UrlStreamMediaServer.output_port, value.UrlStreamMediaServer.name, value.channel, value.UrlStreamMediaServer.protocol),
            dataCamValue: value,
            urlHistory: urlHistory,
            urlHistoryPort: urlHistoryPort
          })
          index = index + 1
          if (this.state.id_cam !== 0) {
            if (parseInt(this.state.id_cam) === value.id) {
              title = value.street + ' ' + value.number + ', ' + value.township + ', ' + value.town + ', ' + value.state
              actualCamera = {
                id: value.id,
                num_cam: value.num_cam,
                lat: value.google_cordenate.split(',')[0],
                lng: value.google_cordenate.split(',')[1],
                name: value.street + ' ' + value.number + ', ' + value.township + ', ' + value.town + ', ' + value.state,
                isHls: true,
                url: urlHttpOrHttps(value.UrlStreamMediaServer.ip_url_ms, value.UrlStreamMediaServer.output_port, value.UrlStreamMediaServer.name, value.channel, value.UrlStreamMediaServer.protocol),
                dataCamValue: value

              }
              idCamera = value.id
            }
          }

        } else {
          if (value.active === 1) {
            offlineCamaras.push({
              id: value.id,
              num_cam: indexFail,
              lat: value.google_cordenate.split(',')[0],
              lng: value.google_cordenate.split(',')[1],
              name: value.street + ' ' + value.number + ', ' + value.township + ', ' + value.town + ', ' + value.state + ' #cam' + value.num_cam,
              isHls: true,
              url: urlHttpOrHttps(value.UrlStreamMediaServer.ip_url_ms, value.UrlStreamMediaServer.output_port, value.UrlStreamMediaServer.name, value.channel, value.UrlStreamMediaServer.protocol),
              dataCamValue: value
            })
            indexFail++
          }
        }
        return true;
      })
    }
    if (idCamera == null) {
      this.setState({ camsCuadrante: auxCamaras, offlineCamaras: offlineCamaras, loading: false, error: undefined })
    } else {
      this.setState({ places: auxCamaras, offlineCamaras: offlineCamaras, loading: false, cameraID: idCamera, actualCamera: { title: title, extraData: actualCamera }, error: undefined })
      this.setState({ displayTipe: 3 })
    }
  }

  _recordignToggle = (selectedCamera) => {
    if (this.state.recordingCams.indexOf(selectedCamera) > -1) {
      let process_id = 0
      this.state.recordingProcess.map(value => {
        if (value.cam_id === selectedCamera.id) {
          process_id = value.process_id
        }
        return true
      })
      this.setState({ loadingRcord: true })

      conections.stopRecordV2({ clave: process_id }, selectedCamera.id)
        .then((r) => {
          const response = r.data
          if (response.success === true) {

            let stateRecordingProcess = this.state.recordingProcess
            let stateRecordingCams = this.state.recordingCams
            stateRecordingCams = stateRecordingCams.filter(el => el !== selectedCamera)
            stateRecordingProcess = stateRecordingProcess.filter(el => el.cam_id !== selectedCamera.id)
            this.setState({ recordingCams: stateRecordingCams, recordingProcess: stateRecordingProcess, isRecording: false, loadingRcord: false, modal: true, recordMessage: response.msg })
            this.refs.myChild._loadFiles()
          } else {
            let stateRecordingProcess = this.state.recordingProcess
            let stateRecordingCams = this.state.recordingCams
            stateRecordingCams = stateRecordingCams.filter(el => el !== selectedCamera)
            stateRecordingProcess = stateRecordingProcess.filter(el => el.cam_id !== selectedCamera.id)
            this.setState({ recordingCams: stateRecordingCams, recordingProcess: stateRecordingProcess, isRecording: false, loadingRcord: false, modal: true, recordMessage: response.msg })
          }
        })
    } else {
      conections.startRecordV2({}, selectedCamera.id)
        .then((r) => {
          const response = r.data
          if (response.success === true) {
            let recordingProcess = {
              cam_id: selectedCamera.id,
              process_id: response.clave,
              creation_time: moment()
            }
            let stateRecordingProcess = this.state.recordingProcess
            let stateRecordingCams = this.state.recordingCams
            stateRecordingProcess.push(recordingProcess)
            stateRecordingCams.push(selectedCamera)
            this.setState({ recordingCams: stateRecordingCams, recordingProcess: stateRecordingProcess, isRecording: true })
            if (this.state.interval === null) {
              let interval = setInterval(this._checkLiveTimeRecording, 5000)
              this.setState({ interval: interval })
            }
          }
        })
    }
  }

  _checkLiveTimeRecording = () => {
    if (this.state.recordingProcess.length > 0) {
      let now = moment()
      this.state.recordingProcess.map(value => {
        if (now.diff(value.creation_time, 'minutes') > 10) {

          conections.stopRecord({ record_proccess_id: value.process_id }).then(response => {
            let stateRecordingProcess = this.state.recordingProcess
            let stateRecordingCams = this.state.recordingCams
            stateRecordingCams = stateRecordingCams.filter(el => el.id !== value.cam_id)
            stateRecordingProcess = stateRecordingProcess.filter(el => el.cam_id !== value.cam_id)
            this.setState({ recordingCams: stateRecordingCams, recordingProcess: stateRecordingProcess, isRecording: false, loadingRcord: false })
            this.refs.myChild._loadFiles()
          })
        }
        return value
      })
    } else {
      clearInterval(this.interval)
      this.setState({ interval: null })
    }
  }

  _toggleControlsBottom = (marker) => {
    this.props.toggleControls(marker)
  }

  urlToPromise = (url) => {
    return new Promise(function (resolve, reject) {
      JSZipUtils.getBinaryContent(url, function (err, data) {
        if (err) reject(err);
        else resolve(data);
      });
    });
  };

  _downloadFiles = async (camera, { videos, photos, servidorMultimedia: server }) => {
    this.setState({ loadingFiles: true });

    let zip = new JSZip();
    if (photos && photos.length > 0) {
      let imgZip = zip.folder('images');
      photos.forEach((f) => {
        let filename = f.name;
        let portCam = "";

        if (camera.urlHistoryPort) {
          if (camera.urlHistoryPort != null) {
            portCam = camera.urlHistoryPort
          } else {
            portCam = "3000"
          }
        } else {
          portCam = "3000"
        }

        let url = `${server}:${portCam}/${f.relative_url}`;
        imgZip.file(filename, this.urlToPromise(url), { binary: true });
      });
    }
    if (videos && videos.length > 0) {
      let vdZip = zip.folder('videos');
      videos.forEach((f) => {
        let filename = f.name;
        let portCam = "";

        if (camera.urlHistoryPort) {
          if (camera.urlHistoryPort != null) {
            portCam = camera.urlHistoryPort
          } else {
            portCam = "3000"
          }
        } else {
          portCam = "3000"
        }

        let url = `${server}:${portCam}/${f.relative_url}`;
        vdZip.file(filename, this.urlToPromise(url), { binary: true });
      });
    }

    zip.generateAsync({ type: 'blob' }).then((content) => {
      // see FileSaver.js
      this.setState({ loadingFiles: false });
      saveAs(content, `cam_${camera.num_cam}.zip`);
    });
  };

  _setCountError = (num_cam) => {
    if (!this.state.arrayCamsNoStream.includes(num_cam)) {
      this.setState({ arrayCamsNoStream: [...this.state.arrayCamsNoStream, num_cam] });
    };

    console.log(this.state.arrayCamsNoStream);
  }
  _makeReport = (camera) => {
    this.setState({ modalProblem: true, cameraProblem: camera })
  }

  _renderModals = () => {
    return (
      <Fragment>
        <Modal size="lg" show={this.state.modalProblem} onHide={() => this.setState({ modalProblem: false, cameraProblem: {}, problemDescription: '', phones: [], mails: [] })}>
          <Modal.Header closeButton>
            Reportar problema en camara {this.state.cameraProblem.num_cam}
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Field>

                <Form.Field>
                  <Radio
                    label='Reportar emergencia'
                    name='typeReport'
                    value={1}
                    checked={this.state.typeReport === 1}
                    onChange={this.handleChange}
                  />
                </Form.Field>
                <Form.Field>
                  <Radio
                    label='Mantenimiento de camara'
                    name='typeReport'
                    value={2}
                    checked={this.state.typeReport === 2}
                    onChange={this.handleChange}
                  />
                </Form.Field>
              </Form.Field>
              {this.state.typeReport === 2 ? null : <Form.Field>
                <Label>
                  Se notificara a los numeros de emergencia registrados. Si se desea agregar un telefono extra ingreselo aqui indicando la lada del mismo(+525512345678).
                </Label>
                <Chips
                  value={this.state.phones}
                  onChange={this.onChange}
                  fromSuggestionsOnly={false}
                  createChipKeys={[' ', 13, 32]}
                />
              </Form.Field>}
              {this.state.typeReport === 2 ? null : <Form.Field>
                <Label>
                  Se notificara a los emails de emergencia registrados. Si se desea agregar un email extra ingreselo aqui.
                </Label>
                <Chips
                  value={this.state.mails}
                  onChange={this.onChangeMail}
                  fromSuggestionsOnly={false}
                  createChipKeys={[' ', 13, 32]}
                />
              </Form.Field>}
              <Form.Field>
                {this.state.typeReport === 2 ? <Label>
                  Se lo mas claro posible, indique si ha realizado
                  alguna accion para intentar resolver el problema.
                </Label> : <Label>
                  Indique la emergencia que se presento en la camara.
                </Label>}
                <TextArea
                  value={this.state.problemDescription}
                  onChange={this.handleChange}
                  rows={10}
                  name='problemDescription'
                  placeholder='Redacte aqui su problema'
                />
              </Form.Field>
            </Form>
            <Button className='pull-right' primary onClick={this._sendReport}>Enviar</Button>
          </Modal.Body>
        </Modal>

        <Modal size="lg" show={this.state.modal} onHide={() => this.setState({ modal: false })}>
          <Modal.Header closeButton>
            Grabacion terminada
          </Modal.Header>
          <Modal.Body>
            {this.state.recordMessage}
          </Modal.Body>
        </Modal>
      </Fragment>
    )
  }

  _snapShot = (camera) => {
    this.setState({ loadingSnap: true })

    conections.snapShotV2(camera.id, this.state.user_id)
      .then(response => {
        this.setState({ loadingSnap: false })
        const data = response.data
        if (data.success) {
          this.refs.myChild._loadFiles()
        }
      })
  }

  _chageCamStatus = (camera) => {
    conections.changeCamStatus(camera.id)
      .then(response => {
        // console.log(response)
        if (response.status === 200) {
          if (response.data.success) {
            const event = new Event('restartCamEvent')
            window.dispatchEvent(event)
          }
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  _searchModal = () => {
    return (
      <SearchCamera
        _setLoading={this._setLoading}
        showSearch={this.state.showSearch}
        handleClose={this._handleClose}
        is_covid={false}
        is_quadrant={true}
        quadrant_id={this.state.cuadranteActual}
        _loadCuadrantes={this._loadCuadrantes}
        filterData={this.state.filterData}
        _clear={this._clear}
      />
    )
  }

  _handleClose = () => {
    this.setState({ showSearch: false });
  }

  _setLoading = () => {
    this.setState({ loading: true, showSearch: false });
  }

  _clear = () => {
    this.setState({ filterData: [] });
  }

}

export default Cuadrantes;
