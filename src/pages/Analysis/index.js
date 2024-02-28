import React, { Component, Fragment } from 'react';
import { ToggleButton, ToggleButtonGroup, Modal, CloseButton } from 'react-bootstrap';
import { Icon, TextArea, Form, Label, Button, Radio, Tab } from 'semantic-ui-react';
// import { JellyfishSpinner } from 'react-spinners-kit';

import JSZipUtils from 'jszip-utils';
import saveAs from 'file-saver';
import Chips from 'react-chips';
import moment from 'moment';
import JSZip from 'jszip';

import conections from '../../conections';
import constants from '../../constants/constants';
import CameraStream from '../../components/CameraStream';
import GridCameraDisplay from '../../components/GridCameraDisplay';
import LoopCamerasDisplay from '../../components/LoopCamerasDisplay';
import SearchCamera from '../../components/SearchCamera';
import { urlHttpOrHttps } from '../../functions/urlHttpOrHttps';
import { MODE, LANG } from '../../constants/token';

import './style.css';
import '../../assets/styles/util.css';
import '../../assets/styles/main.css';
import '../../assets/fonts/iconic/css/material-design-iconic-font.min.css';

const TAB = {
  ONLINE: 0,
  OFFLINE: 1,
  DISCONNECTED: 2
}

const styles = {
  tab: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: 10
  }
}
class Analysis extends Component {
  state = {
    places: [],
    actualCamera: { title: '', extraData: {} },
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
    panes: [
      { menuItem: 'En línea', render: () => <Tab.Pane style={{ background: "transparent", color: localStorage.getItem(MODE) === "darkTheme" ? "white" : "black", border: localStorage.getItem(MODE) === "darkTheme" && "solid 1px lightgray" }} attached={false}>{this._renderOnlineTab()}</Tab.Pane> },
      { menuItem: 'Fuera de línea', render: () => <Tab.Pane style={{ background: "transparent", color: localStorage.getItem(MODE) === "darkTheme" ? "white" : "black", border: localStorage.getItem(MODE) === "darkTheme" && "solid 1px lightgray" }} attached={false}>{this._renderDisconnectedOfflineTab(false)}</Tab.Pane> },
      { menuItem: 'Desconectadas', render: () => <Tab.Pane style={{ background: "transparent", color: localStorage.getItem(MODE) === "darkTheme" ? "white" : "black", border: localStorage.getItem(MODE) === "darkTheme" && "solid 1px lightgray" }} attached={false}>{this._renderDisconnectedOfflineTab(true)}</Tab.Pane> }
    ],
    englishPanes: [
      { menuItem: 'Online', render: () => <Tab.Pane style={{ background: "transparent", color: localStorage.getItem(MODE) === "darkTheme" ? "white" : "black", border: localStorage.getItem(MODE) === "darkTheme" && "solid 1px lightgray" }} attached={false}>{this._renderOnlineTab()}</Tab.Pane> },
      { menuItem: 'Offline', render: () => <Tab.Pane style={{ background: "transparent", color: localStorage.getItem(MODE) === "darkTheme" ? "white" : "black", border: localStorage.getItem(MODE) === "darkTheme" && "solid 1px lightgray" }} attached={false}>{this._renderDisconnectedOfflineTab(false)}</Tab.Pane> },
      { menuItem: 'Disconnected', render: () => <Tab.Pane style={{ background: "transparent", color: localStorage.getItem(MODE) === "darkTheme" ? "white" : "black", border: localStorage.getItem(MODE) === "darkTheme" && "solid 1px lightgray" }} attached={false}>{this._renderDisconnectedOfflineTab(true)}</Tab.Pane> }
    ],
    offlineCamaras: [],
    disconnectedCameras: [],
    camerasQnap: [],
    showSearch: false,
    is_filter: false,
    filterData: [],
    activeIndex: TAB.ONLINE,
    filterOnLine: false,
    filterOff: false,
    filterDiss: false,
    arrayStatusCam: [],
  };

  componentDidMount() {
    if (!this.props.match.params.id) {
      const isValid = this.props.canAccess(2);
      if (!isValid) { this.props.history.push('/welcome'); }
      if (isValid.UserToModules[0]) { this.setState({ moduleActions: JSON.parse(isValid.UserToModules[0].actions) }); }
    } else {
      this.setState({ moduleActions: { btnrecord: true, btnsnap: true, viewHistorial: true }, id_cam: this.props.match.params.id });
    }
    this._loadCameras();
    window.addEventListener('restartCamEvent', this._loadCameras, false);
  }
  componentWillUnmount() {
    window.removeEventListener('restartCamEvent', this._loadCameras, false);
    this.state.recordingProcess.map((value) => {
      conections.stopRecord({ record_proccess_id: value.process_id }, value.cam_id)
      return value;
    });
  }

  render() {
    const { loading, panes, englishPanes, activeIndex } = this.state;
    return (
      <div style={{ background: localStorage.getItem(MODE) === "darkTheme" ? "rgb(12, 48, 78)" : "white" }}>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", position: 'absolute', background: localStorage.getItem(MODE) === "darkTheme" ? "rgb(12, 48, 78)" : "transparent", width: '100%', height: "100%", transition: "all 0.25s linear" }} align="center">
            <img
              className="spinner"
              src={constants.urlPath}
              style={{ width: "12rem", height: "12rem", borderRadius: "50%" }}
              alt={constants.urlPath} />
          </div>
        ) : (
          <div id="analisis_holder" style={{ background: "transparent", color: "red !important" }} className={!this.props.showMatches ? 'hide-matches' : 'show-matches'}>
            {
              window.location.pathname === "/analisis" ? <Tab
                menu={{ color: localStorage.getItem(MODE) === "darkTheme" ? "rgb(12, 48, 78)" : "white", inverted: localStorage.getItem(MODE) === "darkTheme" ? true : false, secondary: true, pointing: true }}
                panes={localStorage.getItem(LANG) === "english" ? englishPanes : panes}
                onTabChange={this.handleChangeTab}
                defaultActiveIndex={activeIndex}
              />
                :
                this._renderOnlineTab()
            }
            {this._renderModals()}
            {this._searchModal()}
          </div>
        )}
      </div>
    );
  }

  handleChangeTab = (e, data,) => {
    this.setState({ activeIndex: data.activeIndex });
  }

  _filterButtons = (data, is_visible) => {
    return (
      <div style={styles.tab} className='col-12'>
        {/*  */}
        <Button id="download-button" onClick={() => this._statusRevision()} style={{ display: "none" }}>Descargar</Button>
        {(data.length > 0 || is_visible) && <Button onClick={() => this.setState({ showSearch: true })} >{localStorage.getItem(LANG) === "english" ? "Filter" : "Filtrar"}</Button>}
        {(is_visible) && <Button onClick={() => this._loadCameras()}>{localStorage.getItem(LANG) === "english" ? "Delete filter" : "Limpiar filtro"}</Button>}
      </div>
    )
  }

  // Components Render
  _renderDisconnectedOfflineTab = (isDisconnected) => {
    let { error, loading, disconnectedCameras, offlineCamaras, loadingRcord, isRecording, recordingCams, recordingProcess, loadingSnap, loadingFiles, moduleActions, activeIndex, filterOff, filterDiss } = this.state;
    let { matches, showMatches } = this.props;
    return (
      <div>
        {TAB.OFFLINE === activeIndex ? this._filterButtons(offlineCamaras, filterOff) : this._filterButtons(disconnectedCameras, filterDiss)}
        <GridCameraDisplay
          ref="myChild"
          error={error}
          loading={loading}
          places={isDisconnected ? disconnectedCameras : offlineCamaras}
          toggleControlsBottom={this._toggleControlsBottom}
          recordignToggle={this._recordignToggle}
          loadingRcord={loadingRcord}
          isRecording={isRecording}
          recordingCams={recordingCams}
          recordingProcess={recordingProcess}
          loadingSnap={loadingSnap}
          downloadFiles={this._downloadFiles}
          loadingFiles={loadingFiles}
          makeReport={this._makeReport}
          moduleActions={moduleActions}
          matches={matches}
          snapShot={this._snapShot}
          changeStatus={this._chageCamStatus}
          showMatches={showMatches}
          propsIniciales={this.props}
          theme={this.props}
          is_filter={TAB.OFFLINE === activeIndex ? filterOff : filterDiss}
        />
      </div>
    );
  };
  _renderOnlineTab = () => {
    let { displayTipe, loading, cameraID, places, filterOnLine } = this.state;
    return (
      <Fragment>
        {displayTipe !== 3 && !loading ? (
          <Fragment>
            {this._filterButtons(places, filterOnLine)}
            {
              places.length > 0 &&
              <div className="toggleViewButton row">
                <ToggleButtonGroup className="col-12" type="radio" name="options" defaultValue={2} onChange={this._changeDisplay} value={displayTipe}>
                  <ToggleButton value={1} variant="outline-dark"><Icon name="grid layout" /></ToggleButton>
                  <ToggleButton value={2} variant="outline-dark"><Icon name="clone" /></ToggleButton>
                  {cameraID && (<ToggleButton value={3} variant="outline-dark"><Icon name="square" /></ToggleButton>)}
                </ToggleButtonGroup>
              </div>
            }
          </Fragment>
        ) : null}
        <div
          style={{ position: 'absolute', top: '30%', background: 'transparent', width: '100%' }}
          align="center"
        />
        {this._showDisplay()}
      </Fragment>
    );
  };
  _renderModals = () => {
    let { modalProblem, cameraProblem, typeReport, phones, mails, problemDescription, modal, recordMessage } = this.state;
    return (
      <Fragment>
        <Modal style={{ color: localStorage.getItem(MODE) === "darkTheme" && "white" }} size="lg" show={modalProblem} onHide={() => this.setState({ modalProblem: false, cameraProblem: {}, problemDescription: '', phones: [], mails: [] })}>
          <Modal.Header className={localStorage.getItem(MODE) === "darkTheme" && "darkTheme"}>{localStorage.getItem(LANG) === "english" ? `Report problem in camera ${cameraProblem.num_cam}` : `Reportar problema en cámara ${cameraProblem.num_cam}`}<CloseButton onClick={this._closeModal} style={{ color: localStorage.getItem(MODE) === "darkTheme" && "red" }} /></Modal.Header>
          <Modal.Body className={localStorage.getItem(MODE) === "darkTheme" && "darkTheme"}>
            <Form>
              <Form.Field>
                <Form.Field>
                  <Radio
                    name="typeReport"
                    value={1}
                    checked={typeReport === 1}
                    onChange={this.handleChange}
                  />
                  <Label style={{ background: "transparent", color: localStorage.getItem(MODE) === "darkTheme" && "white" }}>
                    {localStorage.getItem(LANG) === "english" ? "Report emergency" : "Reportar emergencia"}
                  </Label>
                </Form.Field>
                <Form.Field>
                  <Radio
                    name="typeReport"
                    value={2}
                    checked={typeReport === 2}
                    onChange={this.handleChange}
                  />
                  <Label style={{ background: "transparent", color: localStorage.getItem(MODE) === "darkTheme" && "white" }}>
                    {localStorage.getItem(LANG) === "english" ? "Camera maintenance" : "Mantenimiento de cámara"}
                  </Label>
                </Form.Field>
              </Form.Field>
              {typeReport !== 2 && (
                <Form.Field>
                  <Label>
                    {localStorage.getItem(LANG) === "english" ?
                      "Registered emergency numbers will be notified. If you want to add an extra phone, enter it here indicating the area code."
                      :
                      "Se notificará a los números de emergencia registrados. Si se desea agregar un teléfono extra, ingréselo aquí indicando la LADA del mismo (Ejemplo: +525512345678)."
                    }
                  </Label>
                  <Chips
                    value={phones}
                    onChange={this.onChange}
                    fromSuggestionsOnly={false}
                    createChipKeys={[' ', 13, 32]}
                  />
                </Form.Field>
              )}
              {typeReport !== 2 && (
                <Form.Field>
                  <Label>
                    {localStorage.getItem(LANG) === "english" ?
                      "Registered emergency emails will be notified. If you want to add an extra email, enter it here."
                      :
                      "Se notificará a los emails de emergencia registrados. Si se desea agregar un email extra, ingréselo aquí."
                    }
                  </Label>
                  <Chips
                    value={mails}
                    onChange={this.onChangeMail}
                    fromSuggestionsOnly={false}
                    createChipKeys={[' ', 13, 32]}
                  />
                </Form.Field>
              )}
              <Form.Field>
                {typeReport === 2 ? (
                  <Label>
                    {localStorage.getItem(LANG) === "english" ?
                      "Please be as clear as possible and indicate if you have taken any action to try to resolve the issue."
                      :
                      "Por favor sea lo más claro posible e indique si ha realizado alguna acción para intentar resolver el problema."
                    }
                  </Label>
                ) : (
                  <Label>
                    {localStorage.getItem(LANG) === "english" ?
                      "Please indicate the emergency that arose in the camera."
                      :
                      "Por favor indique la emergencia que se presentó en la cámara."
                    }
                  </Label>
                )}
                <TextArea
                  value={problemDescription}
                  onChange={this.handleChange}
                  rows={10}
                  name="problemDescription"
                  placeholder={localStorage.getItem(LANG) === "english" ? "Write your problem here" : "Redacte su problema aquí"}
                />
              </Form.Field>
            </Form>
            <Button className="pull-right" primary onClick={this._sendReport}>
              {localStorage.getItem(LANG) === "english" ? "Send" : "Enviar"}
            </Button>
          </Modal.Body>
        </Modal>
        <Modal style={{ color: localStorage.getItem(MODE) === "darkTheme" && "white" }} size="lg" show={modal} onHide={() => this.setState({ modal: false })}>
          <Modal.Header className={localStorage.getItem(MODE) === "darkTheme" && "darkTheme"} closeButton>{localStorage.getItem(LANG) === "english" ? "Finished recording" : "Grabación terminada"}</Modal.Header>
          <Modal.Body className={localStorage.getItem(MODE) === "darkTheme" && "darkTheme"}>{recordMessage}</Modal.Body>
        </Modal>
      </Fragment>
    );
  };

  // Functions
  onChange = (chips) => {
    this.setState({ phones: chips });
  };
  onChangeMail = (chips) => {
    this.setState({ mails: chips });
  };
  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value });
  };

  _closeModal = () => {
    this.setState({ modalProblem: false })
  }

  _sendReport = () => {
    this.setState({ modalProblem: false });
    conections.sendTicket({
      camera_id: this.state.cameraProblem.id,
      problem: this.state.problemDescription,
      phones: this.state.phones.join(),
      mails: this.state.mails.join(),
      type_report: this.state.typeReport,
      user_id: 1
    })
      .then((response) => {
        const data = response.data;
        this.setState({ cameraProblem: {}, problemDescription: '' });
        if (data.success) {
          localStorage.getItem(LANG) === "english" ? alert('Ticket created successfully') : alert('Ticket creado correctamente')
        } else {
          localStorage.getItem(LANG) === "english" ? alert('Failed to create ticket') : alert('Error al crear ticket')
        }
      });
  };
  _snapShot = (camera) => {
    this.setState({ loadingSnap: true });

    conections.snapShotV2(camera.id, this.state.user_id).then((response) => {
      this.setState({ loadingSnap: false });
      const data = response.data;
      if (data.success) {
        //console.log('refs',this.refs)
        //this.refs.myChild._loadFiles()
      }
    });
  };
  _recordignToggle = (selectedCamera) => {
    if (this.state.recordingCams.indexOf(selectedCamera) > -1) {
      let process_id = 0;
      this.state.recordingProcess.map((value) => {
        if (value.cam_id === selectedCamera.id) {
          process_id = value.process_id;
        }
        return true;
      });
      this.setState({ loadingRcord: true });

      conections.stopRecordV2({ clave: process_id }, selectedCamera.id).then((r) => {
        const response = r.data;
        if (response.success === true) {
          let stateRecordingProcess = this.state.recordingProcess;
          let stateRecordingCams = this.state.recordingCams;
          stateRecordingCams = stateRecordingCams.filter((el) => el !== selectedCamera);
          stateRecordingProcess = stateRecordingProcess.filter((el) => el.cam_id !== selectedCamera.id);
          this.setState({
            recordingCams: stateRecordingCams,
            recordingProcess: stateRecordingProcess,
            isRecording: false,
            loadingRcord: false,
            modal: true,
            recordMessage: response.msg
          });
          this.refs.myChild._loadFiles();
        } else {
          let stateRecordingProcess = this.state.recordingProcess;
          let stateRecordingCams = this.state.recordingCams;
          stateRecordingCams = stateRecordingCams.filter((el) => el !== selectedCamera);
          stateRecordingProcess = stateRecordingProcess.filter((el) => el.cam_id !== selectedCamera.id);
          this.setState({
            recordingCams: stateRecordingCams,
            recordingProcess: stateRecordingProcess,
            isRecording: false,
            loadingRcord: false,
            modal: true,
            recordMessage: response.msg
          });
        }
      });
    } else {
      conections.startRecordV2({}, selectedCamera.id).then((r) => {
        const response = r.data;
        if (response.success === true) {
          let recordingProcess = {
            cam_id: selectedCamera.id,
            process_id: response.clave,
            creation_time: moment()
          };
          let stateRecordingProcess = this.state.recordingProcess;
          let stateRecordingCams = this.state.recordingCams;
          stateRecordingProcess.push(recordingProcess);
          stateRecordingCams.push(selectedCamera);
          this.setState({
            recordingCams: stateRecordingCams,
            recordingProcess: stateRecordingProcess,
            isRecording: true
          });
          if (this.state.interval === null) {
            let interval = setInterval(this._checkLiveTimeRecording, 5000);
            this.setState({ interval: interval });
          }
        }
      });
    }
  };
  _checkLiveTimeRecording = () => {
    if (this.state.recordingProcess.length > 0) {
      let now = moment();
      this.state.recordingProcess.map((value) => {
        if (now.diff(value.creation_time, 'minutes') > 10) {
          conections.stopRecord({ record_proccess_id: value.process_id }).then((response) => {
            let stateRecordingProcess = this.state.recordingProcess;
            let stateRecordingCams = this.state.recordingCams;
            stateRecordingCams = stateRecordingCams.filter((el) => el.id !== value.cam_id);
            stateRecordingProcess = stateRecordingProcess.filter((el) => el.cam_id !== value.cam_id);
            this.setState({
              recordingCams: stateRecordingCams,
              recordingProcess: stateRecordingProcess,
              isRecording: false,
              loadingRcord: false
            });
            this.refs.myChild._loadFiles();
          });
        }
        return value;
      });
    } else {
      clearInterval(this.interval);
      this.setState({ interval: null });
    }
  };
  _makeReport = (camera) => {
    this.setState({ modalProblem: true, cameraProblem: camera });
  };
  _showDisplay = () => {
    let { displayTipe, error, loading, places, loadingRcord, isRecording, recordingCams, recordingProcess, loadingSnap, loadingFiles, moduleActions, actualCamera, activeIndex, filterOnLine } = this.state;
    let { matches, showMatches } = this.props;
    switch (displayTipe) {
      case 1:
        return (
          window.location.pathname === "/analisis" && <GridCameraDisplay
            ref="myChild"
            error={error}
            loading={loading}
            places={places}
            toggleControlsBottom={this._toggleControlsBottom}
            recordignToggle={this._recordignToggle}
            loadingRcord={loadingRcord}
            isRecording={isRecording}
            recordingCams={recordingCams}
            recordingProcess={recordingProcess}
            loadingSnap={loadingSnap}
            downloadFiles={this._downloadFiles}
            loadingFiles={loadingFiles}
            makeReport={this._makeReport}
            moduleActions={moduleActions}
            matches={matches}
            snapShot={this._snapShot}
            changeStatus={this._chageCamStatus}
            showMatches={showMatches}
            propsIniciales={this.props}
            is_filter={activeIndex === TAB.ONLINE ? filterOnLine : false}
          />
        );
      case 2:
        return (
          <LoopCamerasDisplay
            ref="myChild"
            error={error}
            loading={loading}
            places={places}
            toggleControlsBottom={this._toggleControlsBottom}
            recordignToggle={this._recordignToggle}
            loadingRcord={loadingRcord}
            isRecording={isRecording}
            recordingCams={recordingCams}
            recordingProcess={recordingProcess}
            loadingSnap={loadingSnap}
            downloadFiles={this._downloadFiles}
            loadingFiles={loadingFiles}
            makeReport={this._makeReport}
            moduleActions={moduleActions}
            matches={matches}
            snapShot={this._snapShot}
            changeStatus={this._chageCamStatus}
            propsIniciales={this.props}
          />
        );
      case 3:
        return (
          <div className="camUniqueHolder">
            <CameraStream
              marker={actualCamera}
              showButtons
              height={450}
              hideFileButton
              showFilesBelow
              moduleActions={moduleActions}
              propsIniciales={this.props}
            // setCountError={this._setCountError}
            />
          </div>
        );
      default:
        return null;
    }
  };

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

  _toggleControlsBottom = (marker) => {
    this.props.toggleControls(marker);
  };
  _changeDisplay = (value) => {
    this.setState({ displayTipe: value });
  };
  _loadCameras = () => {
    this.setState({ loading: true, is_filter: false, filterData: [], activeIndex: 0, filterButton: false, filterOnLine: false, filterDiss: false, filterOff: false });
    conections.getAllCams()
      .then((response) => {
        const camaras = response.data;
        let auxCamaras = [], offlineCamaras = [];
        let disconnectedCameras = [], actualCamera = {};
        let title = '', idCamera = null;
        let index = 1;

        camaras.map((value) => {
          if (value.active === 1 && value.flag_streaming === 1 && value.UrlStreamMediaServer) {
            let urlHistory = null, urlHistoryPort = null;

            if ("urlhistory" in value) {
              urlHistory = value.urlhistory
            }

            if ("urlhistoryport" in value) {
              urlHistoryPort = value.urlhistoryport
            }

            auxCamaras.push({
              id: value.id,
              num_cam: index,
              lat: value.google_cordenate.split(',')[0],
              lng: value.google_cordenate.split(',')[1],
              name: `${value.street} ${value.number}, ${value.township}, ${value.town}, ${value.state} #cam${value.num_cam}`,
              rel_cuadrante: value.RelCuadranteCams,
              isHls: true,
              url: urlHttpOrHttps(value.UrlStreamMediaServer.ip_url_ms, value.UrlStreamMediaServer.output_port, value.UrlStreamMediaServer.name, value.channel, value.UrlStreamMediaServer.protocol),
              real_num_cam:
                value.num_cam < 10 ? '0' + value.num_cam.toString() : value.num_cam.toString(),
              camera_number: value.num_cam,
              dataCamValue: value,
              urlHistory: urlHistory,
              urlHistoryPort: urlHistoryPort
            });
            index = index + 1;
            if (this.state.id_cam !== 0) {
              if (parseInt(this.state.id_cam) === value.id) {
                title = `${value.street} ${value.number}, ${value.township}, ${value.town}, ${value.state}`;
                actualCamera = {
                  id: value.id,
                  num_cam: value.num_cam,
                  lat: value.google_cordenate.split(',')[0],
                  lng: value.google_cordenate.split(',')[1],
                  name: `${value.street} ${value.number}, ${value.township}, ${value.town}, ${value.state}`,
                  isHls: true,
                  url: urlHttpOrHttps(value.UrlStreamMediaServer.ip_url_ms, value.UrlStreamMediaServer.output_port, value.UrlStreamMediaServer.name, value.channel, value.UrlStreamMediaServer.protocol),
                  real_num_cam:
                    value.num_cam < 10 ? '0' + value.num_cam.toString() : value.num_cam.toString(),
                  camera_number: value.num_cam,
                  dataCamValue: value
                };
                idCamera = value.id;
              }
            }
          }
          return true;
        });

        conections.getCamsOffline().then((res) => {
          let indexFail = 1;
          const offline = res.data;
          offline.map((valueoff) => {
            if (valueoff.UrlStreamMediaServer) {
              if (valueoff.active === 1) {
                offlineCamaras.push({
                  id: valueoff.id,
                  num_cam: indexFail,
                  lat: valueoff.google_cordenate.split(',')[0],
                  lng: valueoff.google_cordenate.split(',')[1],
                  name: `${valueoff.street} ${valueoff.number}, ${valueoff.township}, ${valueoff.town}, ${valueoff.state} #cam${valueoff.num_cam}`,
                  isHls: true,
                  url: urlHttpOrHttps(valueoff.UrlStreamMediaServer.ip_url_ms, valueoff.UrlStreamMediaServer.output_port, valueoff.UrlStreamMediaServer.name, valueoff.channel, valueoff.UrlStreamMediaServer.protocol),
                  real_num_cam:
                    valueoff.num_cam < 10
                      ? '0' + valueoff.num_cam.toString()
                      : valueoff.num_cam.toString(),
                  camera_number: valueoff.num_cam,
                  dataCamValue: valueoff
                });
                indexFail++;
              } else {
                disconnectedCameras.push({
                  id: valueoff.id,
                  num_cam: indexFail,
                  lat: valueoff.google_cordenate.split(',')[0],
                  lng: valueoff.google_cordenate.split(',')[1],
                  name: `${valueoff.street} ${valueoff.number}, ${valueoff.township}, ${valueoff.town}, ${valueoff.state} #cam${valueoff.num_cam}`,
                  isHls: true,
                  url: urlHttpOrHttps(valueoff.UrlStreamMediaServer.ip_url_ms, valueoff.UrlStreamMediaServer.output_port, valueoff.UrlStreamMediaServer.name, valueoff.channel, valueoff.UrlStreamMediaServer.protocol),
                  real_num_cam:
                    valueoff.num_cam < 10
                      ? '0' + valueoff.num_cam.toString()
                      : valueoff.num_cam.toString(),
                  camera_number: valueoff.num_cam,
                  dataCamValue: valueoff
                });
                indexFail++;
              }
            }

            return true;
          });
        });

        if (idCamera === null) {
          this.setState({
            places: auxCamaras,
            disconnectedCameras: disconnectedCameras,
            offlineCamaras: offlineCamaras,
            loading: false,
            error: undefined
          });
        } else {
          this.setState({
            places: auxCamaras,
            disconnectedCameras: disconnectedCameras,
            offlineCamaras: offlineCamaras,
            loading: false,
            cameraID: idCamera,
            actualCamera: { title: title, extraData: actualCamera },
            error: undefined
          });
          this.setState({ displayTipe: 3 });
        }

      })
      .catch((error) => {
        this.setState({ loading: false, error: localStorage.getItem(LANG) === "english" ? 'Connection error' : 'Error de conexion' });
      });
  };
  _chageCamStatus = (camare) => {
    conections.changeCamStatus(camare.id)
      .then((response) => {
        // console.log(response);
        if (response.status === 200) {
          if (response.data.success) {
            const event = new Event('restartCamEvent');
            window.dispatchEvent(event);
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  _statusRevision = () => {

    const { places, offlineCamaras, disconnectedCameras, activeIndex } = this.state;
    let cameras = activeIndex === 0 ? places : activeIndex === 1 ? offlineCamaras : activeIndex === 2 && disconnectedCameras;
    let auxRevision = [];

    cameras.forEach(el => {

      let status_cam = el.dataCamValue.active === 1 ? el.dataCamValue.flag_streaming === 1 ? "Online" : "Offline" : "Disconnect";

      conections.getStreamingStatus(el.url).then(() => {

        let newCam = {
          num_cam: el.dataCamValue.num_cam,
          status_cam,
          status_streaming: "Con Streaming",
        };
        auxRevision.push(newCam);
      })
        .catch(() => {
          let newCam = {
            num_cam: el.dataCamValue.num_cam,
            status_cam,
            status_streaming: "Sin Streaming",
          };
          auxRevision.push(newCam);
        });
    });

    setTimeout(() => {
      console.warn("Process ended to revision");
      this.setState({ arrayStatusCam: [...auxRevision] });
      localStorage.setItem("arrayStatusCam", JSON.stringify(auxRevision));
    }, (cameras.length * 15) + 2000);

  };

  _searchModal = () => {
    return (
      <SearchCamera
        statusRevision={this._statusRevision}
        _filterCameras={this._filterCameras}
        _setLoading={this._setLoading}
        showSearch={this.state.showSearch}
        handleClose={this._handleClose}
        is_covid={false}
        is_quadrant={false}
        filterData={this.state.filterData}
        _clear={this._clear}
        tab={this.state.activeIndex}
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

  _filterCameras = (cameras, offline, params) => {
    if (params) {
      this.setState({ filterData: params });
      if (params.activeIndex !== undefined) {
        this.handleChangeTab(null, params);
      }
    }
    let auxCamaras = [], offlineCamaras = [], disconnectedCameras = [];
    let actualCamera = {}, title = '';
    let idCamera = null, index = 1;

    if (cameras.length > 0) {
      cameras.forEach((value) => {
        if (value.active === 1 && value.flag_streaming === 1) {
          let urlHistory = null, urlHistoryPort = null;

          if ("urlhistory" in value) {
            urlHistory = value.urlhistory;
          }

          if ("urlhistoryport" in value) {
            urlHistoryPort = value.urlhistoryport;
          }

          auxCamaras.push({
            id: value.id,
            num_cam: index,
            lat: value.google_cordenate.split(',')[0],
            lng: value.google_cordenate.split(',')[1],
            name: `${value.street} ${value.number}, ${value.township}, ${value.town}, ${value.state} #cam${value.num_cam}`,
            rel_cuadrante: value.RelCuadranteCams,
            isHls: true,
            url: urlHttpOrHttps(value.UrlStreamMediaServer.ip_url_ms, value.UrlStreamMediaServer.output_port, value.UrlStreamMediaServer.name, value.channel, value.UrlStreamMediaServer.protocol),
            real_num_cam:
              value.num_cam < 10 ? '0' + value.num_cam.toString() : value.num_cam.toString(),
            camera_number: value.num_cam,
            dataCamValue: value,
            urlHistory: urlHistory,
            urlHistoryPort: urlHistoryPort
          });
          index = index + 1;
          if (this.state.id_cam !== 0) {
            if (parseInt(this.state.id_cam) === value.id) {
              title = `${value.street} ${value.number}, ${value.township}, ${value.town}, ${value.state}`;
              actualCamera = {
                id: value.id,
                num_cam: value.num_cam,
                lat: value.google_cordenate.split(',')[0],
                lng: value.google_cordenate.split(',')[1],
                name: `${value.street} ${value.number}, ${value.township}, ${value.town}, ${value.state}`,
                isHls: true,
                url: urlHttpOrHttps(value.UrlStreamMediaServer.ip_url_ms, value.UrlStreamMediaServer.output_port, value.UrlStreamMediaServer.name, value.channel, value.UrlStreamMediaServer.protocol),
                real_num_cam:
                  value.num_cam < 10 ? '0' + value.num_cam.toString() : value.num_cam.toString(),
                camera_number: value.num_cam,
                dataCamValue: value
              };
              idCamera = value.id;
            }
          }
        }
        return true;
      });
    }

    if (offline.length > 0) {
      let indexFail = 1;
      offline.forEach((valueoff) => {
        if (valueoff.active === 1) {
          offlineCamaras.push({
            id: valueoff.id,
            num_cam: indexFail,
            lat: valueoff.google_cordenate.split(',')[0],
            lng: valueoff.google_cordenate.split(',')[1],
            name: `${valueoff.street} ${valueoff.number}, ${valueoff.township}, ${valueoff.town}, ${valueoff.state} #cam${valueoff.num_cam}`,
            isHls: true,
            url: urlHttpOrHttps(valueoff.UrlStreamMediaServer.ip_url_ms, valueoff.UrlStreamMediaServer.output_port, valueoff.UrlStreamMediaServer.name, valueoff.channel, valueoff.UrlStreamMediaServer.protocol),
            real_num_cam:
              valueoff.num_cam < 10
                ? '0' + valueoff.num_cam.toString()
                : valueoff.num_cam.toString(),
            camera_number: valueoff.num_cam,
            dataCamValue: valueoff
          });
          indexFail++;
        }

        if (valueoff.active === 0) {
          disconnectedCameras.push({
            id: valueoff.id,
            num_cam: indexFail,
            lat: valueoff.google_cordenate.split(',')[0],
            lng: valueoff.google_cordenate.split(',')[1],
            name: `${valueoff.street} ${valueoff.number}, ${valueoff.township}, ${valueoff.town}, ${valueoff.state} #cam${valueoff.num_cam}`,
            isHls: true,
            url: urlHttpOrHttps(valueoff.UrlStreamMediaServer.ip_url_ms, valueoff.UrlStreamMediaServer.output_port, valueoff.UrlStreamMediaServer.name, valueoff.channel, valueoff.UrlStreamMediaServer.protocol),
            real_num_cam:
              valueoff.num_cam < 10
                ? '0' + valueoff.num_cam.toString()
                : valueoff.num_cam.toString(),
            camera_number: valueoff.num_cam,
            dataCamValue: valueoff
          });
          indexFail++;
        }
        return true;
      });
    }

    if (idCamera === null) {
      if (this.state.activeIndex === TAB.ONLINE) {
        this.setState({
          places: auxCamaras,
          loading: false,
          error: undefined,
          filterOnLine: true
        });
      }
      if (this.state.activeIndex === TAB.OFFLINE) {
        this.setState({
          offlineCamaras: offlineCamaras,
          loading: false,
          error: undefined,
          filterOff: true
        });
      }
      if (this.state.activeIndex === TAB.DISCONNECTED) {
        this.setState({
          disconnectedCameras: disconnectedCameras,
          loading: false,
          error: undefined,
          filterDiss: true
        });
      }
    } else {
      if (this.state.activeIndex === TAB.ONLINE) {
        this.setState({
          places: auxCamaras,
          loading: false,
          cameraID: idCamera,
          actualCamera: { title: title, extraData: actualCamera },
          error: undefined,
          displayTipe: 3,
          filterOnLine: true
        });
      }
      if (this.state.activeIndex === TAB.OFFLINE) {
        this.setState({
          offlineCamaras: offlineCamaras,
          loading: false,
          cameraID: idCamera,
          actualCamera: { title: title, extraData: actualCamera },
          error: undefined,
          displayTipe: 3,
          filterOff: true
        });
      }
      if (this.state.activeIndex === TAB.DISCONNECTED) {
        this.setState({
          disconnectedCameras: disconnectedCameras,
          loading: false,
          cameraID: idCamera,
          actualCamera: { title: title, extraData: actualCamera },
          error: undefined,
          displayTipe: 3,
          filterDiss: true
        });
      }
    }
  }

}

export default Analysis;
