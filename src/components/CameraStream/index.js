import React, { Component } from 'react';
import { Card, Row, Col, Modal } from 'react-bootstrap';
import { Button, Form, Label, TextArea, Radio, Tab } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { DateTime } from 'luxon';

import { FaClipboardCheck, FaClipboard } from 'react-icons/fa';

import Spinner from 'react-bootstrap/Spinner';
import JSZipUtils from 'jszip-utils';
import saveAs from 'file-saver';
import Chips from 'react-chips';
import jsmpeg from 'jsmpeg';
import moment from 'moment';
import JSZip from 'jszip';
import NotificationSystem from 'react-notification-system';

import HlsPlayer from '../HlsPlayer';
import WssPlayer from '../WssPlayer';
import RtmpPlayer from '../RtmpPlayer';
import ControlPTZ from '../ControlPTZ';
import conections from '../../conections';
import AdvancedSearch from '../AdvancedSearch';
import MediaContainer from '../MediaContainer';
// import constants from '../../constants/constants';
import ModalMoreInformation from '../../components/ModalMoreInformation';
import PaginationList from '../GridCameraDisplay/pagination';
import { HiMicrophone } from 'react-icons/hi';

import * as QvrFileStationActions from '../../store/reducers/QvrFileStation/actions';
import * as QvrFunctions from '../../functions/getQvrFunctions';
import { removeSpaces } from '../../functions/removeSpaces';
import axios from "axios"
import Strings from '../../constants/strings';

import copy from 'copy-to-clipboard'

import { LANG, MODE } from '../../constants/token';
import './style.css';
// import AdvancedSearchNotqnap from '../AdvancedSearchNotqnap';

const SHOW_HISTORY = 3;
var vis = (function () {
  var stateKey,
    eventKey,
    keys = { hidden: 'visibilitychange', webkitHidden: 'webkitvisibilitychange', mozHidden: 'mozvisibilitychange', msHidden: 'msvisibilitychange' };
  for (stateKey in keys) {
    if (stateKey in document) {
      eventKey = keys[stateKey];
      break;
    }
  }
  return function (c) {
    if (c) document.addEventListener(eventKey, c);
    return !document[stateKey];
  };
})();
class CameraStream extends Component {
  notificationSystem = React.createRef();
  state = {
    scroll: [],
    hasMore: true,
    scrollInitialDate: moment().startOf('date'),
    activeIndex: 0,
    fullHeight: 10,
    cameraID: '',
    cameraName: '',
    data: {},
    webSocket: null,
    player: null,
    showData: false,
    photos: [],
    videos: [],
    video_history: [],
    video_search: [],
    video_fistHistory: [],
    video_loadMoreHistory: [],
    video_advancedSearch: [],
    typeMBOX: null,
    arrPares: [],
    dnsArray: null,
    apiStorageKey: null,
    camURL: null,
    portContainer: null,
    resHistorySearch: null,
    dnsPort: 0,
    dnsContainer: null,
    countArray: 1,
    awsApiStreamsCams: false,
    inputCkecked: false,
    inputCkeckedBusqueda: false,
    moduleSearch: false,
    completeCamera: null,
    qnapServer: null,
    qnapChannel: null,
    display: 'auto',
    interval: null,
    isLoading: false,
    videosLoading: false,
    historyLoading: false,
    searchLoading: false,
    isNewSearch: false,
    isRecording: false,
    process_id: 0,
    loadingSnap: false,
    loadingFiles: false,
    tryReconect: false,
    recordMessage: '',
    modal: false,
    lastCurrentTime: 0,
    lastCurrentFrame: 0,
    isVisible: true,
    limit: 10,
    start: 0,
    pageCount: 1,
    isPlay: true,
    worker: null,
    modalProblem: false,
    problemDescription: '',
    typeReport: 1,
    phones: [],
    mails: [],
    restarting: false,
    servidorMultimedia: '',
    showModalMoreInformation: false,
    photosLoading: false,
    showPTZ: false,
    copyButton: false,
    copyText: "",
    copyCam: 0,
    loadingHistorics: false,
    historicalUser: null,
    historicalPassword: null,
    historyServerDns: null,
    historyServerProtocol: null,
    countDays: null,
    arrayHistoricsByHour: [],
    arrayWeek: [],
    historicCurrentDay: 0,
  };

  lastDecode = null;
  tryReconect = false;

  render() {

    let { activeIndex, display, num_cam, cameraID, cameraName, showData, photos, data, qnapServer, qnapChannel, servidorMultimedia, photosLoading, videosLoading, videos, historyLoading, video_history, searchLoading, isNewSearch, video_search, tryReconect, showModalMoreInformation, loadingSnap, isLoading, isRecording, restarting, loadingFiles, modal, recordMessage, modalProblem, typeReport, phones, mails, problemDescription, showPTZ, inputCkecked, portContainer, dnsContainer, copyButton, typeMBOX } = this.state;

    return (
      <Card style={{ display: display, padding: "0.75rem", background: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "var(--dark-mode-color)" : "white", color: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "white" : "black", transition: "all 0.2s linear" }}>
        <NotificationSystem ref={this.notificationSystem} />
        {this.props.horizontal ? (
          <Card.Body>
            <Card.Title>{localStorage.getItem(LANG) === "english" ? `Camera ${num_cam}` : `Cámara ${num_cam}`}</Card.Title>
            <Card.Text>
              <Row>
                <Col lg={6}>
                  <div className="camHolder">
                    {this.props.marker.extraData.isRtmp ? (
                      <RtmpPlayer
                        height={this.props.height}
                        src={this.props.marker.extraData.url}
                        num_cam={this.props.marker.extraData.num_cam}
                      />
                    ) : !this.props.marker.extraData.dataCamValue.is_amazon_stream && this.props.marker.extraData.dataCamValue.amazon_arn_channel ? (
                      <WssPlayer
                        channelARN={this.props.marker.extraData.dataCamValue.amazon_arn_channel}
                        region={this.props.marker.extraData.dataCamValue.amazon_region}
                        height={this.props.height}
                        width={this.props.width}
                        num_cam={this.props.marker.extraData.num_cam}
                      />
                    ) : this.props.marker.extraData.isHls ? (
                      <HlsPlayer
                        dataCamValue={this.props.marker.extraData.dataCamValue}
                        setCountError={this.props.setCountError}
                        channelARN={this.props.marker.extraData.dataCamValue.amazon_arn_channel}
                        region={this.props.marker.extraData.dataCamValue.amazon_region}
                        height={this.props.height}
                        width={this.props.width}
                        src={this.props.marker.extraData.url}
                        num_cam={this.props.marker.extraData.num_cam}
                        infoServer={this.props.marker.extraData.dataCamValue.UrlStreamMediaServer}
                      />
                    ) : (
                      <canvas
                        id={'camcanvasstreamer' + cameraID}
                        ref="camRef"
                        style={{
                          width: '100%',
                          height: this.props.height ? this.props.height : '100%'
                        }}
                      />
                    )}
                  </div>
                </Col>
                <Col lg={6}>{cameraName}</Col>
              </Row>
            </Card.Text>
            {this.props.showButtons ? (
              <Card.Footer>
                <Button variant="outline-secondary"><i className="fa fa-camera" /></Button>
                <Button variant="outline-secondary"><i className="fa fa-pause" /></Button>
                <Button variant="outline-secondary"><i className="fa fa-square" /></Button>
                <Button variant="outline-secondary"><i className="fa fa-repeat" /></Button>
              </Card.Footer>
            ) : null}
          </Card.Body>
        ) : (
          <Card.Body>
            {showData ? (
              <div className="row dataHolder p10">
                {/* {typeMBOX && removeSpaces(typeMBOX) !== 'axxon' &&
                  <div className="col snapshots">
                    {localStorage.getItem(LANG) === "english" ? "Photos" : "Fotos"}
                    <div>
                      {photosLoading ? (
                        this._renderLoading()
                      ) : photos.length > 0 ? (
                        <div className="row">
                          {photos.map((value, index) => (
                            <MediaContainer
                              key={index}
                              value={value}
                              exists_image={true}
                              cam={data}
                              src={value.relative_url}
                              reloadData={this._loadFiles}
                              isQnap={qnapServer && qnapChannel}
                              servidorMultimedia={servidorMultimedia}
                              port={portContainer}
                              dnsContainer={dnsContainer}
                              userIdContainer={this.getUserID()}
                            />
                          ))}
                        </div>
                      ) : (
                        <div align="center">
                          <p className="big-letter">{localStorage.getItem(LANG) === "english" ? `No files to show` : "No hay archivos que mostrar"}</p>
                          <i className="fa fa-image fa-5x" />
                        </div>
                      )}
                    </div>
                  </div>
                } */}
                <div id={`scrollVideo#${data.id}`} className="col videos">
                  {localStorage.getItem(LANG) === "english" ? `Videos` : `Videos`}
                  <Tab
                    align="center"
                    activeIndex={activeIndex}
                    onTabChange={(e, { activeIndex }) => this.tabHandler(activeIndex)}
                    menu={{ secondary: true, pointing: true }}
                    panes={[
                      // typeMBOX && removeSpaces(typeMBOX) !== 'axxon' && {
                      //   menuItem: localStorage.getItem(LANG) === "english" ? `Recordings` : 'Grabaciones',
                      //   render: () => (
                      //     <Tab.Pane attached={false}>
                      //       {this._renderVideoListSearch(videosLoading, videos)}
                      //     </Tab.Pane>
                      //   )
                      // },
                      this.props.moduleActions && this.props.moduleActions.viewHistorial && {
                        menuItem: localStorage.getItem(LANG) === "english" ? `Historics` : 'Históricos',
                        render: () => (
                          <>
                            <div>
                              <button className={`btn btn-outline-${(localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "dark" : "primary"} ml-auto mr-auto mb-2`} onClick={() => this._getHistoricsByHour(this.state.historicCurrentDay)} >
                                {localStorage.getItem(LANG) === "english" ? "Refresh" : "Actualizar"}
                              </button>
                            </div>
                            <br />
                            {this._renderButtonsByHour()}
                            <Tab.Pane attached={false}>
                              {this._renderVideoListSearch(
                                historyLoading,
                                video_history.length > 0 && video_history[1] && video_history[1].length > 0 ? video_history[1] : video_history,
                                true,
                                video_history.length > 0 && video_history[1] && video_history[1].length > 0 ? video_history[0] : null,
                                true, inputCkecked, false, true
                              )}
                            </Tab.Pane>
                          </>
                        )
                      },
                      // qnapServer && qnapChannel && {
                      //   menuItem: localStorage.getItem(LANG) === "english" ? `Advanced Search` : 'Búsqueda Avanzada',
                      //   render: () => (
                      //     <Tab.Pane attached={false}>
                      //       <AdvancedSearch
                      //         loading={searchLoading}
                      //         _searchFileVideos={this._searchFileVideos}
                      //       />
                      //       {(isNewSearch || searchLoading) && <hr />}
                      //       {this._renderVideoListSearch(searchLoading, video_search, isNewSearch)}
                      //     </Tab.Pane>
                      //   )
                      // }
                    ]}
                  />
                </div>
              </div>
            ) : null}
            <div className={showData ? 'camHolder hideCamHolder' : 'camHolder'} style={{ width: '100%', height: (showPTZ && window.location.pathname.split("/").length < 3) && "28rem", alignItems: showPTZ && "flex-start" }} align={!showPTZ ? "center" : "none"}>
              <div ref="camHolder" style={{ width: '100%', height: this.props.height ? this.props.height : '100%' }}>
                {this.props.marker.extraData.isRtmp ? (
                  <RtmpPlayer
                    height={this.props.height}
                    src={this.props.marker.extraData.url}
                    num_cam={this.props.marker.extraData.num_cam}
                  />
                ) : !this.props.marker.extraData.dataCamValue.is_amazon_stream && this.props.marker.extraData.dataCamValue.amazon_arn_channel ? (
                  <WssPlayer
                    channelARN={this.props.marker.extraData.dataCamValue.amazon_arn_channel}
                    region={this.props.marker.extraData.dataCamValue.amazon_region}
                    height={this.props.height}
                    width={this.props.width}
                    num_cam={this.props.marker.extraData.num_cam}
                  />
                ) : this.props.marker.extraData.isHls ? (
                  <>
                    <Row>
                      <Col md={!showPTZ ? 12 : 6} lg={!showPTZ ? 12 : 6}>
                        <HlsPlayer
                          dataCamValue={this.props.marker.extraData.dataCamValue}
                          setCountError={this.props.setCountError}
                          channelARN={this.props.marker.extraData.dataCamValue.amazon_arn_channel}
                          region={this.props.marker.extraData.dataCamValue.amazon_region}
                          height={this.props.height}
                          width={this.props.width}
                          src={this.props.marker.extraData.url}
                          num_cam={this.props.marker.extraData.num_cam}
                          infoServer={this.props.marker.extraData.dataCamValue.UrlStreamMediaServer}
                        />
                      </Col>
                      {
                        showPTZ &&
                        <Col md={6} lg={6}>
                          <div className="col ptzInMap">
                            {localStorage.getItem(LANG) === "english" ? "Controls" : "Controles"}
                            <ControlPTZ
                              camera={data}
                              isInMap={true}
                              hasMatch={false}
                            />
                          </div>
                        </Col>
                      }
                    </Row>
                  </>
                ) : (
                  <canvas
                    ref="camRef"
                    id={'canvasCamaraStream' + data.id}
                    style={{ width: '100%', height: '100%' }}
                  />
                )}
                {tryReconect ? localStorage.getItem(LANG) === "english" ? `Reconnecting` : 'Reconectando...' : null}
              </div>
            </div>
            {this.props.hideText ? null : (
              <div align="left" style={{ padding: "1rem 0.5rem" }}>
                {
                  (window.location.pathname.includes("analisis") || window.location.pathname.includes("map") || window.location.pathname.includes("cuadrantes")) &&
                  <h2>{localStorage.getItem(LANG) === "english" ? `Camera ${num_cam}   ` : `Cámara ${num_cam}   `}{this.props.marker.extraData.dataCamValue === undefined || this.props.marker.extraData.tipo_camara === undefined ? null :
                    this.props.marker.extraData.dataCamValue.tipo_camara === 2 || this.props.marker.extraData.tipo_camara === 2 ? (
                      <i>{localStorage.getItem(LANG) === "english" ? `, Type: PTZ` : `, Tipo: PTZ`}</i>
                    ) : null}</h2>
                }
                <div id={`cameraInfo-${this.props.marker.extraData.num_cam}`} style={{ marginBottom: "1rem" }}>

                  {cameraName && !this.props.hideInfo ? <p>
                    {localStorage.getItem(LANG) === "english" ? `Address: ${cameraName}` : `Dirección: ${cameraName}`}
                    {this.props.marker.extraData.dataCamValue.entrecalles ?
                      <b>
                        {localStorage.getItem(LANG) === "english" ? ` (Between streets ${this.props.marker.extraData.dataCamValue.entrecalles})` : ` (Entre calles ${this.props.marker.extraData.dataCamValue.entrecalles})`}
                      </b> : null}
                  </p> : null}
                </div>
                {data.rel_cuadrante ? data.rel_cuadrante.length !== 0 ? (
                  data.rel_cuadrante.map(
                    (item) =>
                      item.Cuadrante && item.Cuadrante.activo ? (
                        <button key={item.id} className={`btn btn-${(localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "secondary" : "outline-secondary"} styleTag`} as="a" tag onClick={() => this._goToCuadrante(item.id_cuadrante)}>{item.Cuadrante.name}</button>
                      ) : null
                  )
                ) : null : null}
                {this.props.hideButton ? null : (
                  <div style={{ paddingTop: "1rem" }}>
                    {
                      window.location.pathname !== "/camarasInternas" &&
                      <button onClick={() => this.setState({ showModalMoreInformation: true })} className={`btn btn-${(localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "dark" : "primary"} mt-1`} style={{ margin: "0.5rem", height: "3rem", width: "3rem" }}><i className="fa fa-info" aria-hidden="true"></i></button>
                    }
                    {
                      !copyButton ?
                        <button className={`btn btn-${(localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "dark" : "primary"} ml-2 mt-1`} onClick={() => { this._handleCopy(); this.setState({ copyText: document.getElementById(`cameraInfo-${this.props.marker.extraData.num_cam}`).textContent }) }} style={{ margin: "0.5rem", height: "3rem", width: "3rem" }}>
                          <i data-content="Hello. This is an inverted popup" data-variation="inverted">
                            <FaClipboard />
                          </i>
                        </button>
                        :
                        <button className={`btn btn-${(localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "dark" : "primary"} ml-2 mt-1`} disabled><FaClipboardCheck /></button>
                    }
                  </div>
                )}

                {showModalMoreInformation ? (
                  <ModalMoreInformation
                    dataCamValue={this.props.marker.extraData.dataCamValue}
                    propsIniciales={this.props.propsIniciales}
                    modal={showModalMoreInformation}
                    hide={() => this.setState({ showModalMoreInformation: false })}
                    cam_id={cameraID}
                    data_cam={cameraName}
                  />
                ) : null}
              </div>
            )}
            {this.props.showButtons ? (
              <Card.Footer>
                {/* {this.props.moduleActions ? this.props.moduleActions.btnsnap ? <Button basic disabled={photos.length >= 5 || loadingSnap || isLoading || isRecording || restarting || loadingFiles} loading={loadingSnap} onClick={() => this._snapShot(this.props.marker.extraData)}><i className='fa fa-camera' /></Button> : null : null} */}
                {/*<Button basic disabled={loadingSnap||isLoading||isRecording||restarting||loadingFiles} onClick={this._togglePlayPause}><i className={isPlay?'fa fa-pause':'fa fa-play'}/></Button>*/}
                {/* {this.props.moduleActions ? this.props.moduleActions.btnrecord && (typeMBOX && removeSpaces(typeMBOX) !== 'axxon') ? <Button basic disabled={videos.length >= 5 || loadingSnap || isLoading || restarting || loadingFiles} loading={isLoading} onClick={() => this.recordignToggle()}><i className={isRecording ? 'fa fa-stop-circle recording' : 'fa fa-stop-circle'} style={{ color: 'red' }} /></Button> : null : null} */}
                {/* <Button basic disabled={loadingFiles || loadingSnap || isLoading || restarting || videosLoading || photosLoading || (photos.length <= 0 && videos.length <= 0)} loading={loadingFiles} onClick={() => this._downloadFiles()}><i className='fa fa-download' /></Button> */}
                {this.props.hideFileButton ? null : <Button className="pull-right" variant="outline-secondary" onClick={() => { this.setState({ showData: !showData }) }}><i className={showData ? 'fa fa-video-camera' : 'fa fa-list'} /></Button>}
                {this.props.showExternal ? <Button basic disabled={loadingSnap || isLoading || isRecording || restarting || loadingFiles} onClick={() => window.open(window.location.href.replace(window.location.pathname, '/') + 'analisis/' + data.id, '_blank', 'toolbar=0,location=0,directories=0,status=1,menubar=0,titlebar=0,scrollbars=1,resizable=1')}><i className="fa fa-external-link" /></Button> : null}
                <Button basic disabled={loadingSnap || isLoading || isRecording || restarting || loadingFiles} onClick={() => this.setState({ modalProblem: true })}><i className="fa fa-warning" /></Button>
                {/* <Button basic onClick={this._chageCamStatus}><i className="fa fa-exchange" /></Button> */}
                {/* {this.props.marker.extraData.dataCamValue && this.props.marker.extraData.dataCamValue.tipo_camara === 2 && this.props.marker.extraData.dataCamValue.dns != null ? <Button basic onClick={() => this.Clicked(this.props.marker.extraData.dataCamValue.dns)}><i className="fa fa-sliders" /></Button> : null} */}
                {this.props.marker.extraData.dataCamValue && this.props.marker.extraData.dataCamValue.tipo_camara === 2 && this.props.marker.extraData.dataCamValue.camera_ip != null ? <Button basic onClick={() => this.setState({ showPTZ: !showPTZ })}><i className="fa fa-arrows" /></Button> : null}
                {/*<Button basic disabled={loadingSnap||isLoading||isRecording||restarting||loadingFiles} onClick={this._restartCamStream}><i className={!restarting?"fa fa-repeat":"fa fa-repeat fa-spin"}/></Button>*/}
              </Card.Footer>
            ) : null}
          </Card.Body>
        )}
        {this.props.showFilesBelow ? (
          <div className="row dataHolder p10">
            {/* {typeMBOX && removeSpaces(typeMBOX) !== 'axxon' &&
              <div className="col snapshots">
                {localStorage.getItem(LANG) === "english" ? "Photos" : "Fotos"}
                <div>
                  {photosLoading ? (
                    this._renderLoading()
                  ) : photos.length > 0 ? (
                    <div className="row">
                      {photos.map((value, index) => (
                        <MediaContainer
                          cam={data}
                          key={index}
                          value={value}
                          isQnap={qnapServer && qnapChannel}
                          exists_image={true}
                          src={value.relative_url}
                          reloadData={this._loadFiles}
                          servidorMultimedia={servidorMultimedia}
                          port={portContainer}
                          dnsContainer={dnsContainer}
                          userIdContainer={this.getUserID()}
                        />
                      ))}
                    </div>
                  ) : (
                    <div align="center">
                      <p className="big-letter">No hay archivos que mostrar</p>
                      <i className="fa fa-image fa-5x" />
                    </div>
                  )}
                </div>
              </div>
            } */}
            <div id={`scrollVideo#${data.id}`} className="col videos">
              {localStorage.getItem(LANG) === "english" ? `Videos` : `Videos`}
              <Tab
                align="center"
                activeIndex={activeIndex}
                onTabChange={(e, { activeIndex }) => { this.tabHandler(activeIndex) }}
                menu={{ secondary: true, pointing: true }}
                panes={[
                  // typeMBOX && removeSpaces(typeMBOX) !== 'axxon' && {
                  //   menuItem: localStorage.getItem(LANG) === "english" ? `Recordings` : 'Grabaciones',
                  //   render: () => (
                  //     <Tab.Pane attached={false}>
                  //       {this._renderVideoListSearch(videosLoading, videos)}
                  //     </Tab.Pane>
                  //   )
                  // },
                  this.props.moduleActions && this.props.moduleActions.viewHistorial && {
                    menuItem: localStorage.getItem(LANG) === "english" ? `Historics` : 'Históricos',
                    render: () => (
                      <Tab.Pane attached={false}>
                        {this._renderVideoListSearch(
                          historyLoading,
                          video_history.length > 0 && video_history[1] && video_history[1].length > 0 ? video_history[1] : video_history,
                          true,
                          video_history.length > 0 && video_history[1] && video_history[1].length > 0 ? video_history[0] : null,
                          true, inputCkecked, false, true
                        )}
                      </Tab.Pane>
                    )
                  },
                  qnapServer && qnapChannel && {
                    menuItem: localStorage.getItem(LANG) === "english" ? `Advanced Search` : 'Búsqueda Avanzada',
                    render: () => (
                      <Tab.Pane attached={false}>
                        <AdvancedSearch
                          loading={searchLoading}
                          _searchFileVideos={this._searchFileVideos}
                        />
                        {(isNewSearch || searchLoading) && <hr />}
                        {this._renderVideoListSearch(searchLoading, video_search, isNewSearch)}
                      </Tab.Pane>
                    )
                  }
                ]}
              />
            </div>
          </div>
        ) : null}
        <Modal size="lg" show={modal} onHide={() => this.setState({ modal: false })}>
          <Modal.Header closeButton />
          <Modal.Body>{recordMessage}</Modal.Body>
        </Modal>

        <Modal
          size="lg"
          show={modalProblem}
          onHide={() => this.setState({ modalProblem: false, problemDescription: '', phones: [], mails: [] })}
          style={{ color: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) && "white" }}
        >
          <Modal.Header className={(localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) && "darkTheme"} closeButton>Reportar problema en camara {data.num_cam}</Modal.Header>
          <Modal.Body className={(localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) && "darkTheme"}>
            <Form>
              <Form.Field>
                <Form.Field>
                  <Radio
                    label={localStorage.getItem(LANG) === "english" ? "Report emergency" : "Reportar emergencia"}
                    name="typeReport"
                    value={1}
                    checked={typeReport === 1}
                    onChange={this.handleChange}
                  />
                </Form.Field>
                <Form.Field>
                  <Radio
                    label={localStorage.getItem(LANG) === "english" ? "Camera maintenance" : "Mantenimiento de camara"}
                    name="typeReport"
                    value={2}
                    checked={typeReport === 2}
                    onChange={this.handleChange}
                  />
                </Form.Field>
              </Form.Field>
              {typeReport === 2 ? null : (
                <Form.Field>
                  <Label>
                    {localStorage.getItem(LANG) === "english" ?
                      "Registered emergency numbers will be notified. If you want to add an extra phone, enter it here indicating its LADA (Example: +525512345678)."
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
              {typeReport === 2 ? null : (
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
      </Card>
    );
  }

  tabHandler = (activeIndex) => {
    const { data } = this.state;
    this.setState({ activeIndex: activeIndex })

    document.getElementById(`scrollVideo#${data.id}`).addEventListener('scroll', this._infiniteScroll, false);
  }

  Clicked = (dns) => {
    window.open('http://' + dns, 'Ficha de Incidencias', 'height=600,width=1200');
  };

  _renderLoading = () => (
    <Spinner animation="border" variant="info" role="status" size="xl">
      <span className="sr-only">Loading...</span>
    </Spinner>
  );

  getUserID = () => {
    const isAuth = sessionStorage.getItem('isAuthenticated');
    if (isAuth) {
      const data = JSON.parse(isAuth);
      return data.user_id ? data.user_id : data.userInfo.user_id;
    }
    return 0;
  }

  _renderVideoList = (loading, videoList, showNoFiles = true, hasDns = null, isHistory = false, isDownload = false, isRecord = false, noButtons = false) => {
    let { hasMore, data, data: selectedCamera, qnapServer, qnapChannel, servidorMultimedia, apiStorageKey, awsApiStreamsCams, portContainer, dnsContainer, completeCamera, typeMBOX, dnsArray } = this.state;
    const userIdContainer = this.getUserID()
    return loading ? (
      this._renderLoading()
    ) : videoList && videoList.length > 0 ? videoList[0].videos && videoList[0].videos.length > 0 ? (
      <div>
        {videoList.map((list, idx) => (
          <div key={idx} className="row">
            {dnsArray || (list.fecha && list.hour) ? (
              <div className="col-12">
                <h4>{`${dnsArray !== null ? list.videos[0].fecha : list.fecha} - ${dnsArray !== null ? list.videos[0].hour : list.hour}`}</h4>
              </div>
            ) : null}
            {list.videos.map((video, vidx) => (
              <MediaContainer
                key={vidx}
                value={video}
                dns_ip={hasDns && `http://${hasDns}`}
                exists_video={true}
                cam={selectedCamera || data}
                port={portContainer}
                dnsContainer={dnsContainer}
                src={video.path_video ? video.path_video : video.relative_path_video}
                reloadData={this._loadFiles}
                real_hour={video.real_hour}
                isQnap={qnapServer && qnapChannel}
                servidorMultimedia={servidorMultimedia}
                apiStorageKey={apiStorageKey}
                awsApiStreamsCams={awsApiStreamsCams}
                isRecord={isRecord}
                userIdContainer={userIdContainer}
                completeCamera={completeCamera}
                noButtons={noButtons}
                typeMBOX={typeMBOX}
              />
            ))}
          </div>
        ))}
        {qnapServer && qnapChannel && hasMore && isHistory && this._renderLoading()}
      </div>
    ) : (
      <div className="row">
        {videoList.map((list, idx) => (
          <MediaContainer
            key={idx}
            value={list}
            isQnap={qnapServer && qnapChannel}
            dns_ip={hasDns && `http://${hasDns}`}
            exists_video={true}
            cam={selectedCamera || data}
            port={portContainer}
            dnsContainer={dnsContainer}
            src={list.relative_url}
            reloadData={this._loadFiles}
            servidorMultimedia={servidorMultimedia}
            awsApiStreamsCams={awsApiStreamsCams}
            isRecord={isRecord}
            userIdContainer={userIdContainer}
            completeCamera={completeCamera}
            noButtons={noButtons}
            typeMBOX={typeMBOX}
          />
        ))}
      </div>
    ) : showNoFiles ? (
      <div align="center">
        <p className="big-letter">No hay archivos que mostrar</p>
        <i className="fa fa-image fa-5x" />
      </div>
    ) : null;
  };

  _renderVideoListSearch = (loading, videoList, showNoFiles = true, hasDns = null, isHistory = false, isDownloadSearch = false, isRecord = false, noButtons = false) => {
    let { servidorMultimedia, dnsArray, camURL, apiStorageKey, awsApiStreamsCams, data, selectedCamera, portContainer, dnsContainer, typeMBOX, protocolDownload, historyServerDns, historyServerPort, historyServerProtocol, loadingHistorics, isAxxonSearch, historicCurrentDay } = this.state;

    if (videoList && videoList.length > 0 && !isAxxonSearch) {
      if (!videoList[0].active) {
        videoList.shift()
      }
    }

    let sortVideoList = videoList;
    if (!isAxxonSearch && videoList[0] && videoList[0].fecha < videoList[videoList.length - 1].fecha) {
      sortVideoList = videoList.reverse()
    }

    let newArray = [];

    if (sortVideoList.length > 0 && !Array.isArray(sortVideoList[0])) {
      sortVideoList.forEach(el => {
        if (!newArray.some(element => element.hour === el.hour)) {
          let nuevoObjeto = {
            hour: el.hour,
            fecha: el.fecha,
            videos: [el]
          }
          newArray.push(nuevoObjeto)

        } else {
          let idx = newArray.findIndex(e => e.hour === el.hour)
          newArray[idx].videos.push(el)
        }
      })

    }

    return loadingHistorics ? (
      this._renderLoading()
    ) :
      typeMBOX === "axxon" && !isAxxonSearch ?
        this._renderAxxonByHalfHour(dnsArray)
        :
        videoList && videoList.length > 0 ?
          (
            <PaginationList
              awsApiStreamsCams={awsApiStreamsCams}
              numberVideos={40}
              videoList={isAxxonSearch ? videoList : newArray.length > 0 ? newArray : sortVideoList}
              withAccordion={newArray.length > 0}
              isDownloadSearch={typeMBOX && removeSpaces(typeMBOX) === 'axxon' ? true : isDownloadSearch}
              dnsArray={dnsArray}
              hasDns={hasDns}
              camURL={camURL}
              dnsContainer={dnsContainer}
              portContainer={portContainer}
              servidorMultimedia={servidorMultimedia}
              apiStorageKey={apiStorageKey}
              noButtons={noButtons}
              isRecord={isRecord}
              typeMBOX={typeMBOX}
              selectedCamera={selectedCamera || data}
              reloadData={this._loadFiles}
              download={this.download}
              renderPagination={this._renderPagination}
              protocolDownload={protocolDownload}
              historyServerDns={historyServerDns}
              historyServerPort={historyServerPort}
              historyServerProtocol={historyServerProtocol}
              renderLoading={this._renderLoading}
              isAxxonSearch={isAxxonSearch}
              getHistoricsByHour={this._getHistoricsByHour}
              historicCurrentDay={historicCurrentDay}
            />
          ) :
          showNoFiles ? (
            <div align="center">
              <p className="big-letter">{localStorage.getItem(LANG) === "english" ? "No files to show" : "No hay archivos que mostrar"}</p>
              <i className="fa fa-image fa-5x" />
            </div>
          ) : null
  };

  // _renderVideoListSearch = (loading, videoList, showNoFiles = true, hasDns = null, isHistory = false, isDownloadSearch = false, isRecord = false, noButtons = false) => {
  // 	let { servidorMultimedia, dnsArray, camURL, apiStorageKey, awsApiStreamsCams, selectedCamera, portContainer, dnsContainer, typeMBOX, protocolDownload, historyServerDns, historyServerPort, historyServerProtocol, loadingHistorics, isAxxonSearch, historicCurrentDay } = this.state;
  //   // console.log("entra", videoList)
  // 	if (videoList && videoList.length > 0 && !isAxxonSearch) {
  // 		if (!videoList[0].active) {
  // 			videoList.shift()
  // 		}
  // 	}

  // 	let sortVideoList = videoList;
  // 	if (!isAxxonSearch && videoList[0] && videoList[0].fecha < videoList[videoList.length - 1].fecha) {
  // 		sortVideoList = videoList.reverse()
  // 	}

  // 	let newArray = [];

  // 	if (sortVideoList.length > 0 && !Array.isArray(sortVideoList[0])) {
  // 		sortVideoList.forEach(el => {
  // 			if (!newArray.some(element => element.hour === el.hour)) {
  // 				let nuevoObjeto = {
  // 					hour: el.hour,
  // 					fecha: el.fecha,
  // 					videos: [el]
  // 				}
  // 				newArray.push(nuevoObjeto)

  // 			} else {
  // 				let idx = newArray.findIndex(e => e.hour === el.hour)
  // 				newArray[idx].videos.push(el)
  // 			}
  // 		})

  // 	}

  // 	return loadingHistorics ? (
  // 		this._renderLoading()
  // 	) :
  // 		typeMBOX === "axxon" && !isAxxonSearch ?
  // 			this._renderAxxonByHalfHour(dnsArray)
  // 			:
  // 			videoList && videoList.length > 0 ?
  // 				(
  // 					<PaginationList
  // 						awsApiStreamsCams={awsApiStreamsCams}
  // 						numberVideos={40}
  // 						videoList={isAxxonSearch ? videoList : newArray.length > 0 ? newArray : sortVideoList}
  // 						withAccordion={newArray.length > 0}
  // 						isDownloadSearch={typeMBOX && removeSpaces(typeMBOX) === 'axxon' ? true : isDownloadSearch}
  // 						dnsArray={dnsArray}
  // 						hasDns={hasDns}
  // 						camURL={camURL}
  // 						dnsContainer={dnsContainer}
  // 						portContainer={portContainer}
  // 						servidorMultimedia={servidorMultimedia}
  // 						apiStorageKey={apiStorageKey}
  // 						noButtons={noButtons}
  // 						isRecord={isRecord}
  // 						typeMBOX={typeMBOX}
  // 						selectedCamera={selectedCamera}
  // 						reloadData={this._loadFiles}
  // 						download={this.download}
  // 						renderPagination={this._renderPagination}
  // 						protocolDownload={protocolDownload}
  // 						historyServerDns={historyServerDns}
  // 						historyServerPort={historyServerPort}
  // 						historyServerProtocol={historyServerProtocol}
  // 						renderLoading={this._renderLoading}
  // 						isAxxonSearch={isAxxonSearch}
  // 						getHistoricsByHour={this._getHistoricsByHour}
  // 						historicCurrentDay={historicCurrentDay}
  // 					/>
  // 				) :
  // 				showNoFiles ? (
  // 					<div align="center" className='no-data-show'>
  // 						<p className="big-letter">{localStorage.getItem(LANG) === "english" ? "No files to show" : "No hay archivos que mostrar"}</p>
  // 						<i className="fa fa-image fa-5x" />
  // 					</div>
  // 				) : null
  // };

  _renderAxxonByHalfHour = (dnsArray) => {

    const { isAxxonSearch, historicCurrentDay } = this.state;

    let currentDate = new Date();
    let currentDay = moment().subtract(Math.abs(historicCurrentDay), 'days').format().split("T")[0];
    let hourUTC = currentDate.getUTCHours();
    let hourToCurrent = hourUTC - 6 >= 0 ? hourUTC - 6 : 24 + (hourUTC - 6);
    let minutesUTC = currentDate.getUTCMinutes();
    let currentHour = `${hourToCurrent}:${minutesUTC}`
    let todayDate = historicCurrentDay === 0;

    let arrayByHalfHour = this._createArrayHours(currentHour, todayDate);

    const searchVideos = (hour) => {
      let body = {
        startDateTime: `${currentDay} ${hour}`,
        dateTimeEnd: hour === "23:30" ? `${moment().subtract(historicCurrentDay - 1, 'days').format().split("T")[0]} 00:00` : `${currentDay} ${hour.split(":")[1] === "00" ? hour.split(":")[0] + ":30" : (parseInt(hour.split(":")[0]) + 1) + ":00"}`,
        search_axxon: true,
        format: "mkv",
        search_auto: true,
        dnsArray: dnsArray,
      }

      this._searchFilesAxxon(body);
    };

    let newArray = [];
    let auxArray = [];

    arrayByHalfHour.forEach(el => {
      if (auxArray.length === 3) {
        newArray.push(auxArray);
        auxArray = [];
        auxArray.push(el);
      } else {
        auxArray.push(el);
      };
    });

    if (auxArray.length > 0) {
      newArray.push(auxArray)
    }

    if (!isAxxonSearch) {
      return (
        <div style={{ padding: "0.5rem 0" }}>
          {
            newArray.map((el, index) => {
              return (
                <div key={index} style={{ display: "flex", padding: "0.5rem 0" }}>
                  {
                    el.map((element, idx) => {
                      return (
                        <div key={element} className="col-4">
                          <button key={idx} className={`btn btn-outline-${(localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "dark" : "primary"} ml-auto mr-auto mb-2 fake-btn`} onClick={() => searchVideos(element)} >
                            {`${element} - ${element.split(":")[1] === "00" ? element.split(":")[0] + ":30" : element === "23:30" ? "00:00" : (parseInt(element.split(":")[0]) + 1) + ":00"}`}
                          </button>
                        </div>
                      );
                    })
                  }
                </div>
              );
            })
          }
        </div>
      );
    };
  };

  _createArrayHours = (actualHour, actualDay) => {
    let half = actualHour.split(":")[1] > 30;
    let hour = actualHour.split(":")[0];
    let arrayHours = [];
    let finalArray = [];

    if (actualDay) {
      for (let i = half ? hour : hour - 1; i > -1; i--) {
        arrayHours.push(i.toString());
      };

      arrayHours.forEach((el, idx) => {
        if (idx === 0 && half) {
          finalArray.push(arrayHours[0] + ":00")
        } else {
          finalArray.push(el + ":30")
          finalArray.push(el + ":00")
        }
      })

    } else {
      for (let i = 23; i > -1; i--) {
        arrayHours.push(i.toString());
      };

      arrayHours.forEach((el) => {
        finalArray.push(el + ":30")
        finalArray.push(el + ":00")
      })
    }
    return finalArray;
  }

  _getHistoricsByHour = (daysBack) => {

    this.setState({ loadingHistorics: true })

    let newMoment = [moment().subtract(daysBack, 'days').startOf('date').format('YYYY-MM-DD')];
    this._searchFileVideosNotqnap(newMoment, "00", "24");
    this.setState({ historicCurrentDay: daysBack })

    setTimeout(() => {
      this.setState({ loadingHistorics: false })
    }, 1000);
  }

  _backToHistorics = () => {
    const { arrayHistoricsByHour, arrayWeek } = this.state;
    const copyAuxWeek = JSON.parse(JSON.stringify(arrayWeek));
    const orderDates = copyAuxWeek.sort((a, b) => { return new Date(b) - new Date(a) });
    let index = 0, startDate = arrayHistoricsByHour[0];

    if (orderDates && startDate) { index = orderDates.indexOf(startDate); }

    let momentToMount = [moment(startDate).startOf('date').format('YYYY-MM-DD')];
    this._searchFileVideosNotqnap(momentToMount, "00", "24");
    this._changeStatus(false);
    this.setState({ isAxxonSearch: false, axxonList: [], historicCurrentDay: index });
  }

  _renderButtonsByHour = () => {
    let { historicCurrentDay } = this.state
    moment.locale('es');

    let totalWeekArray = [0, 1, 2, 3, 4, 5, 6]

    return (
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {
          totalWeekArray.map((el) => {
            let buttonDate = moment().subtract(Math.abs(el - 6), 'days').startOf('date').format('ll');
            return (
              <button key={Math.abs(el - 6)} className={historicCurrentDay === Math.abs(el - 6) ? `btn btn-${(localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "dark" : "primary"} ml-auto mr-auto mb-2` : `btn btn-outline-${(localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "dark" : "primary"} ml-auto mr-auto mb-2`} onClick={() => this._getHistoricsByHour(Math.abs(el - 6))} >{buttonDate.split(" de ")[0] + " " + buttonDate.split(" de ")[1].split(".")[0].slice(0, 1)[0].toUpperCase() + buttonDate.split(" de ")[1].split(".")[0].slice(1)}</button>
            );
          })
        }
      </div>
    )
  }

  _changeStatus = (changeStatus) => {
    this.setState({ moduleSearch: changeStatus });
  }

  _searchFilesAxxon = async (params) => {
    const { selectedCamera, data } = this.state;
    this.setState({ isAxxonSearch: true, loadingHistorics: true });

    let stateData = data;

    let notificationFirstAlert = {
      message: "Aguarde unos segundos mientras se realiza la búsqueda de históricos.",
      level: "info",
      position: 'tc',
      title: "Búsqueda de históricos",
      autoDismiss: 35,
    };

    window.location.pathname !== "/map" ? this.addNotification(notificationFirstAlert) : this.props.mapNotification(notificationFirstAlert)

    const payload = {
      cam_id: selectedCamera ? selectedCamera.id : stateData.id
    }

    const getArchives = await conections.getArchives(payload);

    if (getArchives.data.data) {
      let listAvailablefiles = getArchives.data.data;
      let search = {
        cam_id: selectedCamera ? selectedCamera.id : stateData.id,
        begin: params.startDateTime,
        end: params.dateTimeEnd,
        archives: listAvailablefiles
      };

      const recordingsAvailable = await conections.searchArchive(search);
      const data = recordingsAvailable.data;
      let copyList, info, list;
      if (data.success) {
        info = data.data;
        copyList = info.map(a => { return { ...a } })
        if (copyList.length > 0) {
          list = copyList.map((d) => {
            d.format = params.format;
            d.camera_id = selectedCamera ? selectedCamera.id : stateData.id;
            return d
          });
          if (params.search_auto) {
            this.setState({ isAxxonSearch: false })
            this.download(list[0], params.dnsArray);
          }
        }
        this.setState({ axxonList: list ? list : [] })
      } else {
        let message = 'No se encontraron grabaciones, intente con otro horario.';
        let level = 'warning';
        let title = 'Búsqueda de histórico';
        // this.addNotification({ message, level, title });
        window.location.pathname !== "/map" ? this.addNotification({ message, level, title }) : this.props.mapNotification({ message, level, title })
        this.setState({ isAxxonSearch: false });
      }
      this.setState({ loadingHistorics: false });
    }
  }

  download = async (params, dns) => {
    let { apiStorageKey, dnsPort, typeMBOX, historyServerProtocol, historicalPassword, historicalUser, historyServerDns, isAxxonSearch } = this.state;
    if (typeMBOX === 'light') {
      const URI = apiStorageKey ? `${params.relative_path_video}${apiStorageKey}` : dnsPort === 80 ? `${historyServerProtocol}://${dns}/${params.relative_path_video}` : `${historyServerProtocol}://${dns}:${dnsPort}/${params.relative_path_video}`;
      axios({
        url: URI,
        method: "GET",
        responseType: "blob"
      }).then((response) => {

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `CAM${params.camera_id}_${params.fecha}-${params.real_hour}.mp4`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    } else {
      if (typeMBOX === 'axxon') {
        const { access_point, begin, end, camera_id, storage, archive, search_start_time_utc, search_end_time_utc, format, search_start_time, search_end_time, fecha, real_hour } = params;

        const body = {
          access_point,
          begin: begin ? begin : search_start_time_utc,
          end: end ? end : search_end_time_utc,
          cam_id: camera_id,
          storage: storage ? storage : archive,
          format: format ? format : "mp4"
        };

        const responseArchive = await conections.exportArchive(body);
        let level = null, message = null, title = null;
        if (responseArchive && responseArchive.data && responseArchive.data.success) {
          const { file_path, id, route } = responseArchive.data && responseArchive.data.archive;
          if (file_path) {
            message = localStorage.getItem(LANG) === "english" ? Strings.downloadEnglishStarted : Strings.downloadStarted;
            level = 'success';
            title = localStorage.getItem(LANG) === "english" ? 'Historic download' : 'Descarga de histórico';
            // this.addNotification({ message, level, title });
            window.location.pathname !== "/map" ? this.addNotification({ message, level, title }) : this.props.mapNotification({ message, level, title })
            let url = null;
            const password = historicalPassword;
            const user = historicalUser;

            if (dnsPort == 80 || dnsPort == 443) {
              url = `${historyServerProtocol}://${historyServerDns}/export/${id}/file?name=${file_path}`;
            } else {
              url = `${historyServerProtocol}://${historyServerDns}:${dnsPort}/export/${id}/file?name=${file_path}`;
            }

            const info = { cam_id: camera_id, route };


            let xhr = new XMLHttpRequest();
            xhr.withCredentials = true;
            const credentials = Buffer.from(`${user}:${password}`).toString('Base64')

            xhr.open('GET', url, true);
            xhr.setRequestHeader("Authorization", "Basic " + credentials)
            xhr.responseType = 'blob';
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

            xhr.onerror = (e) => {
              if (xhr.status == 401) {
                console.log("onerror:", xhr.status)
              }
            };
            xhr.onload = (e) => {
              let blob = xhr.response;
              if (blob) {
                let fileName = null;
                if (!isAxxonSearch) {
                  fileName = (fecha && real_hour) ? `CAM${camera_id}_${fecha}-${real_hour}.mp4` : `CAM${camera_id}_${search_start_time.split(" ")[0]}_${search_start_time.split(" ")[1]}-${search_end_time.split(" ")[1]}.${format}`
                } else {
                  fileName = `CAM${camera_id}_${search_start_time}-${search_end_time}.${format}`
                }
                this.saveFile(blob, fileName);
              }
              conections.finalizExportProcess(info);

              if (xhr.status == 401) {
                console.log("onload:", xhr.status)
              }

            };

            xhr.onprogress = (e) => {

              const percentages = [5, 20, 40, 60, 80, 95];
              let progress = Math.floor((e.loaded / e.total) * 100);
              percentages.forEach((t => {
                if (t === progress) {
                  console.log(`progress: ${progress}`);
                }
              }))
            };

            xhr.send();
          }
        } else {
          message = localStorage.getItem(LANG) === "english" ? 'Could not start the download.' : 'No se pudo iniciar la descarga.';
          level = 'error';
          title = localStorage.getItem(LANG) === "english" ? 'Historic download' : 'Descarga de histórico';

          // this.addNotification({ message, level, title });
          window.location.pathname !== "/map" ? this.addNotification({ message, level, title }) : this.props.mapNotification({ message, level, title })
        }
      } else {
        const URI = `${historyServerProtocol}://${dns}:${dnsPort}/${params.relative_path_video}`;
        axios({
          url: URI,
          method: "GET",
          responseType: "blob",
        }).then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", `CAM${params.camera_id}_${params.fecha}-${params.real_hour}.mp4`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        });
      }
    }

  }

  _goToCuadrante = (id_cuadrante) => {
    window.location.assign(
      window.location.href
        .replace(window.location.pathname, '')
        .replace(window.location.search, '')
        .replace(window.location.hash, '') +
      '/cuadrantes/' +
      id_cuadrante
    );
  };

  onChange = (chips) => {
    this.setState({ phones: chips });
  };
  onChangeMail = (chips) => {
    this.setState({ mails: chips });
  };

  handleChange = (e, { name, value }) => this.setState({ [name]: value });

  _sendReport = () => {
    this.setState({ modalProblem: false });
    // console.log(this.state.phones, this.state.mails)
    conections
      .sendTicket({
        camera_id: this.state.data.id,
        problem: this.state.problemDescription,
        phones: this.state.phones.join(),
        mails: this.state.mails.join(),
        type_report: this.state.typeReport,
        user_id: JSON.parse(sessionStorage.getItem("isAuthenticated")).userInfo.user_id || 1,
      })
      .then((response) => {
        // console.log(response)
        const data = response.data;
        this.setState({ problemDescription: '' });
        if (data.success) {
          alert('Ticket creado correctamente');
        } else {
          alert('Error al crear ticket');
          console.log(data.error);
        }
      });
  };

  _togglePlayPause = () => {
    if (this.state.isPlay) {
      this.state.player.stop();
    } else {
      this.state.player.stop();
      if (this.state.webSocket) {
        this.state.webSocket.close();
      }
      this.tryRconection();
    }
    this.setState({ isPlay: !this.state.isPlay });
  };

  recordignToggle = () => {
    if (this.state.isRecording) {
      this.setState({ isLoading: true });
      conections.stopRecordV2({ clave: this.state.process_id }, this.state.data.id)
        .then((r) => {
          const response = r.data;
          this.setState({
            isRecording: false,
            isLoading: false,
            modal: true,
            recordMessage: response.msg
          });
          if (response.success) this._loadFiles({}, false, true, false, false);
        });
    } else {
      conections.startRecordV2({}, this.state.data.id).then((r) => {
        const response = r.data;
        if (response.success === true) {
          this.setState({ isRecording: true, process_id: response.clave });
        }
      });
    }
  };

  _infiniteScroll = (event) => {
    let { activeIndex, video_history, qnapServer, qnapChannel, scroll, hasMore, data } = this.state;
    let divScroll = document.getElementById(`scrollVideo#${data.id}`);
    let isDown = divScroll.scrollHeight - divScroll.scrollTop <= divScroll.offsetHeight;
    if (
      activeIndex === 1 && video_history.length > 0 && isDown && qnapServer &&
      qnapChannel && !scroll.includes(divScroll.scrollHeight) && hasMore
    ) {
      scroll.push(divScroll.scrollHeight);
      this._loadMoreHistory();
    } if (activeIndex === 1 && video_history.length > 0 && isDown && hasMore) {
      setTimeout(() => {
        scroll.push(divScroll.scrollHeight);
        this.setState({ historyLoading: true });
        this._loadMoreVideosNotQnap();
      }, 1000);

    }
  };

  _handleCopy = () => {

    this.setState({ copyButton: true })
    setTimeout(() => {
      copy(this.state.copyText)
    }, 300);

    setTimeout(() => {
      this.setState({ copyButton: false })
    }, 2500);
  }

  componentDidMount() {
    //   console.log(this.props)
    if (this.props.marker.extraData === undefined) {
      this.setState({ data: {}, qnapServer: null, qnapChannel: null });
      return false;
    }

    this.setState({
      cameraName: this.props.marker.title,
      num_cam: this.props.marker.extraData.num_cam,
      entrecalles: this.props.marker.extraData.dataCamValue.entrecalles,
      cameraID: this.props.marker.extraData.id,
      data: this.props.marker.extraData,
      selecterCamera: this.props.marker.extraData,
      qnapServer: this.props.marker.extraData.dataCamValue.qnap_server_id,
      qnapChannel: this.props.marker.extraData.dataCamValue.qnap_channel
    }, () => {
      if (this.props.showButtons) {
        this._loadFiles(this.props.marker.extraData, true, true, true, true);
      }
    });

    //console.log('dataaaaaaacuadrante',this.props)
    if (this.props.marker.extraData.isRtmp === true) {
      return false;
    }
    if (this.props.marker.extraData.isHls === true) {
      return false;
    }
    try {
      var ws = new WebSocket(this.props.marker.extraData.webSocket);
      ws.onerror = this._wsError;
      ws.onclose = function () { };
    } catch (err) {
      this._wsError(err);
    }
    try {
      var p = new jsmpeg(ws, {
        canvas: this.refs.camRef,
        autoplay: true,
        audio: false,
        loop: true,
        onload: this._endedPlay,
				/*ondecodeframe:this._decode,*/ onfinished: this._endedPlay,
        disableGl: true,
        forceCanvas2D: true
      });
      let interval = setInterval(this._checkIsUp, 60000);
      this.setState({ interval: interval });
    } catch (err) {
      this._playerError(err);
    }

    this.setState({
      webSocket: ws,
      player: p
    });
    if (this.props.width) {
      if (this.refs.camRef.getBoundingClientRect().width === 0) {
        this.refs.camHolder.style.width = window.visualViewport.width * this.props.width + 'px';
      } else {
        this.refs.camHolder.style.width =
          this.refs.camRef.getBoundingClientRect().width * this.props.width + 'px';
      }
    }
    if (this.props.height) {
      if (this.refs.camRef.getBoundingClientRect().width === 0) {
        this.refs.camRef.style.height = (window.visualViewport.width - 50) * this.props.height + 'px';
      } else {
        this.refs.camRef.style.height =
          this.refs.camRef.getBoundingClientRect().width * this.props.height + 'px';
      }
    }
    vis(this._isVisisbleChange);
    window.addEventListener('restartCamEvent', this._restartCam, false);
  }

  _isVisisbleChange = () => {
    this.setState({ isVisible: vis() });
  };

  _endedPlay = (data) => {
    console.log('play ended', data);
  };

  _checkIsUp = () => {
    if (
      this.state.lastCurrentTime === this.state.player.currentTime ||
      this.state.lastCurrentFrame === this.state.player.currentFrame
    ) {
      if (!this.tryReconect && this.state.isVisible) {
        this.setState({ tryReconect: true });
        this.tryReconect = true;
        console.log('is delay, cam' + this.state.data.num_cam);
        this.state.player.stop();
        if (this.state.webSocket) {
          this.state.webSocket.close();
        }
        this.tryRconection();
      }
    }
    this.setState({
      lastCurrentTime: this.state.player.currentTime,
      lastCurrentFrame: this.state.player.currentFrame
    });
  };

  _snapShot = async (camera) => {
    const { dnsPort, typeMBOX, historyServerProtocol, historicalPassword, historicalUser, historyServerDns } = this.state;
    let title = 'Descarga de fotografía', message = Strings.unprocessed, level = 'warning';

    if (typeMBOX && removeSpaces(typeMBOX) === 'axxon') {
      console.log("ENTRA AL IF")
      this.setState({ loadingSnap: true });
      const payload = { cam_id: camera.id };
      const getVideoStream = await conections.getVideoStreams(payload);

      if (getVideoStream.data && getVideoStream.data.success) {
        const { data: { data } } = getVideoStream;
        const videoSourceId = data[0].accessPoint;
        const password = historicalPassword;
        const user = historicalUser;
        let url = null;

        if (historyServerProtocol && historyServerDns) {
          if (dnsPort == 80 || dnsPort == 443) {
            url = `${historyServerProtocol}://${historyServerDns}/live/media/snapshot/${videoSourceId}`;
          } else {
            url = `${historyServerProtocol}://${historyServerDns}:${dnsPort}/live/media/snapshot/${videoSourceId}`;
          }

          const credentials = Buffer.from(`${user}:${password}`).toString('Base64')
          let xhr = new XMLHttpRequest();
          xhr.withCredentials = true;
          xhr.open('GET', url, true);
          xhr.setRequestHeader("Authorization", "Basic " + credentials)
          xhr.responseType = 'blob';
          xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
          xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

          xhr.onerror = () => {
            if (xhr.status == 401) { console.log("onerror:", xhr.status) }
            this.setState({ loadingSnap: false });
            // this.addNotification({ message, level, title });
            window.location.pathname !== "/map" ? this.addNotification({ message, level, title }) : this.props.mapNotification({ message, level, title })
          };

          xhr.onload = (e) => {
            let blob = xhr.response;
            if (blob && xhr.status === 200) {
              const fileName = `CAM${camera.id}.jpeg`;
              this.saveFile(blob, fileName);
              this.setState({ loadingSnap: false });
            } else {
              // this.addNotification({ message, level, title });
              window.location.pathname !== "/map" ? this.addNotification({ message, level, title }) : this.props.mapNotification({ message, level, title })
              this.setState({ loadingSnap: false });
            }
          };
          xhr.send();
        } else {
          // this.addNotification({ message, level, title });
          window.location.pathname !== "/map" ? this.addNotification({ message, level, title }) : this.props.mapNotification({ message, level, title })
          this.setState({ loadingSnap: false });
        }
      } else {
        // this.addNotification({ message, level, title });
        window.location.pathname !== "/map" ? this.addNotification({ message, level, title }) : this.props.mapNotification({ message, level, title })
        this.setState({ loadingSnap: false });
      }
    } else {
      if (typeMBOX) {
        this.setState({ loadingSnap: true });
        let response = await conections.snapShotV2(camera.id);
        const data = response.data;
        if (data.success) this._loadFiles(camera, false, false, false, true);
        this.setState({ loadingSnap: false });
      }
    }
  };

  addNotification = (info) => {
    const notification = this.notificationSystem.current;
    notification.addNotification({
      message: info.message,
      level: info.level,
      position: 'tc',
      title: info.title
    });
  };

  saveFile = (blob, fileName) => {
    let tempEl = document.createElement("a");
    document.body.appendChild(tempEl);
    tempEl.style = "display: none";
    let url = window.URL.createObjectURL(blob);
    tempEl.href = url;
    tempEl.download = fileName;
    tempEl.click();
    window.URL.revokeObjectURL(url);
  }

  _searchFileVideos = async (dates, startHour, endHour, stateNames, setNewState = true, searchFileHours = false) => {
    let { qnapServer, qnapChannel } = this.state;
    let isNewSearch = stateNames.list === 'video_search';
    if (setNewState) this.setState({ [stateNames.loading]: true });

    let searchVideos = {};
    let allVideosList = [];
    let lthDate = [];

    let { ptcl, host, port, user, pass } = qnapServer;
    let url = `${ptcl}${host}${port ? `:${port}` : null}`;
    await this.props.getQvrFileStationAuthLogin({ url, user, pass });

    let { QvrFileStationAuth: auth } = this.props.QvrFileStationAuth;
    if (auth && auth.authSid) {
      let mainPath = QvrFunctions._getPath(qnapChannel);
      let getNormalParams = { url, sid: auth.authSid, path: mainPath, limit: 3, start: 0, type: '0' };
      await this.props.getQvrFileStationFileList(getNormalParams);
      let { QvrFileStationFileList: listNormal, success: sNormal } = this.props.QvrFileStationFileList;
      if (sNormal && listNormal && listNormal.total > 0) {
        // for (const nl of listNormal.datas) {

        for (const dt of dates) {
          if (!lthDate.includes(dt)) lthDate.push(dt);
          let getFistHourParams = { url, sid: auth.authSid, path: `${mainPath}/${dt}`, limit: 1, start: 0, type: '0' };
          await this.props.getQvrFileStationFileList(getFistHourParams);
          let { QvrFileStationFileList: firstHour } = this.props.QvrFileStationFileList;
          let initialHour = firstHour.datas && firstHour.datas[0] ? parseInt(firstHour.datas[0].filename, 10) : 0;
          let newEndHour = lthDate.length === dates.length ? parseInt(endHour, 10) : 24;
          let newStartHour = lthDate.length === 1 ? parseInt(startHour, 10) : 0;
          if (initialHour !== 0) {
            if (newEndHour < initialHour) newEndHour = 0;
            else {
              newEndHour = newEndHour - initialHour;
              newStartHour = newStartHour > initialHour ? newStartHour - initialHour : 0;
            }
          }

          let getParamsHours = { url, sid: auth.authSid, path: `${mainPath}/${dt}`, limit: newEndHour, start: newStartHour, type: '0' };
          await this.props.getQvrFileStationFileList(getParamsHours);
          let { QvrFileStationFileList: listHours, success: sHours } = this.props.QvrFileStationFileList;

          if (sHours && listHours && listHours.total > 0) {
            if (searchFileHours) return initialHour;
            for (const hr of listHours.datas) {
              if (parseInt(hr.filename, 10) < (lthDate === dates.length ? parseInt(endHour, 10) : 24)) {
                let getParamsVideo = { url, sid: auth.authSid, path: `${mainPath}/${dt}/${hr.filename}`, limit: '2', start: '0', type: '2' };
                await this.props.getQvrFileStationFileList(getParamsVideo);
                let { QvrFileStationFileList: listVideos, success: sVideos } = this.props.QvrFileStationFileList;
                if (sVideos && listVideos && listVideos.total > 0) for (const v of listVideos.datas) allVideosList.push(`${dt}/${hr.filename}/${v.filename}`);
              }
            }
          }
        }
      }
      // }

      if (allVideosList.length > 0) {
        let expire_time = moment().add(1, 'd').unix();
        let sharedParams = { url, host, sid: auth.authSid, path: mainPath, files: allVideosList, expire_time };

        let { QvrFileStationShareLink: lastPropsShare } = this.props.QvrFileStationShareLink;
        if (!lastPropsShare.data) lastPropsShare.data = [];

        await this.props.getQvrFileStationShareLink(sharedParams);
        let { QvrFileStationShareLink: listShare } = this.props.QvrFileStationShareLink;
        searchVideos = QvrFunctions._getCleanListVideos(listShare.links, url);

        listShare.cam_id = this.state.data.id;
        lastPropsShare.data.push(listShare);
        this.props.QvrFileStationShareLink.QvrFileStationShareLink = lastPropsShare;
      }
      await this.props.getQvrFileStationAuthLogout({ url });
    }
    if (setNewState) this.setState({ [stateNames.loading]: false, [stateNames.list]: searchVideos });
    this.setState({ isNewSearch });
    return searchVideos;
  };

  _searchFileVideosNotqnap = async (dates, startHour, endHour, stateNames, setNewState = true, searchFileHours = false, data = false) => {
    let { video_advancedSearch, historyLoading, arrPares } = this.state;


    const video_advanced = data ? data : video_advancedSearch;
    let videosGuardados = []
    let element = []
    let result = []
    let arrProvisional = []
    let arrProvisional2 = []

    video_advanced[0] && video_advanced[0][1].map(filter => {
      return videosGuardados.push(filter.videos)
    });

    videosGuardados.forEach((videos) => {
      if (videos) {
        for (let i = 0; i < videos.length; i++) {
          if (videos[i]) {
            element.push(videos[i]);
          }
        }
        return element
      }
    })

    if (dates.length <= 1) {
      element.filter(filter => (filter.fecha === dates[0])).filter(filter => filter.hour >= `${startHour}:00`).filter(filter => filter.hour < `${endHour}:00`).map(videos => result.push(videos))
      // result.unshift([video_advanced[0]])
      this.setState({ arrPares: result, video_history: result })
    } if (dates.length === 2) {
      element.filter(filter => (filter.fecha === dates[0])).filter(filter => filter.hour >= `${startHour}:00`).map(videos => arrProvisional.push(videos))
      element.filter(filter => (filter.fecha === dates[1])).filter(filter => filter.hour < `${endHour}:00`).map(videos => arrProvisional2.push(videos))
      result.push(arrProvisional.reverse().concat(arrProvisional2.reverse()))
      result.unshift(video_advanced[0])
      this.setState({ arrPares: result[1] })
      /* element.filter(filter => { return filter.fecha >= dates[0] && filter.hour >= `${startHour}:00`}).map(videos => arrProvisional.push(videos))
      console.log("FILTRO DE PROVISIONAL 1", arrProvisional)
      arrProvisional.filter(filter => {return filter.fecha <= dates[dates.length-1]}).map(videos => arrProvisional2.push(videos))
    	
      console.log("FILTRO DE PROVISIONAL 2", arrProvisional2) */

    } if (dates.length > 2) {
      let countDates = dates.length - (dates.length - 1)
      element.filter(filter => (filter.fecha >= dates[countDates])).filter(filter => (filter.fecha < dates[dates.length - 1])).reverse().map(videos => arrProvisional.push(videos))
      element.filter(filter => (filter.fecha === dates[0])).filter(filter => filter.hour >= `${startHour}:00`).reverse().map(videos => arrProvisional.unshift(videos))
      element.filter(filter => (filter.fecha === dates[dates.length - 1])).filter(filter => filter.hour < `${endHour}:00`).reverse().map(videos => arrProvisional.push(videos))
      result.push(arrProvisional.reverse())
      result.unshift(video_advanced[0])
      this.setState({ arrPares: result[1] })
    }

    this._renderVideoListSearch(historyLoading,
      arrPares.length > 0 && arrPares[1] && arrPares[1].length > 0 ? arrPares[1] : arrPares,
      true,
      arrPares.length > 0 && arrPares[1] && arrPares[1].length > 0 ? arrPares[0] : null,
      true)


  }

  _loadMoreHistory = async (isFirst = false) => {
    let { scrollInitialDate, video_history, data } = this.state;
    let currentHour = parseInt(moment().format('HH'), 10);
    let stateNames = { loading: 'historyLoading', list: 'video_history' };
    let foundHistory = [];

    let dateInFormat = scrollInitialDate.format('YYYY-MM-DD');
    if (isFirst) {
      this.setState({ historyLoading: true });
      let fileHour = await this._searchFileVideos([dateInFormat], 0, 24, stateNames, false, true);
      if (fileHour !== 0) this.setState({ hasMore: false });
      else if (document.getElementById(`scrollVideo#${data.id}`)) document.getElementById(`scrollVideo#${data.id}`).addEventListener('scroll', this._infiniteScroll, false);
      foundHistory = await this._searchFileVideos([dateInFormat], fileHour !== 0 ? 0 : currentHour - SHOW_HISTORY, currentHour, stateNames, false);
      this.setState({ historyLoading: false });
    } else if (video_history.length > 0) {
      let idx = video_history.length - 1;
      let hourEnd = parseInt(video_history[idx].videos[0].real_hour.slice(0, 2), 10);
      if (hourEnd <= 0) {
        dateInFormat = scrollInitialDate.subtract(1, 'd').format('YYYY-MM-DD');
        hourEnd = 24;
      }

      let hourStart = hourEnd - SHOW_HISTORY;
      if (!(moment().startOf('date') > moment(scrollInitialDate).startOf('date') && hourEnd < currentHour)) {
        foundHistory = await this._searchFileVideos([dateInFormat], hourStart <= 0 ? 0 : hourStart, hourEnd, stateNames, false);
      }
    }

    if (foundHistory.length > 0) {
      foundHistory.reverse();
      foundHistory.forEach((d) => video_history.push(d));
      this.setState({ video_history });
    } else {
      this.setState({ hasMore: false });
    }
  };

  _loadFiles = async (cam, destroyFiles = false, onlyCurrent = false, onlyHistory = false, onlyPhotos = false) => {
    let { data: selectedCamera } = this.state;
    let camera = cam && cam.id ? cam : selectedCamera;
    let tipoMBOX = camera.dataCamValue.tipombox
    let dnsMbox = camera.dataCamValue.urlhistory;
    const dns_portMbox = camera.dataCamValue.urlhistoryport
    const protocol = camera.dataCamValue.protocolhistory
    const portApiStorage = camera.dataCamValue.UrlAPIStorage.port
    const secretKeyBody = {
      'apiKey': camera.dataCamValue.tokenhistory
    }
    this.setState({ apiStorageKey: camera.dataCamValue.UrlAPIStorage.secretkey, camURL: camera.dataCamValue, portContainer: camera.dataCamValue.urlhistoryport, dnsContainer: camera.dataCamValue.urlhistory, completeCamera: cam, typeMBOX: tipoMBOX })
    const protocolStorage = String(camera.dataCamValue.UrlAPIStorage.ip_url).split("://")[0]
    const dnsStorage = String(camera.dataCamValue.UrlAPIStorage.ip_url).split("://")[1]
    const tokenStorage = String(camera.dataCamValue.UrlAPIStorage.secretkey).replace("?", "")

    // History
    if (camera.dataCamValue && camera.dataCamValue.qnap_server_id && camera.dataCamValue.qnap_channel) {
      if (onlyHistory) this._loadMoreHistory(true);
    } else {
      if (tipoMBOX && onlyHistory) {
        this.setState({ historyLoading: true });
        const last_day = DateTime.local().plus({ days: -1 }).setZone('America/Mexico_City').toISODate();
        const current_day = DateTime.local().setZone('America/Mexico_City').toISODate();
        const createArrDate = (arr) => {
          let nuevoObjeto = {};
          arr.forEach((x) => {
            if (!nuevoObjeto.hasOwnProperty(x.fecha)) nuevoObjeto[x.fecha] = { videos: [] };
            nuevoObjeto[x.fecha].videos.push(x);
          });
          return nuevoObjeto;
        };
        const createArrHour = (arr) => {
          let nuevoObjeto = {};
          arr.forEach((x) => {
            if (!nuevoObjeto.hasOwnProperty(x.hour)) nuevoObjeto[x.hour] = { videos: [] };
            nuevoObjeto[x.hour].videos.push(x);
          });
          return nuevoObjeto;
        };

        try {
          if (tipoMBOX === 'pro') {
            let response = await conections.getCamDataHistory(camera.dataCamValue.id, camera.dataCamValue.num_cam, tipoMBOX);
            let resHistory = response.data.data;
            this.setState({ resHistorySearch: resHistory })
            if (resHistory.items.length > 0) {
              let dns_ip = dnsMbox
              let dns_port = dns_portMbox
              this.setState({ dnsPort: dns_port })
              if (resHistory) {
                let dates = createArrDate(resHistory.items);
                let arrayHistoricos = []
                let hours_last_day = createArrHour(dates[last_day].videos);
                let hours_current_day = createArrHour(dates[current_day].videos);
                this.setState({ video_history: [dns_ip, Object.values(hours_last_day).reverse().concat(Object.values(hours_current_day).reverse()).reverse()], historyLoading: false });
                this.setState({ dnsArray: this.state.video_history[0] })
                arrayHistoricos = this.state.video_history
                this.setState({ video_fistHistory: arrayHistoricos, video_loadMoreHistory: arrayHistoricos })
                this.setState({ video_history: arrayHistoricos[1].slice(0, 2) })
                setTimeout(() => this.spinnerif(), 400);
                this._loadfilesForSearch(camera, false, false, true, true, dns_ip, dns_port)
              } else {
                this.setState({ video_history: [], historyLoading: false });
                this.spinnerif();
              }
            } else {
              this.setState({ video_history: [], historyLoading: false });
              this.spinnerif();
            }
          } else {
            let response = await conections.getCamDataHistory(camera.dataCamValue.id, camera.dataCamValue.num_cam, tipoMBOX);
            if (response.data.data.items.length > 0) {
              let resHistory = tipoMBOX && removeSpaces(tipoMBOX) === 'axxon' ? [] : response.data.data;
              let info = response.data.data;
              this.setState({ resHistorySearch: resHistory, historicalPassword: info.historicalPassword, historicalUser: info.historicalUser, historyServerPort: info.dns_port, historyServerDns: info.dns_ip, historyServerProtocol: info.protocol, dnsPort: dns_portMbox })
              if (resHistory.items.length > 0) {
                let dns_ip = dnsMbox
                let dns_port = dns_portMbox
                this.setState({ dns_portdnsPort: dns_port, dnsPort: dns_port })
                if (resHistory) {
                  let dates = createArrDate(resHistory.items);
                  let arrayHistoricos = []
                  let hours_last_day = createArrHour(dates[last_day].videos);
                  let hours_current_day = createArrHour(dates[current_day].videos);
                  this.setState({ video_history: [dns_ip, Object.values(hours_last_day).reverse().concat(Object.values(hours_current_day).reverse()).reverse()], historyLoading: false });
                  this.setState({ dnsArray: this.state.video_history[0] })
                  arrayHistoricos = this.state.video_history
                  this.setState({ video_fistHistory: arrayHistoricos, video_loadMoreHistory: arrayHistoricos })
                  this.setState({ video_history: arrayHistoricos[1].slice(0, 2) })
                  setTimeout(() => this.spinnerif(), 400);
                  this._loadfilesForSearch(camera, false, false, true, true, dns_ip, dns_port)
                }
              } else {
                this.setState({ video_history: [], historyLoading: false });
                this.spinnerif();
              }
            } else {
              let tokenApiStreams = await conections.getTokenApiStreamsCams(protocol, dnsMbox, dns_portMbox, secretKeyBody);
              if (tokenApiStreams.data.token) {

                let response = await conections.getCamDataHistoryApiCams(protocol, dnsMbox, dns_portMbox, protocolStorage, dnsStorage, tokenStorage, camera.dataCamValue.num_cam, tokenApiStreams.data.token, portApiStorage);
                if (!response.success) {
                  let resHistory = response.data;
                  let dns_port = dns_portMbox
                  this.setState({ resHistorySearch: resHistory, awsApiStreamsCams: true })
                  this.setState({ dnsPort: dns_port })
                  if (resHistory.items.length > 0) {
                    let dns_ip = dnsMbox
                    let dns_port = dns_portMbox
                    this.setState({ dns_port: dns_port })
                    if (resHistory.success) {
                      let dates = createArrDate(resHistory.items);
                      let arrayHistoricos = []
                      let hours_last_day = createArrHour(dates[last_day].videos);
                      let hours_current_day = createArrHour(dates[current_day].videos);
                      this.setState({ video_history: [dns_ip, Object.values(hours_last_day).reverse().concat(Object.values(hours_current_day).reverse()).reverse()], historyLoading: false });
                      this.setState({ dnsArray: this.state.video_history[0] })
                      arrayHistoricos = this.state.video_history
                      this.setState({ video_fistHistory: arrayHistoricos, video_loadMoreHistory: arrayHistoricos })
                      this.setState({ video_history: arrayHistoricos[1].slice(0, 2) })
                      setTimeout(() => this.spinnerif(), 400);
                      this._loadfilesForSearch(camera, false, false, true, true, dns_ip, dns_port)
                    } else {
                      this.setState({ video_history: [], historyLoading: false });
                      this.spinnerif();
                    }
                  } else {
                    this.setState({ video_history: [], historyLoading: false });
                    this.spinnerif();
                  }
                } else {
                  let response = await conections.getCamDataHistoryWhithOutProtocol(protocol, dnsMbox, dns_portMbox, protocolStorage, dnsStorage, tokenStorage, camera.dataCamValue.num_cam, tokenApiStreams.data.token, portApiStorage);
                  let resHistory = response.data;
                  let dns_port = dns_portMbox
                  this.setState({ resHistorySearch: resHistory, awsApiStreamsCams: true })
                  this.setState({ dnsPort: dns_port })
                  if (resHistory.items.length > 0) {
                    let dns_ip = dnsMbox
                    let dns_port = dns_portMbox
                    this.setState({ dns_port: dns_port })
                    if (resHistory.success) {
                      let dates = createArrDate(resHistory.items);
                      let arrayHistoricos = []
                      let hours_last_day = createArrHour(dates[last_day].videos);
                      let hours_current_day = createArrHour(dates[current_day].videos);
                      this.setState({ video_history: [dns_ip, Object.values(hours_last_day).reverse().concat(Object.values(hours_current_day).reverse()).reverse()], historyLoading: false });
                      this.setState({ dnsArray: this.state.video_history[0] })
                      arrayHistoricos = this.state.video_history
                      this.setState({ video_fistHistory: arrayHistoricos, video_loadMoreHistory: arrayHistoricos })
                      this.setState({ video_history: arrayHistoricos[1].slice(0, 2) })
                      setTimeout(() => this.spinnerif(), 400);
                      this._loadfilesForSearch(camera, false, false, true, true, dns_ip, dns_port)
                    } else {
                      this.setState({ video_history: [], historyLoading: false });
                      this.spinnerif();
                    }
                  } else {
                    this.setState({ video_history: [], historyLoading: false });
                    this.spinnerif();
                  }
                }
              }
            }
          }

        } catch (err) {
          this.setState({ video_history: [], historyLoading: false });
        }
      } else {
        this.setState({ video_history: [], historyLoading: false });
      }
    }

    // Current
    if (tipoMBOX && (onlyCurrent || onlyPhotos)) {
      this.setState({ videosLoading: true, photosLoading: true });
      try {
        let response = await conections.getCamDataV2(camera.id);
        if (response.data) {
          this.setState({
            videos: response.data.data.files_multimedia.videos,
            photos: response.data.data.files_multimedia.photos,
            servidorMultimedia: 'http://' + response.data.data.dns_ip
          });
        }
        this.setState({ videosLoading: false, photosLoading: false });
      } catch (err) {
        this.setState({ videosLoading: false, photosLoading: false });
      }
    } else {
      this.setState({ videosLoading: false, photosLoading: false });
    }
  };

  _loadfilesForSearch = async (cam, destroyFiles = false, onlyCurrent = false, onlyHistory = false, onlyPhotos = false, dnsMbox = null, portMbox = null) => {
    if (destroyFiles) await this._destroyFileVideos(true, (onlyCurrent && onlyHistory && onlyPhotos), null, this.state.typeMBOX);
    let { selectedCamera } = this.state;
    let camera = cam && cam.id ? cam : selectedCamera;
    // History
    if (camera.dataCamValue && camera.dataCamValue.qnap_server_id && camera.dataCamValue.qnap_channel) {
      if (onlyHistory) this._loadMoreHistory(true);
    } else {
      if (onlyHistory) {
        let pruebas = []
        const last_day = DateTime.local().plus({ days: - 1 }).setZone('America/Mexico_City').toISODate();
        const current_day = DateTime.local().setZone('America/Mexico_City').toISODate();
        const createArrDate = (arr) => {
          let nuevoObjeto = {};
          arr.forEach((x) => {
            if (!nuevoObjeto.hasOwnProperty(x.fecha)) nuevoObjeto[x.fecha] = { videos: [] };
            nuevoObjeto[x.fecha].videos.push(x);
          });
          return nuevoObjeto;
        };
        const createArrHour = (arr) => {
          let nuevoObjeto = {};
          arr.forEach((x) => {
            if (!nuevoObjeto.hasOwnProperty(x.hour)) nuevoObjeto[x.hour] = { videos: [] };
            nuevoObjeto[x.hour].videos.push(x);
          });
          return nuevoObjeto;
        };

        let resHistory = this.state.resHistorySearch
        if (resHistory && resHistory.items.length > 0) {
          let dns_ip = dnsMbox
          let dns_port = portMbox
          this.setState({ dnsPort: dns_port })
          if (resHistory) {
            let dates = createArrDate(resHistory.items);
            if (dates[last_day]) {
              let hours_last_day = createArrHour(dates[last_day].videos);
              let hours_current_day = dates[current_day] && dates[current_day].videos ? createArrHour(dates[current_day].videos) : [];
              pruebas.push([dns_ip, Object.values(hours_last_day).reverse().concat(Object.values(hours_current_day).reverse()).reverse()])
            } else {
              let hours_current_day = createArrHour(dates[current_day].videos);
              pruebas.push([dns_ip, Object.values(hours_current_day).reverse()])
            }
          } else {
            this.setState({ video_history: [], historyLoading: false });
            this.spinnerif();
          }
        } else {
          this.setState({ video_history: [], historyLoading: false });
          this.spinnerif();
        }

        let countArraySearch = camera.dataCamValue.historyDays - 1
        this.setState({ countDays: camera.dataCamValue.historyDays });
        let conjunto = []
        if (countArraySearch <= 1) {
          for (let index = 1; index <= countArraySearch; index++) {
            const last_day = DateTime.local().plus({ days: - +index }).setZone('America/Mexico_City').toISODate();
            const createArrDate = (arr) => {
              let nuevoObjeto = {};
              arr.forEach((x) => {
                if (!nuevoObjeto.hasOwnProperty(x.fecha)) nuevoObjeto[x.fecha] = { videos: [] };
                nuevoObjeto[x.fecha].videos.push(x);
              });
              return nuevoObjeto;
            };
            const createArrHour = (arr) => {
              let nuevoObjeto = {};
              arr.forEach((x) => {
                if (!nuevoObjeto.hasOwnProperty(x.hour)) nuevoObjeto[x.hour] = { videos: [] };
                nuevoObjeto[x.hour].videos.push(x);
              });
              return nuevoObjeto;
            };

            //let response = await conections.getCamDataHistory(camera.dataCamValue.id, camera.dataCamValue.num_cam);
            let resHistory = this.state.resHistorySearch;
            if (resHistory.items.length > 0) {
              if (resHistory) {
                let dates = createArrDate(resHistory.items);
                if (dates[last_day]) {
                  let hours_last_day = createArrHour(dates[last_day].videos);
                  conjunto.push(Object.values(hours_last_day).reverse().reverse())
                  pruebas[0][1].push(conjunto)
                  this.setState({ video_advancedSearch: pruebas })
                }
              } else {
                this.setState({ video_history: [], historyLoading: false });
                this.spinnerif();
              }
            } else {
              this.setState({ video_history: [], historyLoading: false });
              this.spinnerif();
            }

          }
        }
        else {
          for (let index = 2; index <= countArraySearch; index++) {
            const last_day = DateTime.local().plus({ days: - +index }).setZone('America/Mexico_City').toISODate();
            const createArrDate = (arr) => {
              let nuevoObjeto = {};
              arr.forEach((x) => {
                if (!nuevoObjeto.hasOwnProperty(x.fecha)) nuevoObjeto[x.fecha] = { videos: [] };
                nuevoObjeto[x.fecha].videos.push(x);
              });
              return nuevoObjeto;
            };
            const createArrHour = (arr) => {
              let nuevoObjeto = {};
              arr.forEach((x) => {
                if (!nuevoObjeto.hasOwnProperty(x.hour)) nuevoObjeto[x.hour] = { videos: [] };
                nuevoObjeto[x.hour].videos.push(x);
              });
              return nuevoObjeto;
            };

            let resHistory = this.state.resHistorySearch;
            if (resHistory.items.length > 0) {
              if (resHistory) {
                let dates = createArrDate(resHistory.items);
                if (dates[last_day]) {
                  let hours_last_day = createArrHour(dates[last_day].videos);
                  conjunto.push(Object.values(hours_last_day).reverse().reverse())
                }
              } else {
                this.setState({ video_history: [], historyLoading: false });
                this.spinnerif();
              }
            } else {
              this.setState({ video_history: [], historyLoading: false });
              this.spinnerif();
            }

          }
          let conjunto2 = []
          for (let index = 0; index < countArraySearch - 1; index++) {
            if (!conjunto2.length) {
              conjunto2.push(conjunto[index])
            } else {
              conjunto[index] &&
                conjunto[index].map(videos => {
                  return conjunto2[0].push(videos)
                })
            }

          }
          conjunto2[0] &&
            conjunto2[0].map(videos => {
              return pruebas[0][1].push(videos)
            })
          this.addButtons(pruebas);
          this.setState({ video_advancedSearch: pruebas })
        }
      }
    };

  };

  addButtons = (video_advancedSearch) => {
    let arrayButtons = [];
    let auxWeek = [];

    if (this.state.arrayHistoricsByHour.length === 0) {
      if (video_advancedSearch[0]) {
        video_advancedSearch[0][1].forEach(el => {
          if (!arrayButtons.includes(el.videos[0].fecha)) {
            arrayButtons.push(el.videos[0].fecha);
          }
        })
      }
    }

    if (this.state.arrayWeek.length === 0) {
      for (let i = 0; i < 7; i++) {
        auxWeek.unshift(moment().subtract(i, 'days').startOf('date').format('YYYY-MM-DD'));
      }
    }

    if (arrayButtons.length > 0 && auxWeek.length > 0) {
      this.setState({ arrayWeek: auxWeek, arrayHistoricsByHour: arrayButtons });
    }

    const copyAuxWeek = JSON.parse(JSON.stringify(auxWeek));
    const orderDates = copyAuxWeek.sort((a, b) => { return new Date(b) - new Date(a) });
    let index = 0, startDate = arrayButtons[0];

    if (orderDates && startDate) { index = orderDates.indexOf(startDate); }
    this._getHistoricsByHour(index);

    let momentToMount = [moment(startDate).startOf('date').format('YYYY-MM-DD')];

    this._searchFileVideosNotqnap(momentToMount, "00", "24", null, null, null, video_advancedSearch);

  };

  _wsError = (err) => {
    //console.log('websocket error',err)
    //this.setState({display:'none'})
    //setTimeout(this.tryRconection,30000)
    this.setState({ tryReconect: false });
    this.tryReconect = false;
  };

  tryRconection = () => {
    try {
      var ws = new WebSocket(this.props.marker.extraData.webSocket);
      ws.onerror = this._wsError;
      ws.onclose = function () { };
      var p = new jsmpeg(ws, {
        canvas: this.refs.camRef,
        autoplay: true,
        audio: false,
        loop: true,
        onload: this._endedPlay /*, ondecodeframe:this._decode*/,
        onfinished: this._endedPlay,
        disableGl: true,
        forceCanvas2D: true
      });
      this.setState({
        webSocket: ws,
        player: p
      });
      this.setState({ tryReconect: false });
      this.tryReconect = false;
    } catch (err) {
      this._wsError(err);
    }
  };

  _restartCam = () => {
    if (!this.tryReconect && this.state.isVisible) {
      this.setState({ tryReconect: true });
      this.tryReconect = true;
      console.log('reconnecting, cam ' + this.state.data.num_cam);
      this.state.player.stop();
      if (this.state.player.destroy) {
        this.state.player.destroy();
      }
      if (this.state.webSocket) {
        this.state.webSocket.close();
      }
      setTimeout(this.tryRconection, 5000);
    }
  };

  _wsMessage = (msg) => {
    console.log('websock message', msg);
  };

  _playerError = (err) => {
    console.log('player error', err);
  };

  componentWillUnmount() {
    if (this.state.player) this.state.player.stop();
    if (this.state.webSocket) this.state.webSocket.close();
    if (this.state.isRecording) conections.stopRecord({ record_proccess_id: this.state.process_id }, this.state.data.id);
    clearInterval(this.state.interval);
    window.removeEventListener('restartCamEvent', this._restartCam, false);
    if (document.getElementById(`scrollVideo#${this.state.data.id}`)) {
      document.getElementById(`scrollVideo#${this.state.data.id}`).removeEventListener('scroll', this._infiniteScroll, false);
    }
  }

  _loadMoreVideosNotQnap = async (isFirst = false) => {
    let { video_history, video_fistHistory, countArray, video_loadMoreHistory } = this.state;

    let index = countArray
    let indexTwo = countArray + 2
    if (index < video_loadMoreHistory[1].length - 1) {
      if (video_history.length === 2) {
        index = 1
        let indexFirst = index
        let indexTwoFirst = indexFirst + 2
        let recorte = video_fistHistory[1].slice(indexFirst, indexTwoFirst);
        index = index + 1;
        video_history.push(recorte[1])
        this.setState({ video_history, historyLoading: false, countArray: index })
        this.setState({ historyLoading: false });
      } else {
        let recorte = video_fistHistory[1].slice(index, indexTwo);
        index = index + 1;
        video_history.push(recorte[1])
        this.setState({ video_history, historyLoading: false, countArray: index })
        this.setState({ historyLoading: false });
      }

    }
    else {
      this.setState({ countArray: 1, video_history: video_loadMoreHistory, historyLoading: false })
      this.setState({ hasMore: false });

    }

  }

  spinnerif = () => {
    if (this.state.loading) {
      setTimeout(() => {
        this.setState({ loading: false });
      }, 2500);
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

  _downloadFiles = async () => {
    this.setState({ loadingFiles: true });
    let { videos, photos, servidorMultimedia: server, data: camera } = this.state;

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

  _restartCamStream = async () => {
    const dns = this.state.data.webSocket.split(':')[1];
    this.setState({ restarting: true });
    try {
      const response = await conections.restartOneStream(dns, this.state.data.id);
      this.setState({ restarting: false });
      this._restartCam();
      console.log(response);
      if (response.status === 200) {
        if (!response.data.success) {
          localStorage.getItem(LANG) === "english" ? alert('Error to restart camera') : alert('Error al reiniciar cámara')
        }
      }
      return true;
    } catch (err) {
      this._restartCam();
      this.setState({ restarting: false });
      localStorage.getItem(LANG) === "english" ? alert('Error to restart camera') : alert('Error al reiniciar cámara')
      console.log(err);
      return false;
    }
  };

  _chageCamStatus = () => {
    conections
      .changeCamStatus(this.state.cameraID)
      .then((response) => {
        console.log(response);
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
  };
}

const mapStateToProps = (state) => ({
  QvrFileStationAuth: state.QvrFileStationAuth,
  QvrFileStationFileList: state.QvrFileStationFileList,
  QvrFileStationShareLink: state.QvrFileStationShareLink
});

const mapDispatchToProps = (dispatch) => ({
  getQvrFileStationAuthLogin: (params) => dispatch(QvrFileStationActions.getQvrFileStationAuthLogin(params)),
  getQvrFileStationAuthLogout: (params) => dispatch(QvrFileStationActions.getQvrFileStationAuthLogout(params)),
  getQvrFileStationFileList: (params) => dispatch(QvrFileStationActions.getQvrFileStationFileList(params)),
  getQvrFileStationShareLink: (params) => dispatch(QvrFileStationActions.getQvrFileStationShareLink(params)),
  getQvrFileStationDeleteShareLink: (params) => dispatch(QvrFileStationActions.getQvrFileStationDeleteShareLink(params))
});

export default connect(mapStateToProps, mapDispatchToProps)(CameraStream);
