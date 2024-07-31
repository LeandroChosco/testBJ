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

import { BsArrowsExpand } from 'react-icons/bs'

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
// import { VehiclesCount } from './VehiclesCount';
// import VehiclesSelector from './VehiclesSelector';
import { removeSpaces } from '../../functions/removeSpaces';
import { LANG, MODE } from '../../constants/token';
import LoadingLogo from '../LoadingLogo';
// import MockupConection from './MockupConection';

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
		historialIndex: 0,
		historialConections: {},
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
		loadingRecord: false,
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
		isAxxonSearch: false,
		axxonList: [],
		gridActive: false,
		showLPR: false,
	};

	render() {
		let { activeIndex, historialIndex, /*historialConections,*/ markers, start, limit, selectedCamera, qnapServer, qnapChannel, pageCount, autoplay, photos, loadingSnap, loadingRecord, restarting, recordingCams, videos, servidorMultimedia, photosLoading, videosLoading, historyLoading, video_history, searchLoading, /*isNewSearch, video_search,*/ showPTZ, arrPares, inputCkecked, moduleSearch, portContainer, dnsContainer, countDays, /*filterCount,*/ typeMBOX, isAxxonSearch, axxonList, loadingUpdate, gridActive, showLPR } = this.state;
		let { propsIniciales, loading, showMatches, error, moduleActions, loadingFiles, is_filter } = this.props;


		if (document.getElementById("gridCameraControl") && document.getElementById("iconGrid")) {
			let gridCameraControl = document.getElementById("gridCameraControl");
			let iconGrid = document.getElementById("iconGrid");
			let mousePressed = false;
			let startY, startHeight;

			iconGrid.addEventListener("mousedown", function (event) {
				let rect = gridCameraControl.getBoundingClientRect();
				let topOffset = event.clientY - rect.top;
				if (topOffset <= 28) {
					mousePressed = true;
					startY = event.clientY;
					startHeight = gridCameraControl.offsetHeight;
				}
			});

			document.addEventListener("mousemove", function (event) {
				if (mousePressed) {
					let deltaY = startY - event.clientY;
					let newHeight = startHeight + deltaY;
					gridCameraControl.style.height = newHeight + "px";
				}
			});

			document.addEventListener("mouseup", function () {
				mousePressed = false;
			});
		}

		return (
			<div className="gridCameraContainer" align="center" style={{ background: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "var(--dark-mode-color)" : "white", color: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "#b3b3b3" : "black", transition: "all 0.2s linear" }}>
				<NotificationSystem ref={this.notificationSystem} />
				<Row style={{ marginBottom: gridActive && "18rem" }}>
					{loadingUpdate ?
						<LoadingLogo />
						: markers.map((value, index) =>
							index < start + limit && index >= start ? (
								<Col className={selectedCamera === value.extraData ? ('p-l-0 p-r-0 activeselectedcameragrid camcolgridholder') : ('p-l-0 p-r-0 camcolgridholder')} lg={4} sm={6} key={value.extraData.id} onClick={() => this._openCameraInfo(value, index)} marker={value.id}>
									<CameraStream
										setCountError={this.props.setCountError}
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
					<Row className={!showMatches ? ('hide-matches paginatorContainerOnGrid2') : ('show-matches paginatorContainerOnGrid')} style={{ width: "100%", background: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "var(--dark-mode-color)" : "white", color: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "#b3b3b3" : "black", transition: "all 0.2s linear" }}>
						<Col style={{ height: '100%' }}>
							{localStorage.getItem(LANG) === "english" ? "Cameras per page    " : "Cámaras por página    "}
							<Select
								placeholder={localStorage.getItem(LANG) === "english" ? "Cameras per page" : "Cámaras por página"}
								options={countryOptions}
								value={limit}
								onChange={(e, value) => {
									const pageCount = Math.ceil(markers.length / value.value);
									this.setState({ start: 0, limit: value.value, pageCount: pageCount });
								}}
								style={{ background: "transparent", color: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "#b3b3b3" : "black", transition: "all 0.2s linear" }}
							/>
						</Col>
						<Col style={{ alignContent: "center" }}>
							<ReactPaginate
								previousLabel={"<"}
								nextLabel={">"}
								breakLabel={'...'}
								pageCount={pageCount}
								marginPagesDisplayed={2}
								pageRangeDisplayed={5}
								onPageChange={this.handlePageClick}
								containerClassName={(localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? 'pagination dark-pagination' : 'pagination light-pagination'}
								subContainerClassName={'pages pagination'}
								activeClassName={'active'}
								style={{ background: "transparent", color: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) && "white", transition: "all 0.2s linear" }}
							/>
						</Col>
					</Row>
				)}
				{error && markers.length === 0 ? (
					<div className="errorContainer">
						{localStorage.getItem(LANG) === "english" ?
							`Error loading information: ${JSON.stringify(error)}`
							:
							`Error al cargar información: ${JSON.stringify(error)}`
						}

					</div>
				) : null}
				{is_filter && markers.length === 0 ? (
					<div align="center" style={{ color: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "white" : "#666666" }}>
						{Strings.noResults}
					</div>
				) : null}
				<div id="gridCameraControl" style={{ zIndex: 3, background: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "var(--dark-mode-bar)" : "lightgray", color: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "#b3b3b3" : "black", transition: "all 0.2s linear" }} className={`${!autoplay ? !showMatches ? ('sin-margin camGridControl showfiles') : ('con-margin camGridControl showfiles') : !showMatches ? ('sin-margin camGridControl') : ('con-margin camGridControl')} ${!gridActive ? "hidefiles" : ""}`}>
					<div id="iconGrid" className="iconGrid">
						<BsArrowsExpand id="expand-grid" />
					</div>
					<div className="row stiky-top">
						<div className="col-11" style={{ display: "flex", justifyContent: "space-around", marginLeft: "1.1rem" }}>
							{moduleActions && moduleActions.btnsnap && (<Button basic circular className="actions-btn-grid" disabled={photos.length >= 5 || loadingSnap || loadingRecord || loadingFiles || restarting || recordingCams.indexOf(selectedCamera) > -1} loading={loadingSnap} onClick={() => this._snapShot(selectedCamera)}><i className="fa fa-camera" style={{ color: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "#b3b3b3" : "#666666", transition: "all 0.2s linear" }} />{!loadingSnap && <p style={{ marginTop: "0.2rem", color: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "#b3b3b3" : "#666666", transition: "all 0.2s linear" }} >Toma de foto</p>}</Button>)}
							{/* <Button basic disabled={loadingSnap||loadingRecord||loadingFiles||restarting||recordingCams.indexOf(selectedCamera)>-1} circular onClick={this._playPause}><i className={isplay?'fa fa-pause':'fa fa-play'}/><p style={{marginTop: "0.2rem"}}>Texteditable</p></Button> */}
							{moduleActions && moduleActions.btnrecord && typeMBOX && removeSpaces(typeMBOX) !== 'axxon' && (<Button basic circular className="actions-btn-grid" disabled={videos.length >= 5 || loadingSnap || loadingRecord || loadingFiles || restarting} loading={loadingRecord} onClick={() => this._recordignToggle(selectedCamera)}><i className={recordingCams.indexOf(selectedCamera) > -1 ? 'fa fa-stop-circle recording' : 'fa fa-stop-circle'} style={{ color: 'red' }} />{!loadingRecord && <p style={{ marginTop: "0.2rem", color: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "#b3b3b3" : "#666666" }}>Toma de video</p>}</Button>)}
							{/* {!(loadingSnap || loadingRecord || loadingFiles || restarting) && <Button basic circular className="actions-btn-grid" disabled={recordingCams.indexOf(selectedCamera) > -1} onClick={() => window.open(window.location.href.replace(window.location.pathname, '/') + 'analisis/' + selectedCamera.id, '_blank', 'toolbar=0,location=0,directories=0,status=1,menubar=0,titlebar=0,scrollbars=1,resizable=1')}><i className="fa fa-external-link" /><p style={{marginTop: "0.2rem"}}>Texteditable</p></Button>} */}
							{<Button basic circular className="actions-btn-grid" disabled={(photos.length <= 0 && videos.length <= 0) || loadingSnap || loadingRecord || loadingFiles || restarting || videosLoading || photosLoading || recordingCams.indexOf(selectedCamera) > -1} onClick={() => this.props.downloadFiles(selectedCamera, { videos, photos, servidorMultimedia })} loading={loadingFiles}><i className="fa fa-download" style={{ color: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "#b3b3b3" : "#666666", transition: "all 0.2s linear" }} /><p style={{ marginTop: "0.2rem", color: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "#b3b3b3" : "#666666" }}>Descargar</p></Button>}
							{(selectedCamera && /*selectedCamera.id === 2*/ selectedCamera.dataCamValue && selectedCamera.dataCamValue.is_lpr) && (<Button basic circular className="actions-btn-grid" onClick={() => this._changeShowLPR()} loading={loadingFiles}><i className={showLPR ? "fa fa-picture-o" : "fa fa-area-chart"} style={{ color: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "#b3b3b3" : "#666666", transition: "all 0.2s linear" }} /><p style={{ marginTop: "0.2rem", color: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "#b3b3b3" : "#666666" }}>{showLPR ? "Ver multimedia" : "Ver gráficos"}</p></Button>)}
							{/* {!(loadingSnap || loadingRecord || loadingFiles || restarting) && <Button basic circular className="actions-btn-grid" disabled={recordingCams.indexOf(selectedCamera) > -1} onClick={() => this.props.makeReport(selectedCamera)}><i className="fa fa-warning" /><p style={{marginTop: "0.2rem"}}>Texteditable</p></Button>} */}
							{/* <Button basic circular className="actions-btn-grid" disabled={loadingSnap||loadingRecord||loadingFiles||restarting||recordingCams.indexOf(selectedCamera)>-1} onClick={this._restartCamStream}><i className={!restarting?"fa fa-repeat":"fa fa-repeat fa-spin"}/><p style={{marginTop: "0.2rem"}}>Texteditable</p></Button> */}
							<Button basic circular className="actions-btn-grid" onClick={() => this.props.changeStatus(selectedCamera)}><i className="fa fa-exchange" style={{ color: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "#b3b3b3" : "#666666", transition: "all 0.2s linear" }} /><p style={{ marginTop: "0.2rem", color: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "#b3b3b3" : "#666666", transition: "all 0.2s linear" }}>Cambiar estado</p></Button>
							{/* {selectedCamera.dataCamValue && selectedCamera.dataCamValue.tipo_camara === 2 && selectedCamera.dataCamValue.dns != null ? <Button basic circular className="actions-btn-grid" onClick={() => this.Clicked(selectedCamera.dataCamValue.dns)}><i className="fa fa-sliders" /><p style={{marginTop: "0.2rem"}}>Texteditable</p></Button> : null} */}
							{selectedCamera.dataCamValue && selectedCamera.dataCamValue.tipo_camara === 2 && selectedCamera.dataCamValue.camera_ip != null ? <Button basic circular className="actions-btn-grid" onClick={() => this.setState({ showPTZ: !showPTZ })}><i className="fa fa-arrows" style={{ color: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "#b3b3b3" : "#666666", transition: "all 0.2s linear" }} /><p style={{ marginTop: "0.2rem", color: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "#b3b3b3" : "#666666" }}>Controles PTZ</p></Button> : null}
							{!qnapServer && !qnapChannel && (<AdvancedSearchNotqnap loading={searchLoading} _searchFileVideos={this._searchFileVideosNotqnap} moduleSearch={this._changeStatus} countDays={countDays} navButton={true} isAxxon={typeMBOX && removeSpaces(typeMBOX) === 'axxon' ? true : false} _searchFilesAxxon={this._searchFilesAxxon} />)}
							{qnapServer && qnapChannel && (<AdvancedSearch loading={searchLoading} _searchFileVideos={this._searchFileVideos} />)}
						</div>
						<div className='col-1' style={{ marginLeft: "-2rem" }}>
							{
								(localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ?
									<Button onClick={() => this._openCameraInfo(false)} className={`pull-right`} secondary style={{ margin: "0.5rem", height: "3rem", width: "3rem", display: "flex", justifyContent: "center", aligntItems: "center" }}><i className={autoplay ? 'fa fa-chevron-up' : 'fa fa-chevron-down'} />
										{/* <p style={{color: "white"}}>Ocultar</p> */}
									</Button>
									:
									<Button onClick={() => this._openCameraInfo(false)} className={`pull-right`} primary style={{ margin: "0.5rem", height: "3rem", width: "3rem", display: "flex", justifyContent: "center", aligntItems: "center" }}><i className={autoplay ? 'fa fa-chevron-up' : 'fa fa-chevron-down'} />
										{/* <p style={{color: "white"}}>Ocultar</p> */}
									</Button>
							}
						</div>
					</div>
					<div className={!autoplay ? `row ${(localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "showfilesdarkmodegrid" : "showfilesinfocameragrid"}` : 'row hidefiles'}>
						{showPTZ &&
							<div className="col ptzgrid">
								{localStorage.getItem(LANG) === "english" ? "Controls" : "Controles"}
								<ControlPTZ
									camera={selectedCamera}
									isInMap={false}
									hasMatch={true}
								/>
							</div>
						}
						{
							// selectedCamera.id > 513 && selectedCamera.id < 547 ?
							// 	// selectedCamera.id === 1 || selectedCamera.id === 2 ?
							// 	<>
							// 		<div className="col-1 platesgrid" align="center">
							// 			<VehiclesSelector filterCount={filterCount} setFilterCount={this._setFilterCount} />
							// 		</div>
							// 		<div className="col-11 platesgrid" align="center">
							// 			{/* <CurveGridCamera camera={selectedCamera.dataCamValue} stateHeight="200" dataGraphic={true} /> */}
							// 			{/* Aquí va el gráfico de PIQUITOS */}
							// 			<VehiclesCount camera={selectedCamera.dataCamValue.id} filterCount={filterCount} />
							// 		</div>
							// 	</>
							// 	:

							// selectedCamera.dataCamValue ? !selectedCamera.dataCamValue.is_lpr ?
							selectedCamera.dataCamValue ? !showLPR ?
								<>
									{typeMBOX && removeSpaces(typeMBOX) !== 'axxon' &&
										<div className="col-3 snapshotsgrid">
											{/* {localStorage.getItem(LANG) === "english" ? "Photos" : "Fotos"} */}
											<Tab
												align="center"
												menu={{ secondary: true, pointing: true, inverted: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) }}
												// activeIndex={historialIndex}
												// onTabChange={(e, { activeIndex }) => { this.setState({ historialIndex: activeIndex }) }}
												panes={[
													{
														menuItem: localStorage.getItem(LANG) === "english" ? "Photos" : 'Fotos',
														render: () => (
															<Tab.Pane style={{ background: "transparent" }} attached={false}>
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
																	// <div align="center" className='no-data-show' style={{ marginLeft: "1rem" }}>
																	<div align="center" style={{ paddingBottom: "3rem", paddingRight: "1rem" }}>
																		<p className="big-letter" style={{ color: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "#b3b3b3" : "#666666" }}>{localStorage.getItem(LANG) === "english" ? "No files to show" : "No hay archivos que mostrar"}</p>
																		<i className="fa fa-image fa-5x" />
																	</div>
																)}
															</Tab.Pane>
														)
													},
												]}
											/>
										</div>
									}
									<div id="scrollVideo" className="col videosgrid">
										{/* {localStorage.getItem(LANG) === "english" ? "Videos" : "Videos"} */}
										<Tab
											align="center"
											activeIndex={activeIndex}
											onTabChange={(e, { activeIndex }) => this.setState({ activeIndex })}
											menu={{ secondary: true, pointing: true, inverted: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) }}
											panes={[
												typeMBOX && removeSpaces(typeMBOX) !== 'axxon' &&
												{
													menuItem: localStorage.getItem(LANG) === "english" ? "Recordings" : 'Grabaciones',
													render: () => (
														<Tab.Pane style={{ background: "transparent" }} attached={false}>
															{this._renderVideoList(videosLoading, videos, true, null, false, false, true)}
														</Tab.Pane>
													)
												},
												moduleActions && moduleActions.viewHistorial && !moduleSearch ? {
													menuItem: localStorage.getItem(LANG) === "english" ? "Historics" : 'Históricos',
													render: () => (
														<>
															{
																historyLoading ?
																	this._renderLoading()
																	:
																	<>
																		<div style={{ display: "flex", justifyContent: "space-around", paddingTop: "0.3rem", alignItems: "center" }}>
																			{
																				typeMBOX && removeSpaces(typeMBOX) === 'axxon' ?
																					<div>
																						<p>{localStorage.getItem(LANG) === "english" ? "Download videos" : "Descarga de videos"}</p>
																					</div>
																					:
																					<Radio
																						slider
																						onClick={this._statusChange}
																						id="toggle24"
																						// label={localStorage.getItem(LANG) === "english" ? "Download videos (links)" : "Descarga de videos (links)"}
																						label={<label className={(localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "dark-toggle" : "light-toggle"}>Descarga de videos (links)</label>}
																						checked={this.state.inputCkecked}
																					// className={(localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "dark-toggle" : "light-toggle"}
																					/>
																			}
																			<AdvancedSearchNotqnap loading={searchLoading} _searchFileVideos={this._searchFileVideosNotqnap} moduleSearch={this._changeStatus} countDays={countDays} navButton={false} isAxxon={typeMBOX && removeSpaces(typeMBOX) === 'axxon' ? true : false} _searchFilesAxxon={this._searchFilesAxxon} />
																			<div>
																				<button className={`btn btn-${(localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "secondary" : "outline-primary"} ml-auto mr-auto mb-2`} onClick={() => this._getHistoricsByHour(this.state.historicCurrentDay)} >
																					{localStorage.getItem(LANG) === "english" ? "Refresh" : "Actualizar"}
																				</button>
																			</div>
																		</div>

																		<hr />
																		{this._renderButtonsByHour()}

																		{!inputCkecked ? (<Tab.Pane style={{ background: "transparent" }} attached={false}>
																			{this._renderVideoListSearch(
																				historyLoading,
																				arrPares.length > 0 ? arrPares : video_history,
																				true,
																				arrPares.length > 0 ? arrPares[0] : null,
																				true, inputCkecked, false, true
																			)}
																		</Tab.Pane>) : (<Tab.Pane style={{ background: "transparent" }} attached={false}>
																			{this._renderVideoListSearch(
																				historyLoading,
																				arrPares.length > 0 ? arrPares : video_history,
																				true,
																				arrPares.length > 0 ? arrPares[0] : null,
																				true, inputCkecked, false, true
																			)}
																		</Tab.Pane>)}
																	</>
															}
														</>
													)
												}
													:
													{
														menuItem: localStorage.getItem(LANG) === "english" ? "Search results" : 'Resultados de búsqueda',
														render: () => (
															<>
																<div style={{ display: "flex", justifyContent: "space-around", paddingTop: "0.3rem", alignItems: "center" }}>
																	{typeMBOX && removeSpaces(typeMBOX) === 'axxon' ?
																		<div>
																			<p>{localStorage.getItem(LANG) === "english" ? "Download videos" : "Descarga de videos"}</p>
																		</div>
																		:
																		<Radio
																			slider
																			onClick={this._statusChange}
																			id="toggle24"
																			label={localStorage.getItem(LANG) === "english" ? "Download videos" : "Descarga de videos"}
																			checked={this.state.inputCkecked}
																			className="full-toggle"
																		/>
																	}
																	<div>
																		<button className={`btn btn-${(localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "secondary" : "outline-primary"} ml-auto mr-auto mb-2`} onClick={() => this._backToHistorics()} >
																			{localStorage.getItem(LANG) === "english" ? "Back to historics" : "Volver a históricos"}
																		</button>
																	</div>
																</div>
																<hr />
																{ }

																{!inputCkecked ? (<Tab.Pane style={{ background: "transparent" }} attached={false}>
																	{this._renderVideoListSearch(
																		historyLoading,
																		isAxxonSearch ? axxonList : arrPares.length > 0 ? arrPares : video_history,
																		true,
																		isAxxonSearch ? axxonList : arrPares.length > 0 ? arrPares[0] : null,
																		true, inputCkecked, false, true
																	)}
																</Tab.Pane>) : (<Tab.Pane style={{ background: "transparent" }} attached={false}>
																	{this._renderVideoListSearch(
																		historyLoading,
																		isAxxonSearch ? axxonList : arrPares.length > 0 ? arrPares : video_history,
																		true,
																		isAxxonSearch ? axxonList : arrPares.length > 0 ? arrPares[0] : null,
																		true, inputCkecked, false, true
																	)}
																</Tab.Pane>)}
																<div style={{ display: "flex", justifyContent: "center", paddingTop: "0.3rem" }}>
																	{
																		typeMBOX && removeSpaces(typeMBOX) === 'axxon' ?
																			null
																			:
																			<Radio
																				slider
																				onClick={this._statusChange}
																				id="toggle24"
																				label={<label className={(localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "dark-toggle" : "light-toggle"}>Descarga de videos (links)</label>}
																				checked={this.state.inputCkecked}
																				className="full-toggle"
																			/>
																	}
																</div>
															</>
														)
													},
												// {
												// 	menuItem: 'Vault Storage',
												// 	render: () => (
												// 		<>
												// 			{
												// 				historyLoading ?
												// 					this._renderLoading()
												// 					:
												// 					<>
												// 						<div style={{ display: "flex", justifyContent: "space-around", paddingTop: "0.3rem" }}>
												// 							{
												// 								typeMBOX && removeSpaces(typeMBOX) === 'axxon' ?
												// 									<p>{localStorage.getItem(LANG) === "english" ? "Download videos" : "Descarga de videos"}</p>
												// 									:
												// 									<Radio
												// 										slider
												// 										onClick={this._statusChange}
												// 										id="toggle24"
												// 										// label={localStorage.getItem(LANG) === "english" ? "Download videos (links)" : "Descarga de videos (links)"}
												// 										label={<label className={(localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "dark-toggle" : "light-toggle"}>Descarga de videos (links)</label>}
												// 										checked={this.state.inputCkecked}
												// 										style={{display: "flex", alignItems: "center"}}
												// 									// className={(localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "dark-toggle" : "light-toggle"}
												// 									/>
												// 							}
												// 							{/* <AdvancedSearchNotqnap loading={searchLoading} _searchFileVideos={this._searchFileVideosNotqnap} moduleSearch={this._changeStatus} countDays={countDays} navButton={false} isAxxon={typeMBOX && removeSpaces(typeMBOX) === 'axxon' ? true : false} _searchFilesAxxon={this._searchFilesAxxon} /> */}
												// 							<div>
												// 								<button className={`btn btn-${(localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "secondary" : "outline-primary"} ml-auto mr-auto mb-2`} onClick={() => this._getHistoricsByHour(this.state.historicCurrentDay)} >
												// 									{localStorage.getItem(LANG) === "english" ? "Refresh" : "Actualizar"}
												// 								</button>
												// 							</div>
												// 						</div>

												// 						<hr />
												// 						{/* {this._renderButtonsByHour()} */}

												// 						{!inputCkecked ? (<Tab.Pane style={{ background: "transparent" }} attached={false}>
												// 							{this._renderVideoListSearch(
												// 								historyLoading,
												// 								arrPares.length > 0 ? arrPares : video_history,
												// 								true,
												// 								arrPares.length > 0 ? arrPares[0] : null,
												// 								true, inputCkecked, false, true
												// 							)}
												// 						</Tab.Pane>) : (<Tab.Pane style={{ background: "transparent" }} attached={false}>
												// 							{this._renderVideoListSearch(
												// 								historyLoading,
												// 								arrPares.length > 0 ? arrPares : video_history,
												// 								true,
												// 								arrPares.length > 0 ? arrPares[0] : null,
												// 								true, inputCkecked, false, true
												// 							)}
												// 						</Tab.Pane>)}
												// 					</>
												// 			}
												// 		</>
												// 	)
												// }

												// qnapServer && qnapChannel && {
												// 	menuItem: 'Resultados de busqueda',
												// 	render: () => (
												// 		<Tab.Pane style={{ background: "transparent"}} attached={false}>
												// 			{(isNewSearch || searchLoading) && <hr />}
												// 			{ this._renderVideoList(searchLoading, video_search, isNewSearch, null, false, false, true)}
												// 		</Tab.Pane>
												// 	)
												// }
											]}
										/>
									</div>
								</>
								:
								<div className="col-7 platesgrid" align="center">
									<CurveGridCamera camera={selectedCamera.dataCamValue} />
								</div>
								:
								null
						}
						{
							// selectedCamera.id < 513 || selectedCamera.id > 547 ?
							// 	// selectedCamera.id !== 1 && selectedCamera.id !== 2 ?

							<div className={`${((typeMBOX && removeSpaces(typeMBOX) !== 'axxon') && (selectedCamera.dataCamValue && selectedCamera.dataCamValue.is_lpr) && !showLPR) ? "col-4" : "col-5"} matchesgrid`} align="center">
								{/* {(selectedCamera.dataCamValue.type_camare_id === 2 && !selectedCamera.dataCamValue.is_lpr) && */}
								<Tab
									align="center"
									menu={{ secondary: true, pointing: true, inverted: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) }}
									activeIndex={historialIndex}
									onTabChange={(e, { activeIndex }) => { this.setState({ historialIndex: activeIndex }) }}
									panes={[
										{
											menuItem: localStorage.getItem(LANG) === "english" ? "Detections" : 'Detecciones',
											render: () => (
												<Tab.Pane style={{ background: "transparent" }} attached={false}>
													<div style={{ paddingBottom: "3rem", paddingRight: "1rem" }}>
														{(selectedCamera.dataCamValue && selectedCamera.dataCamValue.is_lpr) ? this._showPlates(true, selectedCamera)
															:
															photosLoading ?
																this._renderLoading()
																:
																<div align="center">
																	<p className="big-letter" style={{ color: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "#b3b3b3" : "#666666" }}>{localStorage.getItem(LANG) === "english" ? "No detections to show" : "No hay detecciones que mostrar"}</p>
																	<i className="fa fa-image fa-5x" />
																</div>
														}

														{/* {selectedCamera.dataCamValue ? !selectedCamera.dataCamValue.is_lpr ? this._showPlates(false, selectedCamera) : null : null} */}
														{/* {
																	photosLoading ?
																		this._renderLoading()
																		:
																		historialConections ?
																			<MockupConection info={historialConections} searchHistorialConections={this._searchHistorialConections} renderLoading={this._renderLoading} version={true} showNotification={this.addNotification} />
																			:
																			<div align="center">
																				<p className="big-letter" style={{ color: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "#b3b3b3" : "#666666" }}>{localStorage.getItem(LANG) === "english" ? "No logs to show" : "No hay registros que mostrar"}</p>
																				<i className="fa fa-image fa-5x" />
																			</div>
																} */}
													</div>
												</Tab.Pane>
											)
										},
										// {
										// 	menuItem: localStorage.getItem(LANG) === "english" ? "Conection" : 'Conexión',
										// 	render: () => (
										// 		<Tab.Pane style={{ background: "transparent" }} attached={false}>
										// 			{photosLoading ?
										// 				this._renderLoading()
										// 				:
										// 				<div align="center" style={{ paddingBottom: "3rem", paddingRight: "1rem" }}>
										// 					<p className="big-letter" style={{ color: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "#b3b3b3" : "#666666" }}>{localStorage.getItem(LANG) === "english" ? "No detections to show" : "No hay detecciones que mostrar"}</p>
										// 					<i className="fa fa-image fa-5x" />
										// 				</div>}
										// 		</Tab.Pane>
										// 	)
										// },
									]}
								/>
								{/* } */}

								{/* {selectedCamera.dataCamValue ? selectedCamera.dataCamValue.is_lpr ? this._showPlates(true, selectedCamera) : null : null} */}

								{/* {selectedCamera.dataCamValue ? !selectedCamera.dataCamValue.is_lpr ? this._showPlates(false, selectedCamera) : null : null} */}
							</div>
							// 	:
							// 	null
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
				if (responseArchive && responseArchive.data && responseArchive.data.success && Object.keys(responseArchive.data.archive).length > 0) {
					const { file_path, id, route } = responseArchive.data && responseArchive.data.archive;
					if (file_path) {
						message = localStorage.getItem(LANG) === "english" ? Strings.downloadEnglishStarted : Strings.downloadStarted;
						level = 'success';
						title = localStorage.getItem(LANG) === "english" ? 'Historic download' : 'Descarga de histórico';
						window.location.pathname !== "/cuadrantes" ? this.addNotification({ message, level, title }) : this.props.quadrantNotification({ message, level, title });
						let url = null;
						const password = historicalPassword;
						const user = historicalUser;

						if (parseInt(dnsPort) === 80 || parseInt(dnsPort) === 443) {
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
							if (parseInt(xhr.status) === 401) {
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

							if (parseInt(xhr.status) === 401) {
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
					window.location.pathname !== "/cuadrantes" ? this.addNotification({ message, level, title }) : this.props.quadrantNotification({ message, level, title });
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

	addNotification = (info) => {
		const notification = this.notificationSystem.current;
		notification.addNotification({
			message: info.message,
			level: info.level,
			position: 'tc',
			title: info.title,
			autoDismiss: info.level === "warning" ? 0 : 7
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
		let { servidorMultimedia, dnsArray, camURL, apiStorageKey, portContainer, dnsContainer, typeMBOX, historyServerDns, historyServerPort, historyServerProtocol, selectedCamera, protocolDownload, historicCurrentDay } = this.state;
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
					getHistoricsByHour={this._getHistoricsByHour}
					historicCurrentDay={historicCurrentDay}
				/>
			</>

		) : showNoFiles ? (
			<div align="center" style={{ paddingBottom: "3rem" }}>
				<p className="big-letter" style={{ color: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "#b3b3b3" : "#666666" }}>{localStorage.getItem(LANG) === "english" ? "No files to show" : "No hay archivos que mostrar"}</p>
				<i className="fa fa-image fa-5x" />
			</div>
		) : null
	};


	_renderVideoListSearch = (loading, videoList, showNoFiles = true, hasDns = null, isHistory = false, isDownloadSearch = false, isRecord = false, noButtons = false) => {
		let { servidorMultimedia, dnsArray, camURL, apiStorageKey, awsApiStreamsCams, selectedCamera, portContainer, dnsContainer, typeMBOX, protocolDownload, historyServerDns, historyServerPort, historyServerProtocol, loadingHistorics, isAxxonSearch, historicCurrentDay } = this.state;

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
				};
			});
		};

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
							selectedCamera={selectedCamera}
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
						<div align="center" className='no-data-show'>
							<p className="big-letter" style={{ color: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "#b3b3b3" : "#666666" }}>{localStorage.getItem(LANG) === "english" ? "No files to show" : "No hay archivos que mostrar"}</p>
							<i className="fa fa-image fa-5x" />
						</div>
					) : null
	};

	_snapShot = async (camera) => {
		const { dnsPort, typeMBOX, historyServerProtocol, historicalPassword, historicalUser, historyServerDns } = this.state;
		this.setState({ loadingSnap: true });
		let title = 'Descarga de fotografía', message = Strings.unprocessed, level = 'warning';
		if (removeSpaces(typeMBOX) === 'axxon') {
			const payload = { cam_id: camera.id };
			const getVideoStream = await conections.getVideoStreams(payload);
			if (getVideoStream.data && getVideoStream.data.success) {
				const { data: { data } } = getVideoStream;
				const videoSourceId = data[1].accessPoint;
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
						// this.addNotification({ message, level, title });
						window.location.pathname !== "/cuadrantes" ? this.addNotification({ message, level, title }) : this.props.quadrantNotification({ message, level, title });
					};

					xhr.onload = (e) => {
						let blob = xhr.response;
						if (blob && xhr.status === 200) {
							const downloadDate = new Date();
							const dateToFileName = moment(downloadDate).format("YYYY-MM-DD HH:mm:ss").split(" ");
							const fileName = `CAM${camera.id}_${dateToFileName[0]}_${dateToFileName[1]}.jpeg`;
							this.saveFile(blob, fileName);
							this.setState({ loadingSnap: false });
							this.addNotification({ message: "Fotografía descargada correctamente", level: "success", title: "Descarga exitosa" })
						} else {
							// this.addNotification({ message, level, title });
							window.location.pathname !== "/cuadrantes" ? this.addNotification({ message, level, title }) : this.props.quadrantNotification({ message, level, title });
							this.setState({ loadingSnap: false });
						}
					};
					xhr.send();
				} else {
					// this.addNotification({ message, level, title });
					window.location.pathname !== "/cuadrantes" ? this.addNotification({ message, level, title }) : this.props.quadrantNotification({ message, level, title });
					this.setState({ loadingSnap: false });
				}
			} else {
				// this.addNotification({ message, level, title });
				window.location.pathname !== "/cuadrantes" ? this.addNotification({ message, level, title }) : this.props.quadrantNotification({ message, level, title });
				this.setState({ loadingSnap: false });
			}
		} else {
			let response = await conections.snapShotV2(camera.id);
			const data = response.data;
			if (data.success) {
				this._loadFiles(camera, false, false, false, true)
			};
			this.setState({ loadingSnap: false });
		}
	};

	_recordignToggle = async (selectedCamera) => {
		let response = {};
		if (this.state.recordingCams.indexOf(selectedCamera) > -1) {
			this.setState({ loadingRecord: true });
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
				this.setState({ recordingCams: stateRecordingCams, recordingProcess: stateRecordingProcess, isRecording: false, loadingRecord: false, modal: true, recordMessage: response.msg });
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
		};

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
													<button key={idx} className={`btn btn-${(localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "secondary" : "outline-primary"} ml-auto mr-auto mb-2 fake-btn`} onClick={() => searchVideos(element)} >
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
			for (let i = hour; i > -1; i--) {
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

		if (!this.state.isAxxonSearch) {
			this.setState({ loadingHistorics: true })

			let newMoment = [moment().subtract(daysBack, 'days').startOf('date').format('YYYY-MM-DD')];
			this._searchFileVideosNotqnap(newMoment, "00", "24");
			this.setState({ historicCurrentDay: daysBack })

			setTimeout(() => {
				this.setState({ loadingHistorics: false })
			}, 1000);
		};
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
	};

	_renderButtonsByHour = () => {
		let { historicCurrentDay } = this.state;
		moment.locale('es');

		let totalWeekArray = [0, 1, 2, 3, 4, 5, 6];

		return (
			<div style={{ display: "flex", justifyContent: "space-between" }}>
				{
					totalWeekArray.map((el) => {
						let buttonDate = moment().subtract(Math.abs(el - 6), 'days').startOf('date').format('ll');
						return (
							<button key={Math.abs(el - 6)} className={historicCurrentDay === Math.abs(el - 6) ? `btn btn-${(localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "secondary" : "primary"} ml-auto mr-auto mb-2` : `btn btn-${(localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "outline-secondary" : "outline-primary"} ml-auto mr-auto mb-2`} onClick={() => this._getHistoricsByHour(Math.abs(el - 6))} >{buttonDate.split(" de ")[0] + " " + buttonDate.split(" de ")[1].split(".")[0].slice(0, 1)[0].toUpperCase() + buttonDate.split(" de ")[1].split(".")[0].slice(1)}</button>
						);
					})
				}
			</div>
		)
	}

	_changeStatus = (changeStatus) => {
		this.setState({ moduleSearch: changeStatus });
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
							loadingRecord: false
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

	_changeShowLPR = () => {
		this.setState({ showLPR: !this.state.showLPR });
	};

	_searchHistorialConections = (cam_id, page) => {
		conections.getHistorialConection(cam_id, page).then(response => {
			if (response.data.success) {
				this.setState({ historialConections: response.data });
			};
		}).catch(err => {
			console.log(err);
			this.setState({ historialConections: null })
		})
	}

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

	_searchFilesAxxon = async (params) => {
		const { selectedCamera, /*historicCurrentDay*/ } = this.state;
		this.setState({ isAxxonSearch: true, loadingHistorics: true });
		let notificationFirstAlert = {
			message: "Aguarde unos segundos mientras se realiza la búsqueda de históricos.",
			level: "info",
			position: 'tc',
			title: "Búsqueda de históricos",
			autoDismiss: 35,
		};

		// this.addNotification(notificationFirstAlert);
		window.location.pathname !== "/cuadrantes" ? this.addNotification(notificationFirstAlert) : this.props.quadrantNotification(notificationFirstAlert);

		const payload = {
			cam_id: selectedCamera.id
		}

		const getArchives = await conections.getArchives(payload);

		if (getArchives.data.data) {
			let listAvailablefiles = getArchives.data.data;
			const filesIndex = listAvailablefiles.findIndex(el => el.accessPoint.includes("0:1"));

			let search = {
				cam_id: selectedCamera.id,
				begin: params.startDateTime,
				end: params.dateTimeEnd,
				archives: filesIndex > -1 ? [listAvailablefiles[filesIndex]] : listAvailablefiles,
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
						d.camera_id = selectedCamera.id;
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
				this.addNotification({ message, level, title });
				if (!this.state.moduleSearch) {
					this.setState({ isAxxonSearch: false });
				}
			}
			this.setState({ loadingHistorics: false });
		}
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

	_destroyFileVideos = async (loading = false, setNewState = true, lastState = this.state.qnapServer, typeMbox = false) => {
		if (setNewState) {

			if (typeMbox === 'axxon') {
				const historialTab = 1;
				this.setState({ activeIndex: historialTab, historialIndex: 0 });
			} else {
				this.setState({ activeIndex: 0, historialIndex: 0 });
			}

			this.setState({
				videos: [], video_history: [], photos: [], video_search: [], video_ssid: [],
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
		let { selectedCamera } = this.state;
		let camera = cam && cam.id ? cam : selectedCamera;
		let tipoMBOX = camera.dataCamValue.tipombox;

		// if (selectedCamera.id === 2) {

		let gridCameraControl = document.getElementById("gridCameraControl");
		gridCameraControl.style.height = "200px"

		if (destroyFiles) await this._destroyFileVideos(true, (onlyCurrent && onlyHistory && onlyPhotos), null, tipoMBOX);

		let dnsMbox = camera.dataCamValue.urlhistory;
		let isLPRCam = camera.dataCamValue.is_lpr;
		const dns_portMbox = camera.dataCamValue.urlhistoryport
		const protocol = camera.dataCamValue.protocolhistory
		const portApiStorage = camera.dataCamValue.UrlAPIStorage.port
		const secretKeyBody = {
			'apiKey': camera.dataCamValue.tokenhistory
		}
		const protocolStorage = String(camera.dataCamValue.UrlAPIStorage.ip_url).split("://")[0]
		const dnsStorage = String(camera.dataCamValue.UrlAPIStorage.ip_url).split("://")[1]
		const tokenStorage = String(camera.dataCamValue.UrlAPIStorage.secretkey).replace("?", "")

		if (camera.dataCamValue) {
			this._searchHistorialConections(camera.dataCamValue.id, 0);
		};

		this.setState({ apiStorageKey: camera.dataCamValue.UrlAPIStorage.secretkey, camURL: camera.dataCamValue, portContainer: camera.dataCamValue.urlhistoryport, dnsContainer: camera.dataCamValue.urlhistory, completeCamera: cam, typeMBOX: tipoMBOX, gridActive: true, })

		if (!isLPRCam) {
			this.setState({ showLPR: false });
		} else {
			this.setState({ showLPR: true });
		};

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
						if ((response.data.data.items.length > 0) || tipoMBOX === 'axxon') {
							let resHistory = response.data.data;
							this.setState({ resHistorySearch: resHistory, historicalPassword: resHistory.historicalPassword, historicalUser: resHistory.historicalUser, historyServerPort: resHistory.dns_port, historyServerDns: resHistory.dns_ip, historyServerProtocol: resHistory.protocol });
							if ((resHistory.items.length > 0) || tipoMBOX === 'axxon') {
								let dns_ip = dnsMbox
								let dns_port = dns_portMbox
								this.setState({ dns_portdnsPort: dns_port, dnsPort: dns_port });
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
			if (marker.extraData && removeSpaces(marker.extraData.dataCamValue.tipombox) === 'axxon') {
				const historialTab = 1;
				this.setState({ activeIndex: historialTab, historyLoading: true });
			}

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
			this.setState({ gridActive: false })
			setTimeout(() => {
				this._destroyFileVideos(true, true, this.state.qnapServer);
				this.setState({ autoplay: true, selectedCamera: {}, qnapServer: null, qnapChannel: null, gridActive: false });
			}, 950);
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

	componentDidUpdate(prevProps) {
		const { update, changeUpdate } = this.props
		const { update: updatePrev } = prevProps;

		if (update !== updatePrev) {
			if (update) {
				this.setState({ loadingUpdate: true })
				changeUpdate(false)
				this._openCameraInfo(false)
				setTimeout(() => {
					this.setState({ loadingUpdate: false });
				}, 2500);
			}
		}
	}

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
