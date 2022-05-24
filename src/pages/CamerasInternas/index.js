import React, { Component, Fragment } from 'react';
import { ToggleButton, ToggleButtonGroup, Modal } from 'react-bootstrap';
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
 marginBottom : 10
}
}
class CamarasInternas extends Component {
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
			{ menuItem: 'Camaras', render: () => <Tab.Pane attached={false}>{this._renderOnlineTab()}</Tab.Pane> }
		],
		offlineCamaras: [],
		disconnectedCameras: [],
		camerasQnap: [],
    showSearch: false,
    is_filter: false,
    filterData: [],
    activeIndex: TAB.ONLINE,
    filterOnLine:false,
    filterOff:false,
    filterDiss:false
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
    const { loading, panes, activeIndex } = this.state;
		return (
			<div>
				{loading ? (
					<div style={{ position: 'absolute', top: '30%', background: 'transparent', width: '100%' }} align="center">
						{/* <JellyfishSpinner size={250} color="#686769" loading={loading} /> */}
						<img
							className="spinner"
							src={constants.urlPath}
							style={{ width: "10%", borderRadius: "50%" }}
							alt={constants.urlPath} />
					</div>
				) : (
					<div id="analisis_holder" className={!this.props.showMatches ? 'hide-matches' : 'show-matches'}>
            <Tab menu={{ secondary: true, pointing: true }} panes={panes} onTabChange={this.handleChangeTab} defaultActiveIndex={activeIndex} />
            {this._renderModals()}
            {this._searchModal()}
					</div>
				)}
			</div>
		);
	}

  handleChangeTab = (e, data, ) => {
    this.setState({ activeIndex: data.activeIndex });
  }

  _filterButtons = (data, is_visible ) => {
    return (
      <div style={styles.tab} className='col-12'>
        { (data.length > 0 || is_visible) &&<Button onClick={() => this.setState({ showSearch: true })} basic >Filtrar</Button>}
        {( is_visible) && <Button onClick={() => this._loadCameras()} basic>Limpiar filtro</Button>}
      </div>
    )
  }

	// Components Render
	
	_renderOnlineTab = () => {
    let { displayTipe, loading, cameraID, places } = this.state;
    return (
      <Fragment>
        {displayTipe !== 3 && !loading ? (
        <Fragment>
        
        {
          places.length > 0 &&
					<div className="toggleViewButton row">
						<ToggleButtonGroup className="col-12" type="radio" name="options" defaultValue={2} onChange={this._changeDisplay} value={displayTipe}>
							
							
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
				<Modal size="lg" show={modalProblem} onHide={() => this.setState({ modalProblem: false, cameraProblem: {}, problemDescription: '', phones: [], mails: [] })}>
					<Modal.Header closeButton>Reportar problema en camara {cameraProblem.num_cam}</Modal.Header>
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
							{typeReport !== 2 && (
								<Form.Field>
									<Label>
										Se notificara a los numeros de emergencia registrados. Si se desea agregar un
										telefono extra ingreselo aqui indicando la lada del mismo(+525512345678).
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
										Se notificara a los emails de emergencia registrados. Si se desea agregar un
										email extra ingreselo aqui.
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
										Se lo mas claro posible, indique si ha realizado alguna accion para intentar
										resolver el problema.
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
				<Modal size="lg" show={modal} onHide={() => this.setState({ modal: false })}>
					<Modal.Header closeButton>Grabacion terminada</Modal.Header>
					<Modal.Body>{recordMessage}</Modal.Body>
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
					alert('Ticket creado correctamente');
				} else {
					alert('Error al crear ticket');
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
					<GridCameraDisplay
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
						activeHideButton={true}
            is_filter={activeIndex === TAB.ONLINE ? filterOnLine : false }
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

				if (camera.urlHistoryPort ) {
					if (camera.urlHistoryPort != null){
						portCam = camera.urlHistoryPort
					}else{
						portCam = "3000"
					}
				}else{
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

				if (camera.urlHistoryPort ) {
					if (camera.urlHistoryPort != null){
						portCam = camera.urlHistoryPort
					}else{
						portCam = "3000"
					}
				}else{
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
    this.setState({ loading: true, is_filter: false, filterData: [], activeIndex: 0, filterButton:false, filterOnLine:false, filterDiss:false, filterOff:false });
		conections.getCamerasInternal()
			.then((response) => {
                
				const camaras = response.data.data;
				let auxCamaras = [];
				let offlineCamaras = [];
				let disconnectedCameras = [];
				let actualCamera = {};
				let title = '';
				let idCamera = null;
				let index = 1;

				camaras.map((value) => {
					if (value.active === 1 && value.flag_streaming === 1 && value.UrlStreamMediaServer ) {
						var urlHistory = null
						var urlHistoryPort = null

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
							name: `${value.street} ${value.number}, ${value.township}, ${value.town}, ${value.state} #cam${value.num_cam}`,
							rel_cuadrante: value.RelCuadranteCams,
							isHls: true,
							url: `http://${value.UrlStreamMediaServer.ip_url_ms}${value.UrlStreamMediaServer.output_port ? `:${value.UrlStreamMediaServer.output_port}` : null}${value.UrlStreamMediaServer.name}${value.channel}`,
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
									url: `http://${value.UrlStreamMediaServer.ip_url_ms}${value.UrlStreamMediaServer.output_port ? `:${value.UrlStreamMediaServer.output_port}` : null}${value.UrlStreamMediaServer.name}${value.channel}`,
									real_num_cam:
										value.num_cam < 10 ? '0' + value.num_cam.toString() : value.num_cam.toString(),
									camera_number: value.num_cam,
									dataCamValue: value
								};
								idCamera = value.id;
							}
						}
					} /*else {

                      if(value.active === 1 ){
                          offlineCamaras.push({
                              id:value.id,
                              num_cam:indexFail,
                              lat:value.google_cordenate.split(',')[0],
                              lng:value.google_cordenate.split(',')[1],
                              name: value.street +' '+ value.number + ', ' + value.township+ ', ' + value.town+ ', ' + value.state + ' #cam' + value.num_cam,
                              isHls:true,
                              url: 'http://' + value.UrlStreamMediaServer.ip_url_ms + ':' + value.UrlStreamMediaServer. output_port + value.UrlStreamMediaServer. name + value.channel,
                              real_num_cam:value.num_cam<10?('0'+value.num_cam.toString()):value.num_cam.toString(),
                              camera_number:value.num_cam,
                              dataCamValue: value
                          })   
                          indexFail++
                      }                        
                  }*/
					return true;
				});

				
				

				if (idCamera === null) {
					this.setState({
						places: auxCamaras,
						disconnectedCameras: disconnectedCameras,
						loading: false,
						error: undefined
					});
				} else {
					this.setState({
						places: auxCamaras,
						disconnectedCameras: disconnectedCameras,
						loading: false,
						cameraID: idCamera,
						actualCamera: { title: title, extraData: actualCamera },
						error: undefined
					});
					this.setState({ displayTipe: 3 });
				}

				if (idCamera === null) {
					this.setState({
						places: auxCamaras,
						offlineCamaras: offlineCamaras,
						loading: false,
						error: undefined
					});
				} else {
					this.setState({
						places: auxCamaras,
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
        console.log("error ", error)
				this.setState({ loading: false, error: 'Error de conexion' });
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

  _searchModal = () => {
    return (
      <SearchCamera
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

 

}

export default CamarasInternas;
