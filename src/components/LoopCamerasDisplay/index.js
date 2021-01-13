import React, { Component } from 'react';
import { Button, Tab } from 'semantic-ui-react';
import { connect } from 'react-redux';

import Spinner from 'react-bootstrap/Spinner';
import moment from 'moment-timezone';

import Match from '../Match';
import conections from '../../conections';
import CameraStream from '../CameraStream';
import AdvancedSearch from '../AdvancedSearch';
import MediaContainer from '../MediaContainer';
import responseJson from '../../assets/json/suspects.json';

import * as QvrFileStationActions from '../../store/reducers/QvrFileStation/actions';
import * as QvrFunctions from '../../functions/getQvrFunctions';

import './style.css';

class LoopCamerasDisplay extends Component {
	state = {
		activeIndex: 0,
		markers: [],
		slideIndex: 0,
		autoplay: true,
		interval: null,
		isRecording: false,
		photos: [],
		videos: [],
		video_history: [],
		video_search: [],
		video_ssid: [],
		selectedCamera: {},
		qnapServer: null,
		qnapChannel: null,
		isplaying: [],
		matches: [],
		height: undefined,
		isplay: true,
		servidorMultimedia: '',
		loadingSnap: false,
		videosLoading: false,
		historyLoading: false,
		searchLoading: false,
		isNewSearch: false,
		recordingCams: [],
		recordingProcess: [],
		loadingRcord: false
	};

	_showCameraInfo() {
		this.props.toggleControlsBottom();
	}

	render() {
		let { activeIndex, markers, slideIndex, autoplay, photos, videos, video_history, video_search, selectedCamera, qnapServer, qnapChannel, height, servidorMultimedia, loadingSnap, videosLoading, historyLoading, searchLoading, photosLoading, isNewSearch, recordingCams, restarting } = this.state
		let { error, propsIniciales, moduleActions, loadingFiles, matches } = this.props
		return (
			<div className="holderOfSlides">
				{error ? (<div className="errorContainer">Error al cargar informacion: {JSON.stringify(error)}</div>) : null}
				{height ? (
					markers.map((value, index) =>
						index === slideIndex ? (
							<div key={value.extraData.id} style={{ height: '100%', width: '100%', paddign: '50%' }} align="center" className={index === slideIndex ? '' : 'hiddenCameraNotshow'}>
								<CameraStream
									propsIniciales={propsIniciales}
									ref={'camstreamloopref' + value.extraData.id}
									marker={value}
									height={'100%'}
									width={'75%'}
								/>
							</div>
						) : null
					)
				) : null}
				<div className={!autoplay ? 'camControl showfiles' : 'camControl'}>
					{markers[slideIndex] ? (
						<div className="row stiky-top">
							<div className="col-8">
								{moduleActions?moduleActions.btnsnap?<Button basic circular disabled={photos.length>=5||restarting||loadingSnap||loadingFiles||recordingCams.indexOf(markers[slideIndex].extraData)>-1} loading={loadingSnap} onClick={() => this._snapShot(markers[slideIndex].extraData)}><i className='fa fa-camera'></i></Button>:null:null}
								{/* <Button basic circular disabled={restarting||loadingSnap||loadingFiles||recordingCams.indexOf(markers[slideIndex].extraData)>-1} onClick={this._playPause}><i className={isplay?'fa fa-pause':'fa fa-play'}></i></Button> */}
								{moduleActions?moduleActions.btnrecord?<Button basic circular disabled={videos.length>=5||restarting||loadingSnap||loadingFiles} onClick={() => this._recordignToggle(markers[slideIndex].extraData)}><i className={ recordingCams.indexOf(markers[slideIndex].extraData)>-1?'fa fa-stop-circle recording':'fa fa-stop-circle'} style={{color:'red'}}></i></Button>:null:null}
								<Button basic circular disabled={restarting||loadingSnap||loadingFiles||recordingCams.indexOf(markers[slideIndex].extraData)>-1} onClick={() =>	window.open(window.location.href.replace(window.location.pathname, '/') + 'analisis/' + markers[slideIndex].extraData.id, '_blank', 'toolbar=0,location=0,directories=0,status=1,menubar=0,titlebar=0,scrollbars=1,resizable=1')}><i className="fa fa-external-link"></i></Button>
								<Button basic circular disabled={restarting||loadingSnap||loadingFiles||recordingCams.indexOf(markers[slideIndex].extraData)>-1||videosLoading||photosLoading||photos.length<=0||videos.length<=0} onClick={() => this.props.downloadFiles(markers[slideIndex].extraData, { videos, photos, servidorMultimedia })} loading={loadingFiles}><i className="fa fa-download"></i></Button>
								<Button basic circular disabled={restarting||loadingSnap||loadingFiles||recordingCams.indexOf(markers[slideIndex].extraData)>-1} onClick={() => this.props.makeReport(markers[slideIndex].extraData)}><i className="fa fa-warning"></i></Button>
								{/* <Button basic circular disabled={restarting||loadingSnap||loadingFiles||recordingCams.indexOf(markers[slideIndex].extraData)>-1} onClick={this._restartCamStream}><i className={!restarting?"fa fa-repeat":"fa fa-repeat fa-spin"}></i></Button> */}
								<Button basic circular onClick={() => this.props.changeStatus(markers[slideIndex].extraData)}><i className="fa fa-exchange"></i></Button>
							</div>
							<div className="col-4">
								<Button onClick={() => this._openCameraInfo(markers[slideIndex])} className='pull-right' primary><i className={ autoplay?'fa fa-square':'fa fa-play'}></i> { autoplay?'Parar loop':'Continuar loop'} <i className={ autoplay?'fa fa-chevron-up':'fa fa-chevron-down'}></i></Button>
							</div>
						</div>
					) : null}
					<div className={!autoplay ? 'row showfilesinfocamera' : 'row hidefiles'}>
						<div className="col snapshots">
							Fotos
							<div>
								{photosLoading ? (
									<Spinner animation="border" variant="info" role="status" size="xl">
										<span className="sr-only">Loading...</span>
									</Spinner>
								) : photos.length > 0 ? (
									<div className="row">
										{photos.map((value, index) => (
											<MediaContainer
												key={index}
												value={value}
												exists_image={true}
												cam={selectedCamera}
												src={value.relative_url}
												reloadData={this._loadFiles}
												isQnap={qnapServer && qnapChannel}
												servidorMultimedia={servidorMultimedia}
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
						<div className="col videos">
							Videos
							<Tab
								align="center"
								activeIndex={activeIndex}
								onTabChange = {(e, { activeIndex }) => this.setState({ activeIndex })}
								menu={{ secondary: true, pointing: true }}
								panes={[
									{
										menuItem: 'Actuales',
										render: () => (
											<Tab.Pane attached={false}>
												{this._renderVideoList(videosLoading, videos)}
											</Tab.Pane>
										)
									},
									moduleActions && moduleActions.viewHistorial && {
										menuItem: 'Historico',
										render: () => (
											<Tab.Pane attached={false}>
												{this._renderVideoList(
													historyLoading,
													video_history[1] && video_history[1].length > 0 ? video_history[1] : video_history,
													true,
													video_history[1] && video_history[1].length > 0 ? video_history[0] : null
												)}
											</Tab.Pane>
										)
									},
									qnapServer && qnapChannel && {
										menuItem: 'Busqueda Avanzada',
										render: () => (
											<Tab.Pane attached={false}>
												<AdvancedSearch
													loading={searchLoading || videosLoading || historyLoading}
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
							Historial
							{/* --- matches reales ---
							{matches.length>0?matches.map((value, index)=><Match key={index} info={value} toggleControls={this._closeControl} />):<h4>Sin historial de matches</h4>} 
							*/}
							{/* --- matches planchados */}
							{matches ? (
								matches.map((value, index) => (
									<Match key={index} info={value} toggleControls={this._closeControl} />
								))
							) : null}
						</div>
					</div>
				</div>
			</div>
		);
	}

	_renderVideoList = (loading, videoList, showNoFiles = true, hasDns = null) => {
		let { selectedCamera, qnapServer, qnapChannel, servidorMultimedia } = this.state;
		return loading ? (
			<Spinner animation="border" variant="info" role="status" size="xl">
				<span className="sr-only">Loading...</span>
			</Spinner>
		) : videoList && videoList.length > 0 ? (
			videoList.map((list, idx) => (
				<div key={idx} className="row">
					{hasDns || (list.fecha && list.hour) ? (
						<div className="col-12">
							<h4>{`${hasDns !== null ? list.videos[0].fecha : list.fecha} - ${hasDns !== null ? list.videos[0].hour : list.hour}`}</h4>
						</div>
					) : null}
					{list.videos ? (
						list.videos.map((video, vidx) => (
							<MediaContainer
								key={vidx}
								value={video}
								dns_ip={hasDns && `http://${hasDns}`}
								exists_video={true}
								cam={selectedCamera}
								src={video.path_video ? video.path_video : video.relative_path_video}
								reloadData={this._loadFiles}
								real_hour={video.real_hour}
								isQnap={qnapServer && qnapChannel}
								servidorMultimedia={servidorMultimedia}
							/>
						))
					) : (
						<MediaContainer
							value={list}
							dns_ip={hasDns && `http://${hasDns}`}
							exists_video={true}
							cam={selectedCamera}
							src={list.relative_url}
							reloadData={this._loadFiles}
							// real_hour={video.real_hour}
							isQnap={false}
							servidorMultimedia={servidorMultimedia}
						/>
					)}
				</div>
			))
		) : showNoFiles ? (
			<div align="center">
				<p className="big-letter">No hay archivos que mostrar</p>
				<i className="fa fa-image fa-5x" />
			</div>
		) : null;
	};

	_snapShot = async (camera) => {
		this.setState({ loadingSnap: true });
		let response = await conections.snapShotV2(camera.id);
		const data = response.data;
		if (data.success) this._loadFiles(camera, false, false, false, true);
		this.setState({ loadingSnap: false });
	};

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

	_openCameraInfo = async (marker) => {
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
				await this._destroyFileVideos();
				this.setState({ autoplay: true, interval: time, selectedCamera: {}, qnapServer: null, qnapChannel: null });
			}
		}
	};

	_searchFileVideos = async (dates, startHour, endHour, stateNames, dir = 'ASC') => {
		let { selectedCamera, video_ssid, qnapServer, qnapChannel } = this.state;
		let isNewSearch = stateNames.list === 'video_search';
		this.setState({ [stateNames.loading]: true });

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
				let getParamsHours = { url, sid: auth.authSid, path: `${mainPath}/${dt}`, limit: lthDate === dates.length ? parseInt(endHour, 10) : '24', start: lthDate === 1 ? parseInt(startHour, 10) : '0', type: '0', dir };
				await this.props.getQvrFileStationFileList(getParamsHours);
				let { QvrFileStationFileList: listHours, success: sHours } = this.props.QvrFileStationFileList;

				if (sHours && listHours && listHours.total > 0) {
					for (const hr of listHours.datas) {
						if (parseInt(hr.filename, 10) < parseInt(endHour, 10)) {
							let getParamsVideo = { url, sid: auth.authSid, path: `${mainPath}/${dt}/${hr.filename}`, limit: '2', start: '0', type: '2' };
							await this.props.getQvrFileStationFileList(getParamsVideo);
							let { QvrFileStationFileList: listVideos, success: sVideos } = this.props.QvrFileStationFileList;
							if (sVideos && listVideos && listVideos.total > 0)  for (const v of listVideos.datas) allVideosList.push(`${dt}/${hr.filename}/${v.filename}`);
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
				searchVideos = QvrFunctions._getCleanListVideos(listShare.links);

				if (listShare && listShare.ssid) video_ssid.push({ ssid: listShare.ssid, total: listShare.total });
				this.props.QvrFileStationShareLink.QvrFileStationShareLink.ssid = video_ssid;
			}
			await this.props.getQvrFileStationAuthLogout({ url });
		}
		if (selectedCamera.id === this.state.selectedCamera.id) {
			this.setState({ [stateNames.loading]: false, [stateNames.list]: searchVideos, isNewSearch, video_ssid });
			return searchVideos;
		}
	};

	_destroyFileVideos = async (loading = false, setNewState = true, lastState = this.state.qnapServer) => {
		if (setNewState) {
			this.setState({
				activeIndex: 0, videos: [], video_history: [], photos: [], video_search: [], video_ssid: [],
				videosLoading: loading, historyLoading: loading, photosLoading: loading, searchLoading: false, isNewSearch: false
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

	_loadFiles = async (cam, destroyFiles = false, onlyCurrent = false, onlyHistory = false, onlyPhotos = false) => {
		if (destroyFiles) await this._destroyFileVideos(true, (onlyCurrent && onlyHistory && onlyPhotos));
		let { selectedCamera } = this.state;
		let camera = cam && cam.id ? cam : selectedCamera;

		if (onlyCurrent || onlyPhotos) {
			this.setState({ videosLoading: true, photosLoading: true });
			conections.getCamDataV2(camera.id)
				.then((response) => {
					this.setState({
						videos: response.data.data.files_multimedia.videos,
						photos: response.data.data.files_multimedia.photos,
						servidorMultimedia: 'http://' + response.data.data.dns_ip,
						videosLoading: false,
						photosLoading: false
					});
				})
				.catch((err) => {
					this.setState({ videosLoading: false, photosLoading: false });
				});
		}

		// History
		if (camera.dataCamValue && camera.dataCamValue.qnap_server_id && camera.dataCamValue.qnap_channel) {
			if (onlyHistory) {
				let stateNames = { loading: 'historyLoading', list: 'video_history' };
				let currentDate = moment().startOf('date').format('YYYY-MM-DD');
				this._searchFileVideos([ currentDate ], '00', '24', stateNames, 'DESC');
			}
		} else {
			if (onlyHistory) {
				this.setState({ historyLoading: true });
				conections.getCamDataHistory(camera.id)
					.then((response) => {
						let resHistory = response.data;
						if (resHistory.success) {
							let items = [];
							resHistory.data.items = resHistory.data.items.map((val) => {
								val.fecha = moment(val.RecordProccessVideo.datetime_start).format('HH:mm');
								let fecha_inicio = moment(val.RecordProccessVideo.datetime_start);
								if (items.length === 0) {
									items.push({ dateTime: val.RecordProccessVideo.datetime_start, videos: [ val ] });
								} else {
									let found = false;
									for (let index = 0; index < items.length; index++) {
										let fecha_array = moment(items[index].dateTime);
										if (fecha_array.isSame(fecha_inicio, 'hour')) {
											found = true;
											items[index].videos.push(val);
											break;
										}
									}
									if (!found) items.push({ dateTime: val.RecordProccessVideo.datetime_start, videos: [ val ] });
								}
								return val;
							});
							items.map((val) => {
								val.fecha = moment(val.dateTime).format('YYYY-MM-DD HH:mm');
								return val;
							});
							resHistory.data.items = items;
							this.setState({ video_history: resHistory.data, historyLoading: false });
						}
					});
			}
			/* --- matches reales ---     
			conections.getCamMatches(this.state.markers[this.state.slideIndex].extraData.real_num_cam).then(response=>{
					if (response.status === 200) {
							this.setState({matches:response.data})
					}
			}) 
			*/
		}
	};

	async componentWillUnmount() {
		clearInterval(this.state.interval);
		await this._destroyFileVideos();
	}

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
		const viewBar = document.getElementsByClassName('toggleViewButton')[0].scrollHeight;
		const bottomBar = document.getElementsByClassName('camControl')[0].scrollHeight;
		const documentHeight = window.innerHeight;
		let map = document.getElementsByClassName('holderOfSlides')[0]; //.style.height = documentHeight - navHeight
		map.style.height = documentHeight - navHeight - bottomBar - viewBar + 'px';
		let height = documentHeight - navHeight - bottomBar - viewBar - 150;
		map.style.maxHeight = documentHeight - navHeight - bottomBar - viewBar + 'px';
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

	componentDidUpdate() {
		const navHeight = document.getElementsByTagName('nav')[0].scrollHeight;
		const viewBar = document.getElementsByClassName('toggleViewButton')[0].scrollHeight;
		const bottomBar = document.getElementsByClassName('camControl')[0].scrollHeight;
		const documentHeight = window.innerHeight;
		let map = document.getElementsByClassName('holderOfSlides')[0]; //.style.height = documentHeight - navHeight
		map.style.height = documentHeight - navHeight - bottomBar - viewBar + 'px';
		map.style.maxHeight = documentHeight - navHeight - bottomBar - viewBar + 'px';
		let canvas = document.querySelector(
			'.holderOfSlides>div:not(.hiddenCameraNotshow)>.card>.card-body>.camHolder>canvas'
		);
		if (canvas) {
			if (this.state.autoplay) {
				canvas.style.height = '100%';
				canvas.style.width = '100%';
			} else {
				canvas.style.height = '95%';
				canvas.style.width = '80%';
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
