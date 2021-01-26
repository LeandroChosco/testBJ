import React, { Component } from 'react';
import { Button, Select, Tab } from 'semantic-ui-react';
import { Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import { DateTime } from 'luxon';

import Spinner from 'react-bootstrap/Spinner';
import ReactPaginate from 'react-paginate';
import moment from 'moment-timezone';

import Match from '../Match';
import ControlPTZ from '../ControlPTZ';
import conections from '../../conections';
import CameraStream from '../CameraStream';
import AdvancedSearch from '../AdvancedSearch';
import MediaContainer from '../MediaContainer';
import responseJson from '../../assets/json/suspects.json';

import * as QvrFileStationActions from '../../store/reducers/QvrFileStation/actions';
import * as QvrFunctions from '../../functions/getQvrFunctions';

import './style.css';

const SHOW_HISTORY = 3;
const countryOptions = [
	{ key: 5, text: 5, value: 5 },
	{ key: 10, text: 10, value: 10 },
	{ key: 15, text: 15, value: 15 },
	{ key: 20, text: 20, value: 20 },
	{ key: 25, text: 25, value: 25 },
	{ key: 30, text: 30, value: 30 },
	{ key: 50, text: 50, value: 50 }
];
class GridCameraDisplay extends Component {
	state = {
		scroll: [],
		hasMore: true,
		scrollInitialDate: moment().startOf('date'),
		activeIndex: 0,
		markers: [],
		height: 'auto',
		fullHeight: 10,
		isplaying: [],
		slideIndex: 0,
		matches: [],
		photos: [],
		videos: [],
		video_history: [],
		video_search: [],
		video_ssid: [],
		autoplay: true,
		selectedCamera: {},
		qnapServer: null,
		qnapChannel: null,
		isRecording: false,
		recordingCams: [],
		recordingProcess: [],
		loadingRcord: false,
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
		showPTZ: false
	};

	render() {
		let { activeIndex, markers, start, limit, selectedCamera, qnapServer, qnapChannel, pageCount, autoplay, photos, loadingSnap, loadingRcord, restarting, recordingCams, videos, servidorMultimedia, photosLoading, videosLoading, historyLoading, video_history, searchLoading, isNewSearch, video_search, showPTZ } = this.state;
		let { propsIniciales, loading, showMatches, error, moduleActions, loadingFiles, matches } = this.props;
		return (
			<div className="gridCameraContainer" align="center">
				<Row>
					{markers.map((value, index) =>
						index < start + limit && index >= start ? (
							<Col className={selectedCamera === value.extraData ? ('p-l-0 p-r-0 activeselectedcameragrid camcolgridholder') : ('p-l-0 p-r-0 camcolgridholder')} lg={4} sm={6} key={value.extraData.id} onClick={() => this._openCameraInfo(value, index)} marker={value.id}>
								<CameraStream
									propsIniciales={propsIniciales}
									ref={'camrefgrid' + value.extraData.id}
									key={value.extraData.id}
									marker={value}
								/>
							</Col>
						) : null
					)}
				</Row>
				{loading ? null : (
					<Row className={!showMatches ? ('hide-matches paginatorContainerOnGrid2') : ('show-matches paginatorContainerOnGrid')}>
						<Col style={{ height: '100%' }}>
							Camaras por pagina{' '}
							<Select
								placeholder="Camaras por pagina"
								options={countryOptions}
								value={limit}
								onChange={(e, value) => {
									const pageCount = Math.ceil(markers.length / value.value);
									this.setState({ start: 0, limit: value.value, pageCount: pageCount });
								}}
							/>
						</Col>
						<Col>
							<ReactPaginate
								previousLabel={'Anterior'}
								nextLabel={'Siguiente'}
								breakLabel={'...'}
								pageCount={pageCount}
								marginPagesDisplayed={2}
								pageRangeDisplayed={5}
								onPageChange={this.handlePageClick}
								containerClassName={'pagination'}
								subContainerClassName={'pages pagination'}
								activeClassName={'active'}
							/>
						</Col>
					</Row>
				)}
				{error && markers.length === 0 ? (
					<div className="errorContainer">
						Error al cargar informacion: {JSON.stringify(error)}
					</div>
				) : null}
				<div className={!autoplay ? !showMatches ? ('sin-margin camGridControl showfiles') : ('con-margin camGridControl showfiles') : !showMatches ? ('sin-margin camGridControl') : ('con-margin camGridControl')}>
					{/* <div className={!showMatches ? "hide-matches" : "show-matches"}> */}
					<div className="row stiky-top">
						<div className="col-4">
							{moduleActions && moduleActions.btnsnap && (<Button basic circular disabled={ photos.length>=5||loadingSnap||loadingRcord||loadingFiles||restarting||recordingCams.indexOf(selectedCamera) > -1 } loading={loadingSnap} onClick={() => this._snapShot(selectedCamera)}><i className="fa fa-camera"/></Button>)}
							{/* <Button basic disabled={loadingSnap||loadingRcord||loadingFiles||restarting||recordingCams.indexOf(selectedCamera)>-1} circular onClick={this._playPause}><i className={isplay?'fa fa-pause':'fa fa-play'}/></Button> */}
							{moduleActions && moduleActions.btnrecord && (<Button basic circular disabled={videos.length>=5||loadingSnap||loadingRcord||loadingFiles||restarting} loading={loadingRcord} onClick={() => this._recordignToggle(selectedCamera)}><i className={recordingCams.indexOf(selectedCamera) > -1 ? 'fa fa-stop-circle recording' : 'fa fa-stop-circle'} style={{ color: 'red' }}/></Button>)}
							<Button basic disabled={loadingSnap||loadingRcord||loadingFiles||restarting||recordingCams.indexOf(selectedCamera)>-1} circular onClick={() =>	window.open(window.location.href.replace(window.location.pathname, '/') + 'analisis/' + selectedCamera.id, '_blank', 'toolbar=0,location=0,directories=0,status=1,menubar=0,titlebar=0,scrollbars=1,resizable=1')}><i className="fa fa-external-link"/></Button>
							<Button	basic	disabled={loadingSnap||loadingRcord||loadingFiles||restarting||recordingCams.indexOf(selectedCamera)>-1||videosLoading||photosLoading||(photos.length<=0&&videos.length<=0)} circular	onClick={() => this.props.downloadFiles(selectedCamera, { videos, photos, servidorMultimedia })}	loading={loadingFiles}><i className="fa fa-download"/></Button>
							<Button basic disabled={loadingSnap||loadingRcord||loadingFiles||restarting||recordingCams.indexOf(selectedCamera)>-1} circular onClick={() => this.props.makeReport(selectedCamera)}><i className="fa fa-warning"/></Button>
							{/* <Button basic circular disabled={loadingSnap||loadingRcord||loadingFiles||restarting||recordingCams.indexOf(selectedCamera)>-1} onClick={this._restartCamStream}><i className={!restarting?"fa fa-repeat":"fa fa-repeat fa-spin"}/></Button> */}
							<Button basic circular onClick={() => this.props.changeStatus(selectedCamera)}><i className="fa fa-exchange"/></Button>
							{/* {selectedCamera.dataCamValue && selectedCamera.dataCamValue.tipo_camara === 2 && selectedCamera.dataCamValue.dns != null ? <Button basic circular onClick={() => this.setState({ showPTZ: !showPTZ })}><i className="fa fa-sliders"/></Button> : null} */}
							<Button basic circular onClick={() => this.setState({ showPTZ: !showPTZ })}><i className="fa fa-sliders"/></Button>
						</div>
						<div className='col-5'>
								<b>Camara</b> {selectedCamera.name}
						</div>
						<div className='col-3'>
								<Button onClick={() => this._openCameraInfo(false)} className='pull-right' primary> { autoplay?'':'Ocultar controles'} <i className={ autoplay?'fa fa-chevron-up':'fa fa-chevron-down'}/></Button>
						</div>
					</div>
					<div className={!autoplay ? 'row showfilesinfocameragrid' : 'row hidefiles'}>
						{showPTZ && 
							<div className="col ptzgrid">
								Controles
								<ControlPTZ
									camera={selectedCamera}
									isInMap={false}
									hasMatch={true}
								/>
							</div>
						}
						<div className="col snapshotsgrid">
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
												isQnap={false}
												exists_image={true}
												cam={selectedCamera}
												src={value.relative_url}
												reloadData={this._loadFiles}
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
						<div id="scrollVideo" className="col videosgrid">
							Videos
							<Tab
								align="center"
								activeIndex={activeIndex}
								onTabChange = {(e, { activeIndex }) => this.setState({ activeIndex })}
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
									moduleActions && moduleActions.viewHistorial && {
										menuItem: 'Ultimas 24 Horas',
										render: () => (
											<Tab.Pane attached={false}>
												{this._renderVideoList(
													historyLoading,
													video_history[1] && video_history[1].length > 0 ? video_history[1] : video_history,
													true,
													video_history[1] && video_history[1].length > 0 ? video_history[0] : null,
													true
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
						<div className="col matchesgrid" align="center">
							Historial
							{/*  ---matches reales---
								{
										matches.length > 0 ? 
										(matches.map((value, index) => {
										return <Match key={index} info={value} toggleControls={this._closeControl} />;
										})) : (<h4>Sin historial de matches</h4>);
								} */
							}
							{/* ---matches planchados */}
							{matches ? (
								matches.map((value, index) => {
									if (index % selectedCamera.num_cam !== 0) return null;
									return <Match key={index} info={value} toggleControls={this._closeControl} />;
								})
							) : null}
						</div>
					</div>
				</div>
			</div>
		);
	}

	_renderLoading = () => (
		<Spinner animation="border" variant="info" role="status" size="xl">
			<span className="sr-only">Loading...</span>
		</Spinner>
	);

	_renderVideoList = (loading, videoList, showNoFiles = true, hasDns = null, isHistory = false) => {
		let { hasMore, selectedCamera, qnapServer, qnapChannel, servidorMultimedia } = this.state;
		return loading ? (
			this._renderLoading()
		) : videoList && videoList.length > 0 ? videoList[0].videos && videoList[0].videos.length > 0 ? (
			<div>
				{videoList.map((list, idx) => (
					<div key={idx} className="row">
						{hasDns || (list.fecha && list.hour) ? (
							<div className="col-12">
								<h4>{`${hasDns !== null ? list.videos[0].fecha : list.fecha} - ${hasDns !== null ? list.videos[0].hour : list.hour}`}</h4>
							</div>
						) : null}
						{list.videos.map((video, vidx) => (
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
						src={list.relative_url}
						reloadData={this._loadFiles}
						servidorMultimedia={servidorMultimedia}
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
						this.setState({
							recordingCams: stateRecordingCams,
							recordingProcess: stateRecordingProcess,
							isRecording: false,
							loadingRcord: false
						});
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

	_playPause = () => {
		let isplaying = this.state.isplaying;
		isplaying[this.state.slideIndex] = !isplaying[this.state.slideIndex];
		this.setState({ isplaying: isplaying, isplay: isplaying[this.state.slideIndex] });
		this.refs['camrefgrid' + this.state.selectedCamera.id]._togglePlayPause();
	};

	// _refreshComponent = () => {
	// 	this.setState({ loading: true });
	// 	setTimeout(() => this.spinnerif(), 2500);
	// };

	_restartCamStream = async () => {
		this.setState({ restarting: true });
		await this.refs['camrefgrid' + this.state.selectedCamera.id]._restartCamStream();
		this.setState({ restarting: false });
	};

	handlePageClick = (data) => {
		this.setState({ start: data.selected * this.state.limit });
	};

	_searchFileVideos = async (dates, startHour, endHour, stateNames, setNewState = true) => {
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
				let getParamsHours = { url, sid: auth.authSid, path: `${mainPath}/${dt}`, limit: lthDate === dates.length ? parseInt(endHour, 10) : '24', start: lthDate === 1 ? parseInt(startHour, 10) : '0', type: '0' };
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
			if (setNewState) this.setState({ [stateNames.loading]: false, [stateNames.list]: searchVideos });
			this.setState({ isNewSearch, video_ssid });
			return searchVideos;
		}
	};

	_destroyFileVideos = async (loading = false, setNewState = true, lastState = this.state.qnapServer) => {
		if (setNewState) {
			this.setState({
				activeIndex: 0, videos: [], video_history: [], photos: [], video_search: [], video_ssid: [],
				videosLoading: loading, historyLoading: loading, photosLoading: loading, searchLoading: false, isNewSearch: false,
				scroll: [], hasMore: true, scrollInitialDate: moment().startOf('date'), showPTZ: false
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
			foundHistory = await this._searchFileVideos([ dateInFormat ], currentHour - SHOW_HISTORY, currentHour, stateNames, false);
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
				foundHistory = await this._searchFileVideos([ dateInFormat ], hourStart <= 0 ? 0 : hourStart, hourEnd, stateNames, false);
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
		if (destroyFiles) await this._destroyFileVideos(true, (onlyCurrent && onlyHistory && onlyPhotos));
		let { selectedCamera } = this.state;
		let camera = cam && cam.id ? cam : selectedCamera;

		// History
		if (camera.dataCamValue && camera.dataCamValue.qnap_server_id && camera.dataCamValue.qnap_channel) {
			if (onlyHistory) this._loadMoreHistory(true);
		} else {
			if (onlyHistory) {
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
	
				conections.getCamDataHistory(camera.dataCamValue.id, camera.dataCamValue.num_cam)
					.then((response) => {
						let resHistory = response.data;
						if (resHistory.data.items.length > 0) {
							let dns_ip = resHistory.data.dns_ip;
							if (resHistory.success) {
								let dates = createArrDate(resHistory.data.items);
								let hours_last_day = createArrHour(dates[last_day].videos);
								let hours_current_day = createArrHour(dates[current_day].videos);
								this.setState({ video_history: [ dns_ip, Object.values(hours_last_day).reverse().concat(Object.values(hours_current_day).reverse()).reverse() ], historyLoading: false });
								setTimeout(() => this.spinnerif(), 400);
							} else {
								this.setState({ video_history: null, historyLoading: false });
								this.spinnerif();
							}
						} else {
							this.setState({ video_history: null, historyLoading: false });
							this.spinnerif();
						}
					});
			}
		}

		// Current
		if (onlyCurrent || onlyPhotos) {
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
			} catch(err) {
				if (camera.id === this.state.selectedCamera.id) {
					this.setState({ videosLoading: false, photosLoading: false });
				}
			}
		}
	};

	_openCameraInfo = (marker) => {
		this.setState({ loading: true });
		setTimeout(() => {
			this.spinnerif();
		}, 2500);

		if (marker) {
			let index = this.state.markers.indexOf(marker);
			let recording = false;
			if (this.state.recordingCams.indexOf(marker.extraData) > -1) {
				recording = true;
			}
			if (this.state.isplaying.length === 0) {
				let isp = {};
				this.state.markers.map((value, index) => {
					isp[index] = true;
					return true;
				});
				this.setState({ isplaying: isp });
			}
			/*  --- matches reales ---  
                this.setState({ matches:[],selectedCamera: marker.extraData, autoplay:false, slideIndex: index, isRecording: recording,isplay:this.state.isplaying[this.state.slideIndex]===undefined?true:this.state.isplaying[this.state.slideIndex]})
                this._loadFiles(marker.extraData)
            } else {
                this.setState({selectedCamera: {}, autoplay:true, videos:[],photos:[], video_history:[], matches:[]})
            }             
            */

			// --- matches forzados
			this.setState({
				selectedCamera: marker.extraData,
				qnapServer: marker.extraData.dataCamValue.qnap_server_id,
				qnapChannel: marker.extraData.dataCamValue.qnap_channel,
				autoplay: false,
				slideIndex: index,
				isRecording: recording,
				isplay: this.state.isplaying[this.state.slideIndex] === undefined ? true : this.state.isplaying[this.state.slideIndex]
			});
			this._loadFiles(marker.extraData, true, true, true, true);
		} else {
			this._destroyFileVideos(true, true, this.state.qnapServer);
			this.setState({ autoplay: true, selectedCamera: {}, qnapServer: null, qnapChannel: null });
		}
	};

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
	};

	componentDidMount() {
		let markersForLoop = [];
		this.props.places.map((value) => {
			markersForLoop.push({
				title: value.name,
				extraData: value
			});
			return true;
		});

		/* --- matches reales---
        const pageCount = Math.ceil(markersForLoop.length /this.state.limit)        
        this.setState({markers:markersForLoop,pageCount:pageCount})
        */

		// --- matches forzados ---
		let cameras = [];
		for (let item in responseJson.items) {
			let suspect = responseJson.items[item];
			//if(suspect.person_classification !== "Victim"){
			suspect.description = suspect.description.replace(/<p>/g, '').replace(/<\/p>/g, '');
			cameras.push(suspect);
			//}
		}
		const pageCount = Math.ceil(cameras.length / this.state.limit);
		this.setState({ markers: markersForLoop, matches: cameras, pageCount: pageCount });
		document.getElementById('scrollVideo').addEventListener('scroll', this._infiniteScroll, false);
	}

	componentWillUnmount() {
		this._destroyFileVideos();
		document.getElementById('scrollVideo').removeEventListener('scroll', this._infiniteScroll, false);
	}

	static getDerivedStateFromProps(props, state) {
		let markersForLoop = [];
		props.places.map((value, index) => {
			markersForLoop.push({ title: value.name, extraData: value });
			return true;
		});
		let aux = state;
		const pageCount = Math.ceil(markersForLoop.length / state.limit);
		aux.markers = markersForLoop;
		aux.pageCount = pageCount;
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

export default connect(mapStateToProps, mapDispatchToProps)(GridCameraDisplay);
