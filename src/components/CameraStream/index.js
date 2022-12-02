import React, { Component } from 'react';
import { Card, Row, Col, Modal } from 'react-bootstrap';
import { Button, Form, Label, TextArea, Radio, Tab } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { DateTime } from 'luxon';

import Spinner from 'react-bootstrap/Spinner';
import JSZipUtils from 'jszip-utils';
import saveAs from 'file-saver';
import Chips from 'react-chips';
import jsmpeg from 'jsmpeg';
import moment from 'moment';
import JSZip from 'jszip';

import HlsPlayer from '../HlsPlayer';
import WssPlayer from '../WssPlayer';
import RtmpPlayer from '../RtmpPlayer';
import ControlPTZ from '../ControlPTZ';
import conections from '../../conections';
import AdvancedSearch from '../AdvancedSearch';
import MediaContainer from '../MediaContainer';
// import constants from '../../constants/constants';
import ModalMoreInformation from '../../components/ModalMoreInformation';
import { HiMicrophone } from 'react-icons/hi';

import * as QvrFileStationActions from '../../store/reducers/QvrFileStation/actions';
import * as QvrFunctions from '../../functions/getQvrFunctions';

import './style.css';

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
    showPTZ: false
  };

  lastDecode = null;
  tryReconect = false;

  render() {
    let { activeIndex, display, num_cam, cameraID, cameraName, showData, photos, data, qnapServer, qnapChannel, servidorMultimedia, photosLoading, videosLoading, videos, historyLoading, video_history, searchLoading, isNewSearch, video_search, tryReconect, showModalMoreInformation, loadingSnap, isLoading, isRecording, restarting, loadingFiles, modal, recordMessage, modalProblem, typeReport, phones, mails, problemDescription, showPTZ, inputCkecked, portContainer, dnsContainer } = this.state;
    return (
      <Card style={{ display: display }}>
        {this.props.horizontal ? (
          <Card.Body>
            <Card.Title>
              {
              // this.state.data.dataCamValue.is_mic ? 
              // <Row>
              //   <Col md={8} lg={8}>
              //   Camara {num_cam}
              //   </Col>
              //   <Col md={4} lg={4} style={{display: "flex", justifyContent: "flex-end"}}>
              //     <HiMicrophone />
              //   </Col>
              // </Row>
              // :
            `Camara ${num_cam}`
            }
            </Card.Title>
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
            {this.props.hideTitle ? null : (
              <Card.Title>
                <div align="left">
                  <i className="fa fa-video-camera" /> Camaras {num_cam}{' '}
                  {this.props.marker.extraData.dataCamValue === undefined || this.props.marker.extraData.tipo_camara === undefined ? null :
                    this.props.marker.extraData.dataCamValue.tipo_camara === 2 || this.props.marker.extraData.tipo_camara === 2 ? (
                      <i>, Tipo: PTZ </i>
                    ) : null}
                </div>
              </Card.Title>
            )}
            {showData ? (
              <div className="row dataHolder p10">
                {showPTZ &&
                  <div className="col ptz">
                    Controles
                    <ControlPTZ
                      camera={data}
                      isInMap={true}
                      hasMatch={false}
                    />
                  </div>
                }
                <div className="col snapshots">
                  Fotos
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
                        <p className="big-letter">No hay archivos que mostrar</p>
                        <i className="fa fa-image fa-5x" />
                      </div>
                    )}
                  </div>
                </div>
                <div id={`scrollVideo#${data.id}`} className="col videos">
                  Videos
                  <Tab
                    align="center"
                    activeIndex={activeIndex}
                    onTabChange={(e, { activeIndex }) => this.tabHandler(activeIndex)}
                    menu={{ secondary: true, pointing: true }}
                    panes={[
                      {
                        menuItem: 'Grabaciones',
                        render: () => (
                          <Tab.Pane attached={false}>
                            {this._renderVideoList(videosLoading, videos)}
                          </Tab.Pane>
                        )
                      },
                      this.props.moduleActions && this.props.moduleActions.viewHistorial && {
                        menuItem: 'Ultimas 24 Horas',
                        render: () => (
                          <Tab.Pane attached={false}>
                            {this._renderVideoList(
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
                        menuItem: 'Busqueda Avanzada',
                        render: () => (
                          <Tab.Pane attached={false}>
                            <AdvancedSearch
                              loading={searchLoading}
                              _searchFileVideos={this._searchFileVideos}
                            />
                            {(isNewSearch || searchLoading) && <hr />}
                            {this._renderVideoList(searchLoading, video_search, isNewSearch)}
                          </Tab.Pane>
                        )
                      }
                    ]}
                  />
                </div>
              </div>
            ) : null}
            <div className={showData ? 'camHolder hideCamHolder' : 'camHolder'} style={{ width: '100%' }} align="center">
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
                  <HlsPlayer
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
                    ref="camRef"
                    id={'canvasCamaraStream' + data.id}
                    style={{ width: '100%', height: '100%' }}
                  />
                )}
                {tryReconect ? 'Reconectando...' : null}
              </div>
            </div>
            {this.props.hideText ? null : (
              <div align="left">
                {cameraName && !this.props.hideInfo ? <p>
                  Direccion: {cameraName}
                </p> : null}
                {this.props.marker.extraData.dataCamValue.entrecalles ? <p>
                  Entre calles: {this.props.marker.extraData.dataCamValue.entrecalles}
                </p> : null}
                {data.rel_cuadrante ? data.rel_cuadrante.length !== 0 ? (
                  data.rel_cuadrante.map(
                    (item) =>
                      item.Cuadrante && item.Cuadrante.activo ? (
                        <Label key={item.id} className="styleTag" as="a" tag onClick={() => this._goToCuadrante(item.id_cuadrante)}>{item.Cuadrante.name}</Label>
                      ) : null
                  )
                ) : null : null}
                {this.props.hideButton ? null : (
                  <div>
                    <br />
                    <Button onClick={() => this.setState({ showModalMoreInformation: true })} className="ml-2 mt-1">Más información</Button>
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
                {this.props.moduleActions ? this.props.moduleActions.btnsnap ? <Button basic disabled={photos.length >= 5 || loadingSnap || isLoading || isRecording || restarting || loadingFiles} loading={loadingSnap} onClick={() => this._snapShot(this.props.marker.extraData)}><i className='fa fa-camera' /></Button> : null : null}
                {/*<Button basic disabled={loadingSnap||isLoading||isRecording||restarting||loadingFiles} onClick={this._togglePlayPause}><i className={isPlay?'fa fa-pause':'fa fa-play'}/></Button>*/}
                {this.props.moduleActions ? this.props.moduleActions.btnrecord ? <Button basic disabled={videos.length >= 5 || loadingSnap || isLoading || restarting || loadingFiles} loading={isLoading} onClick={() => this.recordignToggle()}><i className={isRecording ? 'fa fa-stop-circle recording' : 'fa fa-stop-circle'} style={{ color: 'red' }} /></Button> : null : null}
                <Button basic disabled={loadingFiles || loadingSnap || isLoading || restarting || videosLoading || photosLoading || (photos.length <= 0 && videos.length <= 0)} loading={loadingFiles} onClick={() => this._downloadFiles()}><i className='fa fa-download' /></Button>
                {this.props.hideFileButton ? null : <Button className="pull-right" variant="outline-secondary" onClick={() => { this.setState({ showData: !showData }) }}><i className={showData ? 'fa fa-video-camera' : 'fa fa-list'} /></Button>}
                {this.props.showExternal ? <Button basic disabled={loadingSnap || isLoading || isRecording || restarting || loadingFiles} onClick={() => window.open(window.location.href.replace(window.location.pathname, '/') + 'analisis/' + data.id, '_blank', 'toolbar=0,location=0,directories=0,status=1,menubar=0,titlebar=0,scrollbars=1,resizable=1')}><i className="fa fa-external-link" /></Button> : null}
                <Button basic disabled={loadingSnap || isLoading || isRecording || restarting || loadingFiles} onClick={() => this.setState({ modalProblem: true })}><i className="fa fa-warning" /></Button>
                <Button basic onClick={this._chageCamStatus}><i className="fa fa-exchange" /></Button>
                {this.props.marker.extraData.dataCamValue && this.props.marker.extraData.dataCamValue.tipo_camara === 2 && this.props.marker.extraData.dataCamValue.dns != null ? <Button basic onClick={() => this.Clicked(this.props.marker.extraData.dataCamValue.dns)}><i className="fa fa-sliders" /></Button> : null}
                {this.props.marker.extraData.dataCamValue && this.props.marker.extraData.dataCamValue.tipo_camara === 2 && this.props.marker.extraData.dataCamValue.camera_ip != null ? <Button basic onClick={() => this.setState({ showPTZ: !showPTZ })}><i className="fa fa-arrows" /></Button> : null}
                {/*<Button basic disabled={loadingSnap||isLoading||isRecording||restarting||loadingFiles} onClick={this._restartCamStream}><i className={!restarting?"fa fa-repeat":"fa fa-repeat fa-spin"}/></Button>*/}
              </Card.Footer>
            ) : null}
          </Card.Body>
        )}
        {this.props.showFilesBelow ? (
          <div className="row dataHolder p10">
            {showPTZ &&
              <div className="col ptz">
                Controles
                <ControlPTZ
                  camera={data}
                  isInMap={false}
                  hasMatch={false}
                />
              </div>
            }
            <div className="col snapshots">
              Fotos
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
                        isQnap={false}
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
            <div id={`scrollVideo#${data.id}`} className="col videos">
              Videos
              <Tab
                align="center"
                activeIndex={activeIndex}
                onTabChange={(e, { activeIndex }) => { this.tabHandler(activeIndex) }}
                menu={{ secondary: true, pointing: true }}
                panes={[
                  {
                    menuItem: 'Grabaciones',
                    render: () => (
                      <Tab.Pane attached={false}>
                        {this._renderVideoList(videosLoading, videos)}
                      </Tab.Pane>
                    )
                  },
                  this.props.moduleActions && this.props.moduleActions.viewHistorial && {
                    menuItem: 'Ultimas 24 Horas',
                    render: () => (
                      <Tab.Pane attached={false}>
                        {this._renderVideoList(
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
                    menuItem: 'Busqueda Avanzada',
                    render: () => (
                      <Tab.Pane attached={false}>
                        <AdvancedSearch
                          loading={searchLoading}
                          _searchFileVideos={this._searchFileVideos}
                        />
                        {(isNewSearch || searchLoading) && <hr />}
                        {this._renderVideoList(searchLoading, video_search, isNewSearch)}
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
        >
          <Modal.Header closeButton>Reportar problema en camara {data.num_cam}</Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Field>
                <Form.Field>
                  <Radio
                    label="Reportar emergencia"
                    name="typeReport"
                    value={1}
                    checked={typeReport === 1}
                    onChange={this.handleChange}
                  />
                </Form.Field>
                <Form.Field>
                  <Radio
                    label="Mantenimiento de camara"
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
                    Se notificara a los numeros de emergencia registrados. Si se desea agregar un telefono
                    extra ingreselo aqui indicando la lada del mismo(+525512345678).
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
                    Se notificara a los emails de emergencia registrados. Si se desea agregar un email extra
                    ingreselo aqui.
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
                    Se lo mas claro posible, indique si ha realizado alguna accion para intentar resolver el
                    problema.
                  </Label>
                ) : (
                  <Label>Indique la emergencia que se presento en la camara.</Label>
                )}
                <TextArea
                  value={problemDescription}
                  onChange={this.handleChange}
                  rows={10}
                  name="problemDescription"
                  placeholder="Redacte aqui su problema"
                />
              </Form.Field>
            </Form>
            <Button className="pull-right" primary onClick={this._sendReport}>
              Enviar
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
    let { hasMore, data: selectedCamera, qnapServer, qnapChannel, servidorMultimedia, apiStorageKey, awsApiStreamsCams, portContainer, dnsContainer, completeCamera, typeMBOX, dnsArray } = this.state;
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
                cam={selectedCamera}
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
            isQnap={false}
            dns_ip={hasDns && `http://${hasDns}`}
            exists_video={true}
            cam={selectedCamera}
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
    console.log(this.state.cameraProblem);
    this.setState({ modalProblem: false });
    conections
      .sendTicket({
        camera_id: this.state.data.id,
        problem: this.state.problemDescription,
        phones: this.state.phones.join(),
        mails: this.state.mails.join(),
        type_report: this.state.typeReport
      })
      .then((response) => {
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
    this.setState({ loadingSnap: true });
    let response = await conections.snapShotV2(camera.id);
    const data = response.data;
    if (data.success) this._loadFiles(camera, false, false, false, true);
    this.setState({ loadingSnap: false });
  };

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
                let resHistory = response.data.data;
                this.setState({ resHistorySearch: resHistory })
                if (resHistory.items.length > 0) {
                  let dns_ip = dnsMbox
                  let dns_port = dns_portMbox
                  this.setState({ dns_portdnsPort: dns_port })
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
      }else{
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
    }else{
      this.setState({ videosLoading: false, photosLoading: false });
    }
  };

  _loadfilesForSearch = async (cam, destroyFiles = false, onlyCurrent = false, onlyHistory = false, onlyPhotos = false, dnsMbox = null, portMbox = null) => {
    if (destroyFiles) await this._destroyFileVideos(true, (onlyCurrent && onlyHistory && onlyPhotos));
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
        if (resHistory.items.length > 0) {
          let dns_ip = dnsMbox
          let dns_port = portMbox
          this.setState({ dnsPort: dns_port })
          if (resHistory) {
            let dates = createArrDate(resHistory.items);
            //let dates = createArrDate(resHistory.items);
            let hours_last_day = createArrHour(dates[last_day].videos);
            let hours_current_day = createArrHour(dates[current_day].videos);
            pruebas.push([dns_ip, Object.values(hours_last_day).reverse().concat(Object.values(hours_current_day).reverse()).reverse()])
          } else {
            this.setState({ video_history: [], historyLoading: false });
            this.spinnerif();
          }
        } else {
          this.setState({ video_history: [], historyLoading: false });
          this.spinnerif();
        }

        let countArraySearch = 4
        let conjunto = []
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

          //let response = await conections.getCamDataHistory(camera.dataCamValue.id, camera.dataCamValue.num_cam);
          let resHistory = this.state.resHistorySearch;
          if (resHistory.items.length > 0) {
            if (resHistory) {
              let dates = createArrDate(resHistory.items);
              let hours_last_day = createArrHour(dates[last_day].videos);
              conjunto.push(Object.values(hours_last_day).reverse().reverse())
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
            conjunto[index].map(videos => {
              return conjunto2[0].push(videos)
            })
          }

        }
        conjunto2[0].map(videos => {
          return pruebas[0][1].push(videos)
        })
        this.setState({ video_advancedSearch: pruebas })
      }
    };

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
          alert('Error al reiniciar camara');
        }
      }
      return true;
    } catch (err) {
      this._restartCam();
      this.setState({ restarting: false });
      alert('Error al reiniciar camara');
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
