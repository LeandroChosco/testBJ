import React, { Component } from 'react';
import { Button, Radio, Select, Tab } from 'semantic-ui-react';
import { Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import { DateTime } from 'luxon';
import Spinner from 'react-bootstrap/Spinner';
import ReactPaginate from 'react-paginate';
import moment from 'moment-timezone';
import 'moment/locale/es';
import PaginationList from './pagination'
import NotificationSystem from 'react-notification-system';

// import Match from '../Match';
import ControlPTZ from '../ControlPTZ';
import conections from '../../conections';
import CameraStream from '../CameraStream';
import AdvancedSearch from '../AdvancedSearch';
import AdvancedSearchNotqnap from '../AdvancedSearchNotqnap'
import MediaContainer from '../MediaContainer';
import responseJson from '../../assets/json/suspects.json';
import Strings from '../../constants/strings';
import axios from "axios"
import * as QvrFileStationActions from '../../store/reducers/QvrFileStation/actions';
import * as QvrFunctions from '../../functions/getQvrFunctions';

import './style.css';
import Placas from './placas';
import { CurveGridCamera } from '../Dashboard/Placas/CurveGridCamera';
import { VehiclesCount } from './VehiclesCount';
import VehiclesSelector from './VehiclesSelector';
import { removeSpaces } from '../../functions/removeSpaces';

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
	notificationSystem = React.createRef();
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
		video_fistHistory: [],
		video_loadMoreHistory: [],
		video_advancedSearch: [],
		typeMBOX: null,
		protocolDownload: null,
		countDays: null,
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
		autoplay: true,
		completeCamera: null,
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
		showPTZ: false,
		historyServerPort: null,
		historyServerDns: null,
		historyServerProtocol: null,
		filterCount: "",
		arrayWeek: [],
		arrayHistoricsByHour: [],
		historicCurrentDay: 0,
		loadingHistorics: false,
		historicalUser: null,
		historicalPassword: null,
	};

	render() {
		let { activeIndex, markers, start, limit, selectedCamera, qnapServer, qnapChannel, pageCount, autoplay, photos, loadingSnap, loadingRcord, restarting, recordingCams, videos, servidorMultimedia, photosLoading, videosLoading, historyLoading, video_history, searchLoading, isNewSearch, video_search, showPTZ, arrPares, inputCkecked, moduleSearch, portContainer, dnsContainer, countDays, filterCount, typeMBOX } = this.state;
		let { propsIniciales, loading, showMatches, error, moduleActions, loadingFiles, is_filter } = this.props;

		return (
			<div className="gridCameraContainer" align="center">
				<NotificationSystem ref={this.notificationSystem} />
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
				{is_filter && markers.length === 0 ? (
					<div align="center">
						{Strings.noResults}
					</div>
				) : null}
				<div className={!autoplay ? !showMatches ? ('sin-margin camGridControl showfiles') : ('con-margin camGridControl showfiles') : !showMatches ? ('sin-margin camGridControl') : ('con-margin camGridControl')}>
					{/* <div className={!showMatches ? "hide-matches" : "show-matches"}> */}
					<div className="row stiky-top">
						<div className="col-4">
							{moduleActions && moduleActions.btnsnap && (<Button basic circular disabled={photos.length >= 5 || loadingSnap || loadingRcord || loadingFiles || restarting || recordingCams.indexOf(selectedCamera) > -1} loading={loadingSnap} onClick={() => this._snapShot(selectedCamera)}><i className="fa fa-camera" /></Button>)}
							{/* <Button basic disabled={loadingSnap||loadingRcord||loadingFiles||restarting||recordingCams.indexOf(selectedCamera)>-1} circular onClick={this._playPause}><i className={isplay?'fa fa-pause':'fa fa-play'}/></Button> */}
							{moduleActions && moduleActions.btnrecord && (<Button basic circular disabled={videos.length >= 5 || loadingSnap || loadingRcord || loadingFiles || restarting} loading={loadingRcord} onClick={() => this._recordignToggle(selectedCamera)}><i className={recordingCams.indexOf(selectedCamera) > -1 ? 'fa fa-stop-circle recording' : 'fa fa-stop-circle'} style={{ color: 'red' }} /></Button>)}
							<Button basic disabled={loadingSnap || loadingRcord || loadingFiles || restarting || recordingCams.indexOf(selectedCamera) > -1} circular onClick={() => window.open(window.location.href.replace(window.location.pathname, '/') + 'analisis/' + selectedCamera.id, '_blank', 'toolbar=0,location=0,directories=0,status=1,menubar=0,titlebar=0,scrollbars=1,resizable=1')}><i className="fa fa-external-link" /></Button>
							<Button basic disabled={loadingSnap || loadingRcord || loadingFiles || restarting || recordingCams.indexOf(selectedCamera) > -1 || videosLoading || photosLoading || (photos.length <= 0 && videos.length <= 0)} circular onClick={() => this.props.downloadFiles(selectedCamera, { videos, photos, servidorMultimedia })} loading={loadingFiles}><i className="fa fa-download" /></Button>
							<Button basic disabled={loadingSnap || loadingRcord || loadingFiles || restarting || recordingCams.indexOf(selectedCamera) > -1} circular onClick={() => this.props.makeReport(selectedCamera)}><i className="fa fa-warning" /></Button>
							{/* <Button basic circular disabled={loadingSnap||loadingRcord||loadingFiles||restarting||recordingCams.indexOf(selectedCamera)>-1} onClick={this._restartCamStream}><i className={!restarting?"fa fa-repeat":"fa fa-repeat fa-spin"}/></Button> */}
							<Button basic circular onClick={() => this.props.changeStatus(selectedCamera)}><i className="fa fa-exchange" /></Button>
							{selectedCamera.dataCamValue && selectedCamera.dataCamValue.tipo_camara === 2 && selectedCamera.dataCamValue.dns != null ? <Button basic circular onClick={() => this.Clicked(selectedCamera.dataCamValue.dns)}><i className="fa fa-sliders" /></Button> : null}
							{selectedCamera.dataCamValue && selectedCamera.dataCamValue.tipo_camara === 2 && selectedCamera.dataCamValue.camera_ip != null ? <Button basic circular onClick={() => this.setState({ showPTZ: !showPTZ })}><i className="fa fa-arrows" /></Button> : null}
							{!qnapServer && !qnapChannel && (<AdvancedSearchNotqnap loading={searchLoading} _searchFileVideos={this._searchFileVideosNotqnap} moduleSearch={this._changeStatus} countDays={countDays} navButton={true} />)}
							{qnapServer && qnapChannel && (<AdvancedSearch loading={searchLoading} _searchFileVideos={this._searchFileVideos} />)}
						</div>
						<div className='col-5'>
							<b>Camara</b> {selectedCamera.name}
						</div>
						<div className='col-3'>
							<Button onClick={() => (this._openCameraInfo(false), this.setState({ moduleSearch: false }))} className='pull-right' primary> {autoplay ? '' : 'Ocultar controles'} <i className={autoplay ? 'fa fa-chevron-up' : 'fa fa-chevron-down'} /></Button>
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
						{
							selectedCamera.id > 100513 && selectedCamera.id < 100547 ?
								// selectedCamera.id === 1 || selectedCamera.id === 2 ?
								<>
									<div className="col-1 platesgrid" align="center">
										<VehiclesSelector filterCount={filterCount} setFilterCount={this._setFilterCount} />
									</div>
									<div className="col-11 platesgrid" align="center">
										{/* <CurveGridCamera camera={selectedCamera.dataCamValue} stateHeight="200" dataGraphic={true} /> */}
										{/* Aquí va el gráfico de PIQUITOS */}
										<VehiclesCount camera={selectedCamera.dataCamValue.id} filterCount={filterCount} />
									</div>
								</>
								:

								selectedCamera.dataCamValue ? !selectedCamera.dataCamValue.is_lpr ?
									<>
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
										<div id="scrollVideo" className="col videosgrid">
											Videos
											<Tab
												align="center"
												activeIndex={activeIndex}
												onTabChange={(e, { activeIndex }) => this.setState({ activeIndex })}
												menu={{ secondary: true, pointing: true }}
												panes={[
													{
														menuItem: 'Grabaciones',
														render: () => (
															<Tab.Pane attached={false}>
																{this._renderVideoList(videosLoading, videos, true, null, false, false, true)}
															</Tab.Pane>
														)
													},
													moduleActions && moduleActions.viewHistorial && !moduleSearch ? {
														menuItem: 'Últimas 24 Horas',
														render: () => (
															<>
																<div style={{ display: "flex", justifyContent: "space-around", paddingTop: "0.3rem" }}>
																	{
																		typeMBOX && removeSpaces(typeMBOX) === 'axxon' ?
																			<p>Descarga de videos</p>
																			:
																			<Radio
																				toggle
																				onClick={this._statusChange}
																				id="toggle24"
																				label="Descarga de videos"
																				checked={this.state.inputCkecked}
																			/>
																	}
																	<AdvancedSearchNotqnap loading={searchLoading} _searchFileVideos={this._searchFileVideosNotqnap} moduleSearch={this._changeStatus} countDays={countDays} navButton={false} />
																	<div>
																		<button className="btn btn-outline-primary ml-auto mr-auto mb-2" onClick={() => this._getHistoricsByHour(this.state.historicCurrentDay)} >Actualizar</button>
																	</div>
																</div>

																<hr />
																<div>
																	{this._renderButtonsByHour()}
																</div>

																{!inputCkecked ? (<Tab.Pane attached={false}>
																	{this._renderVideoListSearch(
																		historyLoading,
																		arrPares.length > 0 ? arrPares : video_history,
																		true,
																		arrPares.length > 0 ? arrPares[0] : null,
																		true, inputCkecked, false, true
																	)}
																</Tab.Pane>) : (<Tab.Pane attached={false}>
																	{this._renderVideoListSearch(
																		historyLoading,
																		arrPares.length > 0 ? arrPares : video_history,
																		true,
																		arrPares.length > 0 ? arrPares[0] : null,
																		true, inputCkecked, false, true
																	)}
																</Tab.Pane>)}
																<div style={{ display: "flex", justifyContent: "center", paddingTop: "0.3rem" }}>
																	{
																		typeMBOX && removeSpaces(typeMBOX) === 'axxon' ?
																			null
																			:
																			<Radio
																				toggle
																				onClick={this._statusChange}
																				id="toggle24"
																				label="Descarga de videos (links)"
																				checked={this.state.inputCkecked}
																			/>
																	}
																</div>
															</>
														)
													}
														:
														{
															menuItem: 'Resultados de búsqueda',
															render: () => (
																<>
																	<div style={{ display: "flex", justifyContent: "space-around", paddingTop: "0.3rem" }}>
																		{typeMBOX && removeSpaces(typeMBOX) === 'axxon' ?
																			<p>Descarga de videos</p> :
																			<Radio
																				toggle
																				onClick={this._statusChange}
																				id="toggle24"
																				label="Descarga de videos"
																				checked={this.state.inputCkecked}
																			/>
																		}
																		<div>
																			<button className="btn btn-outline-primary ml-auto mr-auto mb-2" onClick={() => this._backToHistorics()} >Volver a históricos</button>
																		</div>
																	</div>
																	<hr />
																	{ }

																	{!inputCkecked ? (<Tab.Pane attached={false}>
																		{this._renderVideoListSearch(
																			historyLoading,
																			arrPares.length > 0 ? arrPares : video_history,
																			true,
																			arrPares.length > 0 ? arrPares[0] : null,
																			true, inputCkecked, false, true
																		)}
																	</Tab.Pane>) : (<Tab.Pane attached={false}>
																		{this._renderVideoListSearch(
																			historyLoading,
																			arrPares.length > 0 ? arrPares : video_history,
																			true,
																			arrPares.length > 0 ? arrPares[0] : null,
																			true, inputCkecked, false, true
																		)}
																	</Tab.Pane>)}
																	<div style={{ display: "flex", justifyContent: "center", paddingTop: "0.3rem" }}>
																		{
																			typeMBOX && removeSpaces(typeMBOX) === 'axxon' ?
																				null
																				:
																				<Radio
																					toggle
																					onClick={this._statusChange}
																					id="toggle24"
																					label="Descarga de videos (links)"
																					checked={this.state.inputCkecked}
																				/>
																		}
																	</div>
																</>
															)
														},
													qnapServer && qnapChannel && {
														menuItem: 'Resultados de busqueda',
														render: () => (
															<Tab.Pane attached={false}>
																{(isNewSearch || searchLoading) && <hr />}
																{this._renderVideoList(searchLoading, video_search, isNewSearch, null, false, false, true)}
															</Tab.Pane>
														)
													}
												]}
											/>
										</div>
									</>
									:
									<div className="col-8 platesgrid" align="center">
										<CurveGridCamera camera={selectedCamera.dataCamValue} stateHeight="200" dataGraphic={true} />
									</div>
									:
									null
						}
						{
							selectedCamera.id < 100513 || selectedCamera.id > 100547 ?
								// selectedCamera.id !== 1 && selectedCamera.id !== 2 ?

								<div className="col-4 matchesgrid" align="center">
									Historial
									<br />

									{selectedCamera.dataCamValue ? selectedCamera.dataCamValue.is_lpr ? this._showPlates(true, selectedCamera) : null : null}

									{selectedCamera.dataCamValue ? !selectedCamera.dataCamValue.is_lpr ? this._showPlates(false, selectedCamera) : null : null}

									{/*  ---matches reales---
								{
										matches.length > 0 ? 
										(matches.map((value, index) => {
										return <Match key={index} info={value} toggleControls={this._closeControl} />;
										})) : (<h4>Sin historial de matches</h4>);
								} */
									}
									{/* ---matches planchados */}
									{/* {matches ? (
										matches.map((value, index) => {
											if (index % selectedCamera.num_cam !== 0) return null;
											return <Match key={index} info={value} toggleControls={this._closeControl} />;
										})
									) : null} */}
								</div>
								:
								null
						}
					</div>
				</div>
			</div>
		);
	}

	_showPlates = (state = false, selectedCamera) => {
		return (
			<Placas reset={state} selectedCamera={selectedCamera} />
		)
	}

	_setFilterCount = (filter) => {
		this.setState({ filterCount: filter })
	}


	Clicked = (dns) => {
		window.open('http://' + dns, 'Ficha de Incidencias', 'height=600,width=1200');
	};

	download = async (params, dns) => {
		let { apiStorageKey, dnsPort, typeMBOX, historyServerProtocol, historicalPassword, historicalUser, historyServerDns } = this.state;
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
				const { access_point, begin, end, camera_id, storage } = params;
				const body = {
					access_point,
					begin,
					end,
					cam_id: camera_id,
					storage,
					format: "mp4"
				};
				const archive = await conections.exportArchive(body);
				const { file_path, id, route } = archive.data && archive.data.archive;
				let level = null, message = null;
				if (file_path) {
					message = 'Descarga iniciada exitosamente.';
					level = 'info';

					this.addNotification({ message, level });
					let url = null;
					const password = historicalPassword;
					const user = historicalUser;

					if (dnsPort == 80 || dnsPort == 443) {
						url = `${historyServerProtocol}://${user}:${password}@${historyServerDns}/export/${id}/file?name=${file_path}`;
					} else {
						url = `${historyServerProtocol}://${user}:${password}@${historyServerDns}:${dnsPort}/export/${id}/file?name=${file_path}`;
					}

					window.open(url);
					const info = { cam_id: camera_id, route };

					setTimeout(() => {
						conections.finalizExportProcess(info);
					}, 5000)

					// const info = { cam_id: camera_id, route };
					// let xhr = new XMLHttpRequest();
					// xhr.withCredentials = true;
					// const credentials = Buffer.from(`${user}:${password}`).toString('Base64')

					// xhr.open('GET', url, true);
					// xhr.setRequestHeader("Authorization", "Basic " + credentials)
					// xhr.responseType = 'blob';
					// xhr.onload = (e) => {
					// 	let blob = xhr.response;
					// 	if (blob) {
					// 		this.saveFile(blob, params.fecha, params.real_hour, params.camera_id);
					// 	}
					// 	conections.finalizExportProcess(info);
					// };

					// xhr.onprogress = (e) => {

					// 	const percentages = [5, 20, 40, 60, 80, 95];
					// 	let progress = Math.floor((e.loaded / e.total) * 100);
					// 	percentages.forEach((t => {
					// 		if (t === progress) {
					// 			console.log(`progress: ${progress}`);
					// 		}
					// 	}))
					// };

					// xhr.send();
				} else {
					message = 'No se pudo iniciar la descarga.';
					level = 'error';

					this.addNotification({ message, level });
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

	saveFile = (blob, fecha, real_hour, camera_id) => {
		let fileName = `CAM${camera_id}_${fecha}-${real_hour}.mp4`
		let tempEl = document.createElement("a");
		document.body.appendChild(tempEl);
		tempEl.style = "display: none";
		let url = window.URL.createObjectURL(blob);
		tempEl.href = url;
		tempEl.download = fileName;
		tempEl.click();
		window.URL.revokeObjectURL(url);
	}

	addNotification = (info) => {
		const notification = this.notificationSystem.current;
		notification.addNotification({
			message: info.message,
			level: info.level,
			position: 'tc'
		});
	};

	_statusChange = () => {
		let { inputCkecked } = this.state;
		this.setState({ inputCkecked: !inputCkecked })
	}
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
		let { servidorMultimedia, dnsArray, camURL, apiStorageKey, portContainer, dnsContainer, typeMBOX, historyServerDns, historyServerPort, historyServerProtocol, selectedCamera, protocolDownload } = this.state;
		// const userIdContainer = this.getUserID()

		return loading ? (
			this._renderLoading()
		) : videoList && videoList.length > 0 ? (
			<>
				<PaginationList
					awsApiStreamsCams={true}
					numberVideos={7}
					videoList={videoList}
					isDownloadSearch={typeMBOX && removeSpaces(typeMBOX) === 'axxon' ? true : isDownload}
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
					selectedCamera={selectedCamera}
					reloadData={this._loadFiles}
					download={this.download}
					renderPagination={this._renderPagination}
					protocolDownload={protocolDownload}
					historyServerDns={historyServerDns}
					historyServerPort={historyServerPort}
					historyServerProtocol={historyServerProtocol}
					renderLoading={this._renderLoading}
				/>
			</>

		) : showNoFiles ? (
			<div align="center">
				<p className="big-letter">No hay archivos que mostrar</p>
				<i className="fa fa-image fa-5x" />
			</div>
		) : null
	};


	_renderVideoListSearch = (loading, videoList, showNoFiles = true, hasDns = null, isHistory = false, isDownloadSearch = false, isRecord = false, noButtons = false) => {
		let { servidorMultimedia, dnsArray, camURL, apiStorageKey, awsApiStreamsCams, selectedCamera, portContainer, dnsContainer, typeMBOX, protocolDownload, historyServerDns, historyServerPort, historyServerProtocol, loadingHistorics } = this.state;

		if (videoList.length > 0) {
			if (!videoList[0].active) {
				videoList.shift()
			}
		}

		let sortVideoList = videoList;
		if (videoList[0] && videoList[0].fecha < videoList[videoList.length - 1].fecha) {
			sortVideoList = videoList.reverse()
		}

		return loadingHistorics ? (
			this._renderLoading()
		) : videoList && videoList.length > 0 ? (
			<PaginationList
				awsApiStreamsCams={awsApiStreamsCams}
				numberVideos={40}
				videoList={sortVideoList}
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
				selectedCamera={selectedCamera}
				reloadData={this._loadFiles}
				download={this.download}
				renderPagination={this._renderPagination}
				protocolDownload={protocolDownload}
				historyServerDns={historyServerDns}
				historyServerPort={historyServerPort}
				historyServerProtocol={historyServerProtocol}
				renderLoading={this._renderLoading}
			/>
		) :
			showNoFiles ? (
				<div align="center">
					<p className="big-letter">No hay archivos que mostrar</p>
					<i className="fa fa-image fa-5x" />
				</div>
			) : null
	};

	_snapShot = async (camera) => {
		this.setState({ loadingSnap: true });
		let response = await conections.snapShotV2(camera.id);
		const data = response.data;
		if (data.success) {
			this._loadFiles(camera, false, false, false, true)
		};
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

	_getHistoricsByHour = (daysBack) => {

		this.setState({ loadingHistorics: true })

		let newMoment = [moment().subtract(daysBack, 'days').startOf('date').format('YYYY-MM-DD')];
		this._searchFileVideosNotqnap(newMoment, "00", "24");
		this.setState({ historicCurrentDay: daysBack })

		setTimeout(() => {
			this.setState({ loadingHistorics: false })
		}, 1000);
	}

	_changeStatus = (changeStatus) => {
		this.setState({ moduleSearch: changeStatus });
	}

	_backToHistorics = () => {
		let momentToMount = [moment().startOf('date').format('YYYY-MM-DD')];
		this._searchFileVideosNotqnap(momentToMount, "00", "24");
		this._changeStatus(false);
	}

	_renderButtonsByHour = () => {

		let { arrayWeek, arrayHistoricsByHour, historicCurrentDay } = this.state
		moment.locale('es');

		return (
			<div style={{ display: "flex", justifyContent: "space-between" }}>
				{
					arrayWeek.map((el, idx) => {
						if (arrayHistoricsByHour.includes(el)) {
							let buttonDate = moment().subtract(Math.abs(idx - 1), 'days').startOf('date').format('ll');
							return (
								<button key={Math.abs(idx - 1)} className={historicCurrentDay === Math.abs(idx - 1) ? "btn btn-primary ml-auto mr-auto mb-2" : "btn btn-outline-primary ml-auto mr-auto mb-2"} onClick={() => this._getHistoricsByHour(Math.abs(idx - 1))} >{buttonDate.split(" de ")[0] + " " + buttonDate.split(" de ")[1].split(".")[0].slice(0, 1)[0].toUpperCase() + buttonDate.split(" de ")[1].split(".")[0].slice(1)}</button>
							)
						} else {
							let buttonDate = moment().subtract(Math.abs(idx - 1), 'days').startOf('date').format('ll');
							return (
								<button key={Math.abs(idx - 1)} className="btn btn-outline-primary ml-auto mr-auto mb-2" disabled >{buttonDate.split(" de ")[0] + " " + buttonDate.split(" de ")[1].split(".")[0].slice(0, 1)[0].toUpperCase() + buttonDate.split(" de ")[1].split(".")[0].slice(1)}</button>
							);
						};
					})
				}
			</div>
		)
	}

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

		// if(element[0].hour < "23:00"){
		// 	let extraHalfString = JSON.stringify(element[0]);
		// 	let extraOClockString = JSON.stringify(element[1]);

		// 	let extraHalf = JSON.parse(extraHalfString);
		// 	let extraOClock = JSON.parse(extraOClockString);

		// 	extraHalf.hour = (parseInt(extraHalf.hour.split(":")[0]) + 1).toString() + ":" + extraHalf.hour.split(":")[1];
		// 	extraHalf.real_hour = (parseInt(extraHalf.real_hour.split(":")[0]) + 1).toString() + ":" + extraHalf.real_hour.split(":")[1];
		// 	extraHalf.relative_path_video = "Process";

		// 	extraOClock.hour = (parseInt(extraOClock.hour.split(":")[0]) + 1).toString() + ":" + extraOClock.hour.split(":")[1];
		// 	extraOClock.real_hour = (parseInt(extraOClock.real_hour.split(":")[0]) + 1).toString() + ":" + extraOClock.real_hour.split(":")[1];
		// 	extraOClock.relative_path_video = "Process";

		// 	element.unshift(extraHalf, extraOClock)
		// }

		if (dates.length <= 1) {
			element.filter(filter => (filter.fecha === dates[0])).filter(filter => filter.hour >= `${startHour}:00`).filter(filter => filter.hour < `${endHour}:00`).map(videos => result.push(videos))
			result.unshift([video_advanced[0]])
			this.setState({ arrPares: result })
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

	_searchFileVideos = async (dates, startHour, endHour, stateNames, setNewState = true, searchFileHours = false) => {
		let { selectedCamera, video_ssid, qnapServer, qnapChannel } = this.state;
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
				for (const nl of listNormal.datas) {
					for (const dt of dates) {
						if (!lthDate.includes(dt)) lthDate.push(dt);
						let getFistHourParams = { url, sid: auth.authSid, path: `${mainPath}/${nl.filename}/${dt}`, limit: 1, start: 0, type: '0' };
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

						let getParamsHours = { url, sid: auth.authSid, path: `${mainPath}/${nl.filename}/${dt}`, limit: newEndHour, start: newStartHour, type: '0' };
						await this.props.getQvrFileStationFileList(getParamsHours);
						let { QvrFileStationFileList: listHours, success: sHours } = this.props.QvrFileStationFileList;

						if (sHours && listHours && listHours.total > 0) {
							if (searchFileHours) return initialHour;
							for (const hr of listHours.datas) {
								if (parseInt(hr.filename, 10) < (lthDate.length === dates.length ? parseInt(endHour, 10) : 24)) {
									let getParamsVideo = { url, sid: auth.authSid, path: `${mainPath}/${nl.filename}/${dt}/${hr.filename}`, limit: '2', start: '0', type: '2' };
									await this.props.getQvrFileStationFileList(getParamsVideo);
									let { QvrFileStationFileList: listVideos, success: sVideos } = this.props.QvrFileStationFileList;
									if (sVideos && listVideos && listVideos.total > 0) for (const v of listVideos.datas) allVideosList.push(`${nl.filename}/${dt}/${hr.filename}/${v.filename}`);
								}

								if (selectedCamera.id !== this.state.selectedCamera.id) {
									await this._destroyFileVideos(false, false, qnapServer);
									break;
								}
							}
						}
						if (selectedCamera.id !== this.state.selectedCamera.id) {
							await this._destroyFileVideos(false, false, qnapServer);
							break;
						}
					}
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
		if (destroyFiles) await this._destroyFileVideos(true, (onlyCurrent && onlyHistory && onlyPhotos));
		let { selectedCamera } = this.state;
		// console.log(selectedCamera)
		let camera = cam && cam.id ? cam : selectedCamera;
		let tipoMBOX = camera.dataCamValue.tipombox
		let dnsMbox = camera.dataCamValue.urlhistory;
		const dns_portMbox = camera.dataCamValue.urlhistoryport
		const protocol = camera.dataCamValue.protocolhistory
		const portApiStorage = camera.dataCamValue.UrlAPIStorage.port
		const secretKeyBody = {
			'apiKey': camera.dataCamValue.tokenhistory
		}
		const protocolStorage = String(camera.dataCamValue.UrlAPIStorage.ip_url).split("://")[0]
		const dnsStorage = String(camera.dataCamValue.UrlAPIStorage.ip_url).split("://")[1]
		const tokenStorage = String(camera.dataCamValue.UrlAPIStorage.secretkey).replace("?", "")

		this.setState({ apiStorageKey: camera.dataCamValue.UrlAPIStorage.secretkey, camURL: camera.dataCamValue, portContainer: camera.dataCamValue.urlhistoryport, dnsContainer: camera.dataCamValue.urlhistory, completeCamera: cam, typeMBOX: tipoMBOX })
		// History
		if (camera.dataCamValue && camera.dataCamValue.qnap_server_id && camera.dataCamValue.qnap_channel) {
			if (onlyHistory) this._loadMoreHistory(true);
		} else {
			if (tipoMBOX && onlyHistory) {

				this.setState({ historyLoading: true, protocolDownload: protocol });
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
								if (dates[last_day]) {
									let arrayHistoricos = []
									let hours_last_day = createArrHour(dates[last_day].videos);
									let hours_current_day = createArrHour(dates[current_day].videos);
									this.setState({ video_history: [dns_ip, Object.values(hours_last_day).reverse().concat(Object.values(hours_current_day).reverse()).reverse()], historyLoading: false });
									this.setState({ dnsArray: this.state.video_history[0] })
									arrayHistoricos = this.state.video_history
									this.setState({ video_fistHistory: arrayHistoricos, video_loadMoreHistory: arrayHistoricos })

									setTimeout(() => this.spinnerif(), 400);
									this._loadfilesForSearch(camera, false, false, true, true, dns_ip, dns_port)
								} else {
									let arrayHistoricos = []
									let hours_current_day = createArrHour(dates[current_day].videos);
									this.setState({ video_history: [dns_ip, Object.values(hours_current_day)], historyLoading: false });
									this.setState({ dnsArray: this.state.video_history[0] })
									arrayHistoricos = this.state.video_history
									this.setState({ video_fistHistory: arrayHistoricos, video_loadMoreHistory: arrayHistoricos })

									setTimeout(() => this.spinnerif(), 400);
									this._loadfilesForSearch(camera, false, false, true, true, dns_ip, dns_port)

								}
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
							this.setState({ resHistorySearch: resHistory, historicalPassword: resHistory.historicalPassword, historicalUser: resHistory.historicalUser, historyServerPort: resHistory.dns_port, historyServerDns: resHistory.dns_ip, historyServerProtocol: resHistory.protocol });
							if (resHistory.items.length > 0) {
								let dns_ip = dnsMbox
								let dns_port = dns_portMbox
								this.setState({ dns_portdnsPort: dns_port })
								if (resHistory) {
									let dates = createArrDate(resHistory.items);
									if (dates[last_day]) {
										let arrayHistoricos = []
										let hours_last_day = createArrHour(dates[last_day].videos);
										let hours_current_day = dates[current_day] ? createArrHour(dates[current_day].videos) : [];
										this.setState({ video_history: [dns_ip, Object.values(hours_last_day).reverse().concat(Object.values(hours_current_day).reverse()).reverse()], historyLoading: false });
										this.setState({ dnsArray: this.state.video_history[0] })
										arrayHistoricos = this.state.video_history
										this.setState({ video_fistHistory: arrayHistoricos, video_loadMoreHistory: arrayHistoricos });
										setTimeout(() => this.spinnerif(), 400);
										this._loadfilesForSearch(camera, false, false, true, true, dns_ip, dns_port)
									} else {
										let arrayHistoricos = []
										let hours_current_day = createArrHour(dates[current_day].videos);
										this.setState({ video_history: [dns_ip, Object.values(hours_current_day)], historyLoading: false });
										this.setState({ dnsArray: this.state.video_history[0] })
										arrayHistoricos = this.state.video_history
										this.setState({ video_fistHistory: arrayHistoricos, video_loadMoreHistory: arrayHistoricos });
										setTimeout(() => this.spinnerif(), 400);
										this._loadfilesForSearch(camera, false, false, true, true, dns_ip, dns_port)
									}
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
		};

		// Current
		if (tipoMBOX && (onlyCurrent || onlyPhotos)) {
			this.setState({ videosLoading: true, photosLoading: true });
			try {
				let response = await conections.getCamDataV2(camera.id);
				if (camera.id === this.state.selectedCamera.id) {
					if (response.data) {
						let info = response.data.data
						this.setState({
							videos: response.data.data.files_multimedia ? response.data.data.files_multimedia.videos : [],
							photos: response.data.data.files_multimedia ? response.data.data.files_multimedia.photos : [],
							servidorMultimedia: `${info.protocol}://${response.data.data.dns_ip}`,
							historyServerPort: info.dns_port,
							historyServerDns: info.dns_ip,
							historyServerProtocol: info.protocol,
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
								let hours_last_day = createArrHour(dates[last_day].videos);
								conjunto.push(Object.values(hours_last_day).reverse().reverse())
								pruebas[0][1].push(conjunto)
								this.setState({ video_advancedSearch: pruebas })
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
				}
				this.addButtons(pruebas);
				this.setState({ video_advancedSearch: pruebas })
			}
		};

	};

	addButtons = (video_advancedSearch) => {
		let arrayButtons = [];
		let auxWeek = [];

		if (this.state.arrayHistoricsByHour.length === 0) {
			if (video_advancedSearch[0]) {
				video_advancedSearch[0][1].forEach(el => {
					if (el.videos && !arrayButtons.includes(el.videos[0].fecha)) {
						arrayButtons.push(el.videos[0].fecha);
					}
				})
			}
		}

		if (this.state.arrayWeek.length === 0) {
			for (let i = 0; i < 2; i++) {
				auxWeek.unshift(moment().subtract(i, 'days').startOf('date').format('YYYY-MM-DD'));
			}
		}

		if (arrayButtons.length > 0 && auxWeek.length > 0) {
			this.setState({ arrayWeek: auxWeek, arrayHistoricsByHour: arrayButtons });
		}
		this._getHistoricsByHour(0);


		let momentToMount = [moment().startOf('date').format('YYYY-MM-DD')];
		this._searchFileVideosNotqnap(momentToMount, "00", "24", null, null, null, video_advancedSearch);

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
				moduleSearch: false,
				slideIndex: index,
				isRecording: recording,
				arrPares: [],
				video_history: [],
				video_advancedSearch: [],
				arrayWeek: [],
				arrayHistoricsByHour: [],
				isplay: this.state.isplaying[this.state.slideIndex] === undefined ? true : this.state.isplaying[this.state.slideIndex]
			});
			this._loadFiles(marker.extraData, true, true, true, true);
		} else {
			this._destroyFileVideos(true, true, this.state.qnapServer);
			this.setState({ autoplay: true, selectedCamera: {}, qnapServer: null, qnapChannel: null });
		}
	};

	// _loadMoreVideosNotQnap = async (isFirst = false)=>{
	// 	let { video_history, video_fistHistory, countArray, video_loadMoreHistory } = this.state;

	// 	let index = countArray
	// 	let indexTwo = countArray + 2
	// 	 if (index < video_loadMoreHistory[1].length -1) {
	// 		 if(video_history.length === 2){
	// 			index = 1
	// 			let indexFirst = index
	// 			let indexTwoFirst = indexFirst + 2
	// 			let recorte = video_fistHistory[1].slice(indexFirst, indexTwoFirst);
	// 			index= index + 1;
	// 			video_history.push(recorte[1])
	// 			this.setState({video_history, historyLoading: false, countArray: index})
	// 			this.setState({ historyLoading: false });
	// 		 }else{
	// 			let recorte = video_fistHistory[1].slice(index, indexTwo);
	// 			index= index + 1;
	// 			video_history.push(recorte[1])
	// 			this.setState({video_history, historyLoading: false, countArray: index})
	// 			this.setState({ historyLoading: false });
	// 		 }

	// 	}
	// 	else{
	// 		this.setState({countArray: 1, video_history: video_loadMoreHistory, historyLoading: false})
	// 		this.setState({ hasMore: false });

	// 	}

	// }
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
		} if (activeIndex === 1 && video_history.length > 0 && isDown && hasMore) {
			setTimeout(() => {
				scroll.push(divScroll.scrollHeight);
				this.setState({ historyLoading: true });
				this._loadMoreVideosNotQnap();
			}, 1000);

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
		if (this.state.selectedCamera.dataCamValue) {
			document.getElementById('scrollVideo').addEventListener('scroll', this._infiniteScroll, false);
		}
	}

	componentWillUnmount() {
		this._destroyFileVideos();
		if (this.state.selectedCamera.dataCamValue) {
			if (document.getElementById('scrollVideo')) {
				document.getElementById('scrollVideo').removeEventListener('scroll', this._infiniteScroll, false);
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
