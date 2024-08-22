import React, { Component } from 'react';
import { Button, Tab } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { DateTime } from 'luxon';

import Spinner from 'react-bootstrap/Spinner';
import moment from 'moment-timezone';
import NotificationSystem from 'react-notification-system';

// import Match from '../Match';
import ControlPTZ from '../ControlPTZ';
import conections from '../../conections';
import CameraStream from '../CameraStream';
import AdvancedSearch from '../AdvancedSearch';
import MediaContainer from '../MediaContainer';
import responseJson from '../../assets/json/suspects.json';
import LoadingLogo from '../LoadingLogo';

import * as QvrFileStationActions from '../../store/reducers/QvrFileStation/actions';
import * as QvrFunctions from '../../functions/getQvrFunctions';
import Strings from '../../constants/strings';
import { removeSpaces } from '../../functions/removeSpaces';

import './style.css';
import { LANG } from '../../constants/token';

const SHOW_HISTORY = 3;
class LoopCamerasDisplay extends Component {
  notificationSystem = React.createRef();
  state = {
    scroll: [],
    hasMore: true,
    scrollInitialDate: moment().startOf('date'),
    activeIndex: 0,
    markers: [],
    fullHeight: 10,
    slideIndex: 0,
    autoplay: true,
    interval: null,
    isRecording: false,
    photos: [],
    videos: [],
    video_history: [],
    video_search: [],
    video_ssid: [],
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
    selectedCamera: {},
    qnapServer: null,
    qnapChannel: null,
    isplaying: [],
    matches: [],
    height: undefined,
    limit: 10,
    start: 0,
    pageCount: 1,
    isplay: true,
    servidorMultimedia: '',
    loadingSnap: false,
    videosLoading: false,
    historyLoading: false,
    searchLoading: false,
    isNewSearch: false,
    photosLoading: false,
    recordingCams: [],
    recordingProcess: [],
    loadingRcord: false,
    showPTZ: false,
    loadingHistorics: false,
    historicalUser: null,
    historicalPassword: null,
    historyServerDns: null,
    loadingUpdate: false
  };

  _showCameraInfo() {
    this.props.toggleControlsBottom();
  }

  render() {
    let { activeIndex, markers, slideIndex, autoplay, photos, videos, video_history, video_search, selectedCamera, qnapServer, qnapChannel, height, servidorMultimedia, loadingSnap, videosLoading, historyLoading, searchLoading, photosLoading, isNewSearch, recordingCams, restarting, showPTZ, inputCkecked, portContainer, dnsContainer, typeMBOX, loadingUpdate, isRecording } = this.state
    let { error, propsIniciales, moduleActions, loadingFiles } = this.props
    return (
      <div className="holderOfSlides" align="center">
        <NotificationSystem ref={this.notificationSystem} />
        {error ? (<div className="errorContainer">{localStorage.getItem(LANG) === "english" ? "Error to show information" : "Error al cargar informacion: "}{JSON.stringify(error)}</div>) : null}
        {
          loadingUpdate ?
            <LoadingLogo /> : height ? (
              markers.map((value, index) =>
                index === slideIndex ? (
                  <div key={value.extraData.id} style={{ height: 'auto', width: '100%', paddign: '50%' }} align="center" className={index === slideIndex ? '' : 'hiddenCameraNotshow'}>
                    <CameraStream
                      propsIniciales={propsIniciales}
                      ref={'camstreamloopref' + value.extraData.id}
                      marker={value}
                    />
                  </div>
                ) : null
              )
            ) : null
        }
        <div className={!autoplay ? 'camControl showfiles' : 'camControl'}>
          {markers[slideIndex] ? (
            <div className="row stiky-top">
              <div className="col-10" style={{ display: "flex", justifyContent: "space-around", marginLeft: "1.1rem" }}>
                {moduleActions ? moduleActions.btnsnap ? <Button basic circular className="actions-btn-grid" disabled={photos.length >= 5 || restarting || loadingSnap || loadingFiles || recordingCams.indexOf(markers[slideIndex].extraData) > -1} loading={loadingSnap} onClick={() => this._snapShot(markers[slideIndex].extraData)}><i className='fa fa-camera' />{!loadingSnap && <p style={{ marginTop: "0.2rem" }}>Toma de foto</p>}</Button> : null : null}
                {/* <Button basic circular className="actions-btn-grid" disabled={restarting||loadingSnap||loadingFiles||recordingCams.indexOf(markers[slideIndex].extraData)>-1} onClick={this._playPause}><i className={isplay?'fa fa-pause':'fa fa-play'}/></Button> */}
                {moduleActions ? moduleActions.btnrecord && (typeMBOX && removeSpaces(typeMBOX) !== 'axxon') ? <Button basic circular className="actions-btn-grid" disabled={videos.length >= 5 || restarting || loadingSnap || loadingFiles} onClick={() => this._recordignToggle(markers[slideIndex].extraData)}><i className={recordingCams.indexOf(markers[slideIndex].extraData) > -1 ? 'fa fa-stop-circle recording' : 'fa fa-stop-circle'} style={{ color: 'red' }} />{!isRecording && <p style={{ marginTop: "0.2rem" }}>Toma de video</p>}</Button> : null : null}
                {/* <Button basic circular className="actions-btn-grid" disabled={restarting || loadingSnap || loadingFiles || recordingCams.indexOf(markers[slideIndex].extraData) > -1} onClick={() => window.open(window.location.href.replace(window.location.pathname, '/') + 'analisis/' + markers[slideIndex].extraData.id, '_blank', 'toolbar=0,location=0,directories=0,status=1,menubar=0,titlebar=0,scrollbars=1,resizable=1')}><i className="fa fa-external-link" /></Button> */}
                <Button basic circular className="actions-btn-grid" disabled={restarting || loadingSnap || loadingFiles || recordingCams.indexOf(markers[slideIndex].extraData) > -1 || videosLoading || photosLoading || (photos.length <= 0 && videos.length <= 0)} onClick={() => this.props.downloadFiles(markers[slideIndex].extraData, { videos, photos, servidorMultimedia })} loading={loadingFiles}><i className="fa fa-download" /><p style={{ marginTop: "0.2rem" }}>Descargar</p></Button>
                {/* <Button basic circular className="actions-btn-grid" disabled={restarting || loadingSnap || loadingFiles || recordingCams.indexOf(markers[slideIndex].extraData) > -1} onClick={() => this.props.makeReport(markers[slideIndex].extraData)}><i className="fa fa-warning" /></Button> */}
                {/* <Button basic circular className="actions-btn-grid" disabled={restarting||loadingSnap||loadingFiles||recordingCams.indexOf(markers[slideIndex].extraData)>-1} onClick={this._restartCamStream}><i className={!restarting?"fa fa-repeat":"fa fa-repeat fa-spin"}/></Button> */}
                <Button basic circular className="actions-btn-grid" onClick={() => this.props.changeStatus(markers[slideIndex].extraData)}><i className="fa fa-exchange" /><p style={{ marginTop: "0.2rem" }}>Cambiar estado</p></Button>
                {/* {markers[slideIndex].extraData.dataCamValue && markers[slideIndex].extraData.dataCamValue.tipo_camara === 2 && markers[slideIndex].extraData.dataCamValue.dns != null ? <Button basic circular className="actions-btn-grid" onClick={() => this.Clicked(markers[slideIndex].extraData.dataCamValue.dns)}><i className="fa fa-sliders" /></Button> : null} */}
                {markers[slideIndex].extraData.dataCamValue && markers[slideIndex].extraData.dataCamValue.tipo_camara === 2 && markers[slideIndex].extraData.dataCamValue.camera_ip != null ? <Button basic circular className="actions-btn-grid" onClick={() => this.setState({ showPTZ: !showPTZ })}><i className="fa fa-arrows" /><p style={{ marginTop: "0.2rem" }}>Controles PTZ</p></Button> : null}
              </div>
              <div className="col-1">
                <Button onClick={() => this._openCameraInfo(markers[slideIndex])} className='pull-right' primary style={{ margin: "0.5rem", height: "3rem", width: "3rem", display: "flex", justifyContent: "center", aligntItems: "center" }}><i className={autoplay ? 'fa fa-square' : 'fa fa-play'}></i>
                  {/* {autoplay ? localStorage.getItem(LANG) === "english" ? 'Stop loop' : 'Parar loop' : localStorage.getItem(LANG) === "english" ? 'Play loop' : 'Continuar loop'} 
                <i className={autoplay ? 'fa fa-chevron-up' : 'fa fa-chevron-down'} /> */}
                </Button>
              </div>
            </div>
          ) : null}
          <div className={!autoplay ? 'row showfilesinfocamera' : 'row hidefiles'}>
            {showPTZ &&
              <div className="col ptz">
                <ControlPTZ
                  camera={selectedCamera}
                  isInMap={false}
                  hasMatch={true}
                  _reloadCamPTZ={this._changeReloadCamPTZ}
                />
              </div>
            }
            {typeMBOX && removeSpaces(typeMBOX) !== 'axxon' &&
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
                          isQnap={false}
                          exists_image={true}
                          cam={selectedCamera}
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
                      <p className="big-letter">{localStorage.getItem(LANG) === "english" ? "No files to show" : "No hay archivos que mostrar"}</p>
                      <i className="fa fa-image fa-5x" />
                    </div>
                  )}
                </div>
              </div>
            }
            <div id="scrollVideo" className="col videos">
              Videos
              <Tab
                align="center"
                activeIndex={activeIndex}
                onTabChange={(e, { activeIndex }) => this.setState({ activeIndex })}
                menu={{ secondary: true, pointing: true }}
                panes={[
                  typeMBOX && removeSpaces(typeMBOX) !== 'axxon' && {
                    menuItem: localStorage.getItem(LANG) === "english" ? "Recordings" : "Grabaciones",
                    render: () => (
                      <Tab.Pane attached={false}>
                        {this._renderVideoList(videosLoading, videos)}
                      </Tab.Pane>
                    )
                  },
                  moduleActions && moduleActions.viewHistorial && {
                    menuItem: localStorage.getItem(LANG) === "english" ? "Historics" : "Históricos",
                    render: () => (
                      <Tab.Pane attached={false}>
                        {this._renderVideoList(
                          historyLoading,
                          video_history[1] && video_history[1].length > 0 ? video_history[1] : video_history,
                          true,
                          video_history[1] && video_history[1].length > 0 ? video_history[0] : null,
                          true, inputCkecked, false, true
                        )}
                      </Tab.Pane>
                    )
                  },
                  qnapServer && qnapChannel && {
                    menuItem: localStorage.getItem(LANG) === "english" ? "Advanced Search" : "Búsqueda Avanzada",
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
            <div className="col matches" align="center">
              {localStorage.getItem(LANG) === "english" ? "History" : "Historial"}
              {/* --- matches reales ---
							{matches.length>0?matches.map((value, index)=><Match key={index} info={value} toggleControls={this._closeControl} />):<h4>Sin historial de matches</h4>} 
							*/}
              {/* --- matches planchados */}
              {/* {matches ? (
								matches.map((value, index) => (
									<Match key={index} info={value} toggleControls={this._closeControl} />
								))
							) : null} */}
            </div>
          </div>
        </div>
      </div>
    );
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
    let { hasMore, selectedCamera, qnapServer, qnapChannel, servidorMultimedia, apiStorageKey, awsApiStreamsCams, portContainer, dnsContainer, completeCamera, typeMBOX, dnsArray } = this.state;
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
        <p className="big-letter">{localStorage.getItem(LANG) === "english" ? "No files to show" : "No hay archivos que mostrar"}</p>
        <i className="fa fa-image fa-5x" />
      </div>
    ) : null;
  };

  _snapShot = async (camera) => {
    const { dnsPort, typeMBOX, historyServerProtocol, historicalPassword, historicalUser, historyServerDns } = this.state;
    let title = 'Descarga de fotografía', message = Strings.unprocessed, level = 'warning';

    if (typeMBOX && removeSpaces(typeMBOX) === 'axxon') {
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
          if (parseInt(dnsPort) === 80 || parseInt(dnsPort) === 443) {
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
            if (parseInt(xhr.status) === 401) { console.log("onerror:", xhr.status) }
            this.setState({ loadingSnap: false });
            this.addNotification({ message, level, title });
          };

          xhr.onload = (e) => {
            let blob = xhr.response;
            if (blob && xhr.status === 200) {
              const fileName = `CAM${camera.id}.jpeg`;
              this.saveFile(blob, fileName);
              this.setState({ loadingSnap: false });
            } else {
              this.addNotification({ message, level, title });
              this.setState({ loadingSnap: false });
            }
          };
          xhr.send();
        } else {
          this.addNotification({ message, level, title });
          this.setState({ loadingSnap: false });
        }
      } else {
        this.addNotification({ message, level, title });
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

  _recordignToggle = async (selectedCamera) => {
    let response = {};
    if (this.state.recordingCams.indexOf(selectedCamera) > -1) {
      this.setState({ loadingRcord: true });
      let process_id = 0;
      this.state.recordingProcess.map((value) => {
        if (value.cam_id === selectedCamera.id) process_id = value.process_id;
        return true;
      });

      let r = await conections.stopRecordV2({ clave: process_id }, selectedCamera.id);
      response = r.data;
      if (response) {
        let stateRecordingProcess = this.state.recordingProcess;
        let stateRecordingCams = this.state.recordingCams;
        stateRecordingCams = stateRecordingCams.filter((el) => el !== selectedCamera);
        stateRecordingProcess = stateRecordingProcess.filter((el) => el.cam_id !== selectedCamera.id);
        this.setState({ recordingCams: stateRecordingCams, recordingProcess: stateRecordingProcess, isRecording: false, loadingRcord: false, modal: true, recordMessage: response.msg });
        if (response.success) this._loadFiles(selectedCamera, false, true, false, false);
      }
    } else {
      let r = await conections.startRecordV2({}, selectedCamera.id);
      response = r.data;
      if (response && response.success === true) {
        let recordingProcess = { cam_id: selectedCamera.id, process_id: response.clave, creation_time: moment() };
        let stateRecordingProcess = this.state.recordingProcess;
        let stateRecordingCams = this.state.recordingCams;
        stateRecordingProcess.push(recordingProcess);
        stateRecordingCams.push(selectedCamera);
        this.setState({ recordingCams: stateRecordingCams, recordingProcess: stateRecordingProcess, isRecording: true });
        if (this.state.interval === null) {
          let interval = setInterval(this._checkLiveTimeRecording, 5000);
          this.setState({ interval: interval });
        }
      }
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
            this.setState({ recordingCams: stateRecordingCams, recordingProcess: stateRecordingProcess, isRecording: false, loadingRcord: false });
            this._loadFiles({}, false, true, true, true);
          });
        }
        return value;
      });
    } else {
      clearInterval(this.interval);
      this.setState({ interval: null });
    }
  };

  _recordToggle = () => {
    //this.props.recordignToggle(this.state.markers[this.state.slideIndex])
  };
  _playPause = () => {
    let isplaying = this.state.isplaying;
    if (this.state.isplaying.length === 0) {
      isplaying = {};
      this.state.markers.map((value, index) => {
        isplaying[index] = true;
        return true;
      });
    }
    isplaying[this.state.slideIndex] = !isplaying[this.state.slideIndex];
    this.setState({ isplaying: isplaying, isplay: isplaying[this.state.slideIndex] });
    this.refs['camstreamloopref' + this.state.markers[this.state.slideIndex].id]._togglePlayPause();
  };

  _restartCamStream = async () => {
    const index = 'camstreamloopref' + this.state.markers[this.state.slideIndex].extraData.id;
    if (this.refs[index] === undefined) return;
    this.setState({ restarting: true });
    await this.refs[index]._restartCamStream();
    this.setState({ restarting: false });
  };

  _openCameraInfo = (marker) => {
    if (this.props.error === null || this.props.error === undefined) {
      if (this.state.autoplay) {
        clearInterval(this.state.interval);
        this.setState({
          autoplay: false,
          selectedCamera: marker.extraData,
          qnapServer: marker.extraData.dataCamValue.qnap_server_id,
          qnapChannel: marker.extraData.dataCamValue.qnap_channel
        }, () => {
          this._loadFiles(marker.extraData, true, true, true, true);
        });
      } else {
        const time = setInterval(this.changeSlide, 5000);
        this._destroyFileVideos(true, true, this.state.qnapServer);
        this.setState({ autoplay: true, interval: time, selectedCamera: {}, qnapServer: null, qnapChannel: null });
      }
    }
  };

  _searchFileVideos = async (dates, startHour, endHour, stateNames, setNewState = true, searchFileHours = false) => {
    let { selectedCamera, video_ssid, qnapServer, qnapChannel } = this.state;
    let isNewSearch = stateNames.list === 'video_search';
    if (setNewState) this.setState({ [stateNames.loading]: true });

    let searchVideos = {};
    let allVideosList = [];
    let lthDate = 1;

    let { ptcl, host, port, user, pass } = qnapServer;
    let url = `${ptcl}${host}${port ? `:${port}` : null}`;
    await this.props.getQvrFileStationAuthLogin({ url, user, pass });

    let { QvrFileStationAuth: auth } = this.props.QvrFileStationAuth;
    if (auth && auth.authSid) {
      let mainPath = QvrFunctions._getPath(qnapChannel);
      for (const dt of dates) {
        let getFistHourParams = { url, sid: auth.authSid, path: `${mainPath}/${dt}`, limit: 1, start: 0, type: '0' };
        await this.props.getQvrFileStationFileList(getFistHourParams);
        let { QvrFileStationFileList: firstHour } = this.props.QvrFileStationFileList;
        let initialHour = firstHour.datas && firstHour.datas[0] ? parseInt(firstHour.datas[0].filename, 10) : 0;
        if (searchFileHours) return initialHour;

        let newEndHour = lthDate === dates.length ? parseInt(endHour, 10) : 24;
        let newStartHour = lthDate === 1 ? parseInt(startHour, 10) : 0;
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
          for (const hr of listHours.datas) {
            if (parseInt(hr.filename, 10) < (lthDate === dates.length ? parseInt(endHour, 10) : 24)) {
              let getParamsVideo = { url, sid: auth.authSid, path: `${mainPath}/${dt}/${hr.filename}`, limit: '2', start: '0', type: '2' };
              await this.props.getQvrFileStationFileList(getParamsVideo);
              let { QvrFileStationFileList: listVideos, success: sVideos } = this.props.QvrFileStationFileList;
              if (sVideos && listVideos && listVideos.total > 0) for (const v of listVideos.datas) allVideosList.push(`${dt}/${hr.filename}/${v.filename}`);
            }

            if (selectedCamera.id !== this.state.selectedCamera.id) {
              await this._destroyFileVideos(false, false, qnapServer);
              break;
            }
          }
        }
        lthDate++;
        if (selectedCamera.id !== this.state.selectedCamera.id) {
          await this._destroyFileVideos(false, false, qnapServer);
          break;
        }
      }

      if (selectedCamera.id === this.state.selectedCamera.id && allVideosList.length > 0) {
        let expire_time = moment().add(1, 'd').unix();
        let sharedParams = { url, host, sid: auth.authSid, path: mainPath, files: allVideosList, expire_time };
        await this.props.getQvrFileStationShareLink(sharedParams);
        let { QvrFileStationShareLink: listShare } = this.props.QvrFileStationShareLink;
        searchVideos = QvrFunctions._getCleanListVideos(listShare.links, url);

        if (listShare && listShare.ssid) video_ssid.push({ ssid: listShare.ssid, total: listShare.total });
        this.props.QvrFileStationShareLink.QvrFileStationShareLink.ssid = video_ssid;
      }
      await this.props.getQvrFileStationAuthLogout({ url });
    }
    if (selectedCamera.id === this.state.selectedCamera.id) {
      if (setNewState) this.setState({ [stateNames.loading]: false, [stateNames.list]: searchVideos });
      this.setState({ isNewSearch, video_ssid });
      return searchVideos;
    }
  };

  _destroyFileVideos = async (loading = false, setNewState = true, lastState = this.state.qnapServer, typeMbox = false) => {
    if (setNewState) {

      if (typeMbox === 'axxon') {
        const historialTab = 1;
        this.setState({ activeIndex: historialTab });
      } else {
        this.setState({ activeIndex: 0 });
      }

      this.setState({
        videos: [], video_history: [], photos: [], video_search: [], video_ssid: [],
        videosLoading: loading, historyLoading: loading, photosLoading: loading, searchLoading: false, isNewSearch: false,
        scroll: [], hasMore: true, scrollInitialDate: moment().startOf('date')
      });
    }

    let { QvrFileStationShareLink: listShare } = this.props.QvrFileStationShareLink;
    if (lastState && lastState.ptcl && listShare && listShare.ssid && listShare.ssid.length > 0) {
      let { ptcl, host, port, user, pass } = lastState;
      let url = `${ptcl}${host}${port ? `:${port}` : null}`;
      await this.props.getQvrFileStationAuthLogin({ url, user, pass });
      let { QvrFileStationAuth: auth } = this.props.QvrFileStationAuth;
      if (auth && auth.authSid) {
        for (const list of listShare.ssid) {
          let params = { url, sid: auth.authSid, file_total: list.total, ssid: list.ssid };
          await this.props.getQvrFileStationDeleteShareLink(params);
        }
      }
      await this.props.getQvrFileStationAuthLogout({ url });
    }
  };

  _loadMoreHistory = async (isFirst = false) => {
    let { scrollInitialDate, selectedCamera, video_history } = this.state;
    let currentHour = parseInt(moment().format('HH'), 10);
    let stateNames = { loading: 'historyLoading', list: 'video_history' };
    let foundHistory = [];

    let dateInFormat = scrollInitialDate.format('YYYY-MM-DD');
    if (isFirst) {
      this.setState({ historyLoading: true });
      let fileHour = await this._searchFileVideos([dateInFormat], 0, 24, stateNames, false, true);
      if (fileHour !== 0) this.setState({ hasMore: false });
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

    if (selectedCamera.id === this.state.selectedCamera.id) {
      if (foundHistory.length > 0) {
        foundHistory.reverse();
        foundHistory.forEach((d) => video_history.push(d));
        this.setState({ video_history });
      } else {
        this.setState({ hasMore: false });
      }
    }
  };

  _loadFiles = async (cam, destroyFiles = false, onlyCurrent = false, onlyHistory = false, onlyPhotos = false) => {
    let { selectedCamera } = this.state;
    let camera = cam && cam.id ? cam : selectedCamera;
    let tipoMBOX = camera.dataCamValue.tipombox

    if (destroyFiles) await this._destroyFileVideos(true, (onlyCurrent && onlyHistory && onlyPhotos), null, tipoMBOX);
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



        }
        catch (err) {
          this.setState({ video_history: [], historyLoading: false });
        }
      } else {
        this.setState({ video_history: [], historyLoading: false });
      }
      /* --- matches reales ---     
      conections.getCamMatches(this.state.markers[this.state.slideIndex].extraData.real_num_cam).then(response=>{
          if (response.status === 200) {
              this.setState({matches:response.data})
          }
      }) 
      */
    }

    // Current
    if (tipoMBOX && (onlyCurrent || onlyPhotos)) {
      this.setState({ videosLoading: true, photosLoading: true });
      try {
        let response = await conections.getCamDataV2(camera.id);
        if (camera.id === this.state.selectedCamera.id) {
          if (response.data) {
            this.setState({
              videos: response.data.data.files_multimedia.videos,
              photos: response.data.data.files_multimedia.photos,
              servidorMultimedia: 'http://' + response.data.data.dns_ip
            });
          }
          this.setState({ videosLoading: false, photosLoading: false });
        }
      } catch (err) {
        if (camera.id === this.state.selectedCamera.id) {
          this.setState({ videosLoading: false, photosLoading: false });
        }
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

  componentWillUnmount() {
    clearInterval(this.state.interval);
    this._destroyFileVideos();
    document.getElementById('scrollVideo').removeEventListener('scroll', this._infiniteScroll, false);
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

  _infiniteScroll = (event) => {
    let { activeIndex, video_history, qnapServer, qnapChannel, scroll, hasMore } = this.state;
    let divScroll = document.getElementById('scrollVideo');
    let isDown = divScroll.scrollHeight - divScroll.scrollTop <= divScroll.offsetHeight;
    if (
      activeIndex === 1 && video_history.length > 0 && isDown && qnapServer &&
      qnapChannel && !scroll.includes(divScroll.scrollHeight) && hasMore
    ) {
      scroll.push(divScroll.scrollHeight);
      this._loadMoreHistory();
    }

    if (activeIndex === 1 && video_history.length > 0 && isDown && hasMore) {
      setTimeout(() => {
        scroll.push(divScroll.scrollHeight);
        this.setState({ historyLoading: true });
        this._loadMoreVideosNotQnap();
      }, 1000);

    }
  };

  componentDidMount() {
    let markersForLoop = [];
    let playing = [];
    this.props.places.map((value) => {
      markersForLoop.push({ title: value.name, extraData: value });
      playing.push(true);
      return true;
    });
    this.setState({ isplaying: playing });
    const navHeight = document.getElementsByTagName('nav')[0].scrollHeight;
    // const viewBar = document.getElementsByClassName('toggleViewButton')[0].scrollHeight;
    const bottomBar = document.getElementsByClassName('camControl')[0].scrollHeight;
    const documentHeight = window.innerHeight;
    let map = document.getElementsByClassName('holderOfSlides')[0]; //.style.height = documentHeight - navHeight
    map.style.height = documentHeight - navHeight - bottomBar - /*viewBar*/ + 'px';
    let height = documentHeight - navHeight - bottomBar - /*viewBar*/ - 150;
    map.style.maxHeight = documentHeight - navHeight - bottomBar - /*viewBar*/ + 'px';
    let time = setInterval(this.changeSlide, 1000 * 10);
    let cameras = [];
    for (let item in responseJson.items) {
      let suspect = responseJson.items[item];
      //if(suspect.person_classification !== "Victim"){
      suspect.description = suspect.description.replace(/<p>/g, '').replace(/<\/p>/g, '');
      cameras.push(suspect);
      //}
    }

    /*  --- matches reales ---
this.setState({interval: time,markers:markersForLoop, height:height})
*/

    // --- matches planchados ---
    this.setState({ interval: time, markers: markersForLoop, height: height, matches: cameras });
    document.getElementById('scrollVideo').addEventListener('scroll', this._infiniteScroll, false);
  }

  changeSlide = async () => {
    let isp = {};
    if (this.state.isplaying.length === 0) {
      this.state.markers.map((value, index) => {
        isp[index] = true;
        return true;
      });
    } else {
      isp = this.state.isplaying;
    }
    this.setState({ videos: [], photos: [] });
    let si = this.state.slideIndex === this.state.markers.length - 1 ? 0 : this.state.slideIndex + 1;
    this.setState({ slideIndex: si, isplaying: isp, isplay: this.state.isplaying[si] === undefined ? true : this.state.isplaying[si] });
    await this._destroyFileVideos();
  };

  componentDidUpdate(prevProps) {
    // const navHeight = document.getElementsByTagName('nav')[0].scrollHeight;
    // const viewBar = document.getElementsByClassName('toggleViewButton')[0].scrollHeight;
    // const bottomBar = document.getElementsByClassName('camControl')[0].scrollHeight;
    // const documentHeight = window.innerHeight;
    // let map = document.getElementsByClassName('holderOfSlides')[0]; //.style.height = documentHeight - navHeight
    // map.style.height = documentHeight - navHeight - bottomBar - viewBar + 'px';
    // map.style.maxHeight = documentHeight - navHeight - bottomBar - viewBar + 'px';
    // let canvas = document.querySelector(
    //   '.holderOfSlides>div:not(.hiddenCameraNotshow)>.card>.card-body>.camHolder>canvas'
    // );
    // if (canvas) {
    //   if (this.state.autoplay) {
    //     canvas.style.height = '100%';
    //     canvas.style.width = '100%';
    //   } else {
    //     canvas.style.height = '95%';
    //     canvas.style.width = '80%';
    //   }
    // }

    const { update, changeUpdate } = this.props
    const { update: updatePrev } = prevProps;
    if (update !== updatePrev) {
      if (update) {
        this.setState({ loadingUpdate: true })
        changeUpdate(false)
        setTimeout(() => {
          this.setState({ loadingUpdate: false });
        }, 2500);
      }
    }
  }

  static getDerivedStateFromProps(props, state) {
    let markersForLoop = [];
    props.places.map((value, index) => {
      markersForLoop.push({ title: value.name, extraData: value });
      return true;
    });
    let aux = state;
    aux.markers = markersForLoop;
    return aux;
  }
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

export default connect(mapStateToProps, mapDispatchToProps)(LoopCamerasDisplay);
