import React, { Component } from 'react';
import { Card, Icon, Button, Input, Dropdown, Tab } from 'semantic-ui-react';
import ReactPlayer from 'react-player';
import moment from 'moment';

import './style.css';
import firebase from '../../constants/configSOS';
import MapContainer from '../../components/MapContainer';
import { COMPLAINT_COLLECTION } from '../../Api/sos';

const refSOS = firebase.app('sos').firestore().collection(COMPLAINT_COLLECTION);
const SEARCH_OPTIONS = [
	{
		key: 'calle',
		text: 'Calle',
		value: 'calle'
	}
];

class Complaint extends Component {
	state = {
		actIdx: -1,
		complaints: [],
		complaintId: undefined,
		filter: { active: false, search: '' },
		optionSelected: SEARCH_OPTIONS[0].value,
		loading: false
	};

	// React Lifecycle Methods
	componentDidMount() {
		const { complaints, match } = this.props;
		let complaintId = match.params.complaintId;
		if (complaints) this.setState({ complaints, complaintId });
	}
	componentDidUpdate(prevProps) {
		const { complaints: complaintsPrev } = prevProps;
		const { complaints, match } = this.props;
		let complaintId = match.params.complaintId;
		if (complaints !== complaintsPrev) {
			this.setState({ complaints });
			if (complaintId) {
				const complaint = complaints.find((d) => d.id === complaintId);
				const actIdx = complaints.findIndex((d) => d.id === complaintId);
				this._changeComplaint(complaint, actIdx, false);
			}
		}
	}
	componentWillUnmount() {
		this.setState({
			actIdx: 0,
			complaints: [],
			complaintId: undefined,
			filter: { active: false, search: '' },
			optionSelected: SEARCH_OPTIONS[0].value,
			loading: false
		});
	}

	render() {
		const { complaints, actIdx, loading } = this.state;
		return (
			<div className={'show-matches app-container'}>
				<div className="row fullHeight">
					<div className="col-4 listContainer">
						<Tab
							menu={{ pointing: true }}
							panes={[
								{
									menuItem: 'Solicitudes',
									render: () => (
										<Tab.Pane attached={false} style={styles.tab}>
											{this._renderListComplaints()}
										</Tab.Pane>
									)
								}
							]}
							defaultActiveIndex={0}
							onTabChange={() => {}}
						/>
					</div>
					<div className="col-8">
						<div className="mainContainer">
							{!loading && complaints && complaints[actIdx] ? (
								<div className="mapContainer">
									<h2 className="titleContainer" style={styles.headerContent}>
										Solicitud de Servicios
									</h2>
									<div className="row" style={styles.mapContent}>
										<div className="col" style={styles.allHeight}>
											<MapContainer
												options={{
													center: {
														lat: parseFloat(complaints[actIdx].ubicacion.latitud),
														lng: parseFloat(complaints[actIdx].ubicacion.longitud)
													},
													zoom: 15,
													mapTypeId: 'roadmap',
													zoomControl: false,
													mapTypeControl: false,
													streetViewControl: false,
													fullscreenControl: false,
													openConfirm: false,
													typeConfirm: false,
													openSelection: false,
													checked: ''
												}}
												onMapLoad={this._onMapLoad}
											/>
										</div>
										<div className="col camContainerComplaintDiv" style={styles.allHeight}>
											<Card style={styles.fileContainer}>
												<Card.Content
													style={
														complaints[actIdx].report_asset ? complaints[actIdx]
															.report_asset[0].type === 'image' ? (
															styles.divCenter
														) : null : (
															styles.divCenter
														)
													}
												>
													{complaints[actIdx].report_asset ? complaints[actIdx]
														.report_asset[0].type === 'image' ? (
														<img
															style={styles.file}
															src={complaints[actIdx].report_asset[0].path} // TODO cambiar si es mas de una imagen
															alt="img"
														/>
													) : (
														<ReactPlayer
															url={complaints[actIdx].report_asset[0].path}
															light={true}
															playing={true}
															controls={true}
															style={{ backgroundColor: '#000' }}
															width='100%'
															height='30vh'
														/>
													) : (
														<div>
															<p className="big-letter">No hay archivos que mostrar</p>
															<div align="center">
																<i className="fa fa-image fa-5x" />
															</div>
														</div>
													)}
												</Card.Content>
											</Card>
										</div>
									</div>
									<div className="row" style={styles.cardContainer}>
										<Card style={styles.allWidth}>
											<Card.Content>
												<div className="row" style={styles.detailContent}>
													<div className="col">
														<div className="row" style={styles.list}>
															<div className="col-9" style={styles.text}>
																<p className="big-letter">Detalles de la denuncia</p>
															</div>
															{complaints[actIdx].estado_queja === 'Pendiente' && (
																<div className="col">
																	<Button
																		icon
																		size="small"
																		labelPosition="left"
																		style={styles.allWidth}
																		onClick={() => this._changeStatus(complaints[actIdx], 'Atendido')}
																	>
																		<Icon name="checkmark" />
																		<b>Atender</b>
																	</Button>
																</div>
															)}
														</div>
														<hr />
														<div className="row">
															<div className="col" style={styles.text}>
																<p style={styles.title}>Estatus</p>
																<hr />
															</div>
															<div className="col" style={styles.text}>
																<p style={styles.title}>Lugar de la denuncia</p>
																<hr />
															</div>
														</div>
														<div>
															<div className="row">
																<div className="col" style={styles.text}>
																	<b>Estado: </b>
																	{complaints[actIdx].estado}
																</div>
																<div className="col" style={styles.text}>
																	<b>Calle: </b>
																	{complaints[actIdx].report_detail.lug_calle}
																</div>
															</div>
															<div className="row">
																<div className="col" style={styles.text}>
																	<b>Nota de estado: </b>
																	{complaints[actIdx].nota_estado ? (complaints[actIdx].nota_estado) : ('-')}
																</div>
																<div className="col" style={styles.text}>
																	<b>Número exterior: </b>
																	{complaints[actIdx].report_detail.lug_noext}
																</div>
															</div>
															<div className="row">
																<div className="col" style={styles.text}>
																	<b>Prefolio: </b>
																	{complaints[actIdx].prefolio}
																</div>
																<div className="col" style={styles.text}>
																	<b>Colonia: </b>
																	{complaints[actIdx].report_detail.lug_colonia}
																</div>
															</div>
															<div className="row">
																<div className="col" style={styles.text}>
																	<b>Folio: </b>
																	{complaints[actIdx].folio ? (complaints[actIdx].folio) : ('-')}
																</div>
																<div className="col" style={styles.text}>
																	<b>Delegación o Municipio: </b>
																	{complaints[actIdx].report_detail.lug_delmun}
																</div>
															</div>
															<div className="row">
																<div className="col" style={styles.text}>
																	<b>Fecha de creación: </b>
																	{moment(moment(complaints[actIdx].fecha_creacion)).format('DD-MM-YYYY, h:mm a')}
																</div>
																<div className="col" style={styles.text}>
																	&nbsp;
																</div>
															</div>
															<br />
															<div className="row">
																<div className="col" style={styles.text}>
																	<p style={styles.title}>Descripción de la denuncia</p>
																	<hr />
																</div>
															</div>
															<div className="row">
																<div className="col" style={styles.text}>
																	{this._getDescription(complaints[actIdx].report_detail.qja_desc_queja)}
																</div>
															</div>
														</div>
													</div>
												</div>
											</Card.Content>
										</Card>
									</div>
								</div>
							) : null
							// loading === true ? (
							// 	'Cargando...'
							// ) : (
							// 	'No se ha seleccionado ninguna solicitud de servicio'
							// )
						  }
						</div>
					</div>
				</div>
			</div>
		);
	}

	// -- Funciones --
	_renderListComplaints = () => {
		let { actIdx, complaints } = this.state;
		return (
			<div>
				<div style={styles.listFilter}>
					<Input
						placeholder="Buscar solicitudes de servicio"
						style={styles.flex2}
						onChange={this._onChange}
					/>
					<Dropdown
						placeholder="Buscar por"
						fluid
						selection
						options={SEARCH_OPTIONS}
						defaultValue={SEARCH_OPTIONS[0].value}
						onChange={() => {}}
						style={styles.flex1}
					/>
				</div>
				<div style={styles.listContent}>
					{complaints.map((complaint, idx) => (
						<Card
							className={idx === actIdx ? 'activeComplaint' : ''}
							style={styles.allWidth}
							key={idx}
							onClick={() => this._changeComplaint(complaint, idx)}
						>
							<Card.Content>
								<div style={styles.relative}>
									<div style={styles.list}>
										<h4>
											{complaint.es_anonimo ? (`Anonimo`) : (`${complaint.user.firstname} ${complaint.user.lastname}`)}
										</h4>
										<p>{moment(moment(complaint.fecha_creacion)).format('DD-MM-YYYY, h:mm a')}</p>
									</div>
									<div style={styles.list}>
										{complaint.read ? <b>&nbsp;</b> : <b style={styles.newCard}>Nuevo</b>}
										<small>
											<Icon
												name={complaint.estado_queja === 'Pendiente' ? 'clock' : 'checkmark'}
											/>
											<b>{complaint.estado_queja === 'Pendiente' ? 'No Atendido' : 'Atentido'}</b>
										</small>
									</div>
								</div>
							</Card.Content>
						</Card>
					))}
				</div>
			</div>
		);
	};
	_onChange = (event) => {
		const { target: { value } } = event;
		let { optionSelected } = this.state;
		let filter = { active: false, search: '' };
		if (value !== '') filter = { active: true, search: value.trim() };

		let searchComplaints = this.props.complaints;
		if (filter.active) {
			let expresion = new RegExp(`${filter.search}.*`, 'i');
			switch (optionSelected) {
				case 'calle':
					searchComplaints = searchComplaints.filter((c) => expresion.test(c.report_detail.lug_calle));
					break;
				default:
					searchComplaints = this.props.complaints;
			}
		}
		this.setState({ complaints: searchComplaints, filter });
	};
	_onMapLoad = (map) => {
		const { complaints, actIdx } = this.state;
		const coords = {
			lat: parseFloat(complaints[actIdx].ubicacion.latitud),
			lng: parseFloat(complaints[actIdx].ubicacion.longitud)
		};
		this.setState({ map: map });
		new window.google.maps.Marker({
			position: coords,
			map: map,
			title: complaints[actIdx].user_nicename
		});
	};
	_getDescription = (description) => {
		let reverseDescription = [ ...String(description) ].reverse().join('');
		let firstIndex = reverseDescription.indexOf('/');
		let getSecondblock = reverseDescription.substr(firstIndex + 1, reverseDescription.length - 1);
		let secondIndex = getSecondblock.indexOf('/');
		let printDescription = getSecondblock.substr(secondIndex + 1, reverseDescription.length - 1);
		let reinvestDescription = [ ...String(printDescription) ].reverse().join('');
		return reinvestDescription;
	};
	_changeComplaint = (complaint, actIdx, flag = true) => {
		if (flag) this.props.history.push(`/servicios/${complaint.id}`);
		if (complaint === undefined && actIdx === -1) {
			this.props.history.push('/servicios');
		} else {
			this.setState({ loading: true }, async () => {
				let complaintId = complaint.complaintId;
				if (!complaint.read) {
					await this._updateComplaint(complaint.id, { read: true });
				}
				this.setState({ actIdx, complaintId, loading: false });
			});
		}
	};
	_changeStatus = (complaint, status) => {
		this.setState({ loading: true }, async () => {
			await this._updateComplaint(complaint.id, { estado_queja: status });
			this.setState({ loading: false });
		});
	};
	_updateComplaint = async (id, params) => {
		try {
			let updComplaint = refSOS.doc(id).update(params);
			const data = await updComplaint.get();
			return {
				error: false,
				data: data,
				message: 'Se ha modificado la solicitud de servicios'
			};
		} catch (error) {
			return {
				error: true,
				message: error
			};
		}
	};
}

export default Complaint;

const styles = {
	tab: {
		backgroundColor: '#dadada',
		borderWidth: 0,
		borderColor: '#dadada'
	},
	headerContent: {
		height: '30px',
		color: '#fff',
		textAlign: 'center',
		backgroundColor: '#17a2b8',
		borderColor: '#17a2b8'
	},
	mapContent: {
		height: '33vh',
		margin: 0
	},
	allHeight: {
		height: '100%'
	},
	fileContainer: {
		width: '100%',
		height: '100%',
		display: 'flex'
	},
	divCenter: {
		display: 'flex',
		alignSelf: 'center',
		justifyContent: 'center',
		alignItems: 'center',
		alignContent: 'center'
	},
	file: {
		height: '30vh',
		width: '100%'
	},
	cardContainer: {
		margin: 0,
		width: '100%',
		height: '54vh',
		marginTop: '5px'
	},
	detailContent: {
		padding: '10px'
	},
	allWidth: {
		width: '100%'
	},
	title: {
		fontSize: 14
	},
	text: {
		fontSize: 13
	},
	listFilter: {
		display: 'flex',
		flexDirection: 'row'
	},
	flex2: {
		flex: 2
	},
	flex1: {
		flex: 1
	},
	listContent: {
		height: '81vh',
		padding: '20px',
		overflow: 'scroll',
		backgroundColor: '#dadada'
	},
	relative: {
		position: 'relative'
	},
	list: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	newCard: {
		fontSize: 8,
		color: 'white',
		padding: '5px',
		borderRadius: '10px',
		backgroundColor: 'red'
	}
};
