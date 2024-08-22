import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';
import { Modal, Form, Alert, Row, Col } from 'react-bootstrap';
import moment from 'moment';
import _ from 'lodash';

import NumberFormat from 'react-number-format';
import { LANG, MODE } from '../../constants/token';

import './style.css'

const partOne = ['05', '10', '15', '20', '25', '30'];
const secondPart = ['35', '40', '45', '50', '55'];

const formatType = [
	{
		id: 1,
		type: 'mkv',
		name: 'MKV',
		description: 'Descarga Rápida'
	},
	{
		id: 2,
		type: 'avi',
		name: 'AVI',
		description: 'Descarga Lenta'
	},
	{
		id: 3,
		type: 'mp4',
		name: 'MP4',
		description: 'Descarga Lenta'
	},
	{
		id: 4,
		type: 'jpg',
		name: 'JPG',
		description: 'Descarga Rápida'
	}
];

class AdvancedSearchNotqnap extends Component {
	state = {
		showModal: false,
		endDate: moment().startOf('date').format('YYYY-MM-DD'), // moment().subtract(2, 'd').format()
		startDate: moment().startOf('date').format('YYYY-MM-DD'), // moment().subtract(2, 'd').format()
		startHour: '00',
		endHour: '23',
		error: '',
		estado: false,
		startDateTime: '',
		dateTimeEnd: '',
		format: 'mkv',
		startMinutes: "00",
		endMinutes: '05',
	};



	render() {
		let { showModal, startHour, endHour, error, format, startMinutes, endDate, startDate } = this.state;
		let { loading, navButton, isAxxon } = this.props;
		const minutes = startMinutes === '00' ? partOne : secondPart;

		return (
			<div>
				{navButton ?
					<Button className='btn-custom-style actions-btn-grid' variant="info" disabled={loading} onClick={() => this._openModal()} basic circular >
						<i className="fa fa-search-plus" style={{color: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "#b3b3b3" : "#666666", transition: "all 0.2s linear"}} />
						<p style={{ marginTop: "0.2rem", color: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "#b3b3b3" : "#666666", transition: "all 0.2s linear" }}>Búsqueda avanzada</p>
					</Button>
					:
					<button className={`btn btn-${(localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "secondary" : "outline-primary"} ml-auto mr-auto mb-2`} onClick={() => this._openModal()} >{localStorage.getItem(LANG) === "english" ? "Advanced Search" : 'Búsqueda Avanzada'}</button>
				}

				{/* Modal */}
				<Modal show={showModal} onHide={this._onHide}>
					<Form onSubmit={(e) => this._onSubmit(e)}>
						<Modal.Header style={{ background: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "var(--dark-mode-color)" : "white", color: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "white" : "#666666" }}>{localStorage.getItem(LANG) === "english" ? "Advanced search" : "Búsqueda avanzada"}</Modal.Header>
						<Modal.Body style={{ background: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "var(--dark-mode-color)" : "white", color: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "white" : "#666666" }}>
							{!_.isEmpty(error) && <Alert variant="danger">{error}</Alert>}
							<>
								{
									!isAxxon ?
										<Form.Group as={Row} controlId="startDate">
											<Form.Label column sm="3">{localStorage.getItem(LANG) === "english" ? "Start date" : "Fecha de inicio:"}</Form.Label>
											<Col sm="9">
												<Form.Control
													required
													autoFocus
													type="date"
													onChange={(e) => this._onChange(e)}
												/>
											</Col>
										</Form.Group>
										:
										<Form.Group as={Row} controlId="startDate">
											<Form.Label column sm="3">{localStorage.getItem(LANG) === "english" ? "Start date" : "Fecha de inicio:"}</Form.Label>
											<Col sm="9">
												<Form.Control
													required
													autoFocus
													type="date"
													value={startDate}
													onChange={(e) => this.setState({ startDate: e.target.value, endDate: e.target.value })}
												/>
											</Col>
										</Form.Group>
								}
								{
									!isAxxon ?
										<Form.Group as={Row} controlId="startHour">
											<Form.Label column sm="3">{localStorage.getItem(LANG) === "english" ? "Start hour" : "Hora de inicio:"}</Form.Label>
											<Col sm="9">
												<NumberFormat
													mask="_"
													format="##:00"
													value={startHour}
													className="form-control"
													onValueChange={(e) => this.setState({ startHour: e.value })}
												/>
											</Col>
										</Form.Group>
										:
										<>
											<Form.Group as={Row} controlId="startHour" >
												<Form.Label column sm="3">{localStorage.getItem(LANG) === "english" ? "Start hour" : "Hora de inicio:"}</Form.Label>
												<Col sm="6">
													<NumberFormat
														format="##"
														required
														className="form-control"
														max={2}
														onValueChange={(e) => this.setState({ endHour: e.value, startHour: e.value, endMinutes: minutes[0] })}
													/>
												</Col>
												<Col sm='3'>
													<Form.Text muted>
														AM: 0 - 11
													</Form.Text>
													<Form.Text muted>
														PM: 12 - 23
													</Form.Text>
												</Col>
											</Form.Group>
											<Form.Group as={Row} controlId="startMinutes">
												<Form.Label column sm="3">{localStorage.getItem(LANG) === "english" ? "Start minutes" : "Minutos iniciales:"}</Form.Label>
												<Col sm="3">
													<Form.Control as='select' onChange={(e) => this._onChange(e)}>
														<option value="00">00</option>
														<option value="30">30</option>
													</Form.Control>
												</Col>
											</Form.Group>
										</>
								}
								{
									!isAxxon ?
										<Form.Group as={Row} controlId="endDate">
											<Form.Label column sm="3">{localStorage.getItem(LANG) === "english" ? "End date" : "Fecha de fin:"}</Form.Label>
											<Col sm="9">
												<Form.Control
													required
													type="date"
													onChange={(e) => this._onChange(e)}
												/>
											</Col>
										</Form.Group>
										:
										<Form.Group as={Row} controlId='endDate'>
											<Form.Label column sm="3">{localStorage.getItem(LANG) === "english" ? "End date" : "Fecha de fin:"}</Form.Label>
											<Col sm="9">
												<Form.Control
													required
													type="date"
													disabled
													value={endDate}
												/>
											</Col>
										</Form.Group>
								}
								{
									!isAxxon ?
										<Form.Group as={Row} controlId="endHour">
											<Form.Label column sm="3">{localStorage.getItem(LANG) === "english" ? "End hour" : "Hora de fin:"}</Form.Label>
											<Col sm="9">
												<NumberFormat
													mask="_"
													format="##:00"
													value={endHour}
													className="form-control"
													onValueChange={(e) => this.setState({ endHour: e.value })}
												/>
											</Col>
										</Form.Group>
										:
										<>
											<Form.Group as={Row} controlId="endHour" >
												<Form.Label column sm="3">{localStorage.getItem(LANG) === "english" ? "End hour" : "Hora de fin:"}</Form.Label>
												<Col sm="9">
													<NumberFormat
														value={endHour}
														disabled
														format="##"
														className="form-control"
													/>

												</Col>
											</Form.Group>
											<Form.Group as={Row} controlId="endMinutes">
												<Form.Label column sm="3">{localStorage.getItem(LANG) === "english" ? "Final minutes:" : "Minutos finales:"}</Form.Label>
												<Col sm="3">
													<Form.Control as="select" onChange={(e) => this._onChange(e)}>
														{
															minutes.map((f) => (
																<option value={f}>{f}</option>
															))
														}
													</Form.Control>
												</Col>
											</Form.Group>
										</>
								}
								{
									isAxxon &&
									<Form.Group as={Row} controlId="format">
										<Form.Label column sm="3">{localStorage.getItem(LANG) === "english" ? "Format:" : "Formato"}</Form.Label>
										<Col sm="9">
											<Form.Control as="select" onChange={(e) => this._onChange(e)} value={format}>
												{
													formatType.map((f, idx) => (
														<option value={f.type} key={idx}>{f.name} - {f.description}</option>
													))
												}
											</Form.Control>
										</Col>
									</Form.Group>
								}
							</>
						</Modal.Body>
						<Modal.Footer style={{ background: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "var(--dark-mode-color)" : "white", color: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "white" : "#666666" }}>
							<Button type="submit">{localStorage.getItem(LANG) === "english" ? "Search" : "Buscar"}</Button>
						</Modal.Footer>
					</Form>
				</Modal>
			</div>
		);
	}

	_openModal = () => {
		const { isAxxon } = this.props;
		const currentDate = moment().startOf('date').format('YYYY-MM-DD');
		if (isAxxon) {
			this.setState({ endHour: '' })
		}
		this.setState({ showModal: true, startDate: currentDate, endDate: currentDate });
	}
	_onChange = (event) => {
		if (event.target.id === "startMinutes") {
			let startMinutes = event.target.value;
			const minutes = startMinutes === '00' ? partOne : secondPart;
			this.setState({ endMinutes: minutes[0] })
		}
		this.setState({ [event.target.id]: event.target.value });
	};
	_onHide = () => {
		this.setState({
			showModal: false,
			endDate: '',
			startDate: '',
			startHour: '00',
			endHour: '23',
			error: ''
		})
	}
	_onSubmit = (event) => {
		event.preventDefault();
		let { endDate, startDate, startHour, endHour, estado, format, startMinutes, endMinutes } = this.state;
		const { isAxxon, _searchFilesAxxon, moduleSearch } = this.props;

		if (!isAxxon) {
			let currrentDate = moment().startOf('date').format('YYYY-MM-DD');
			let slStartDate = moment(startDate).startOf('date').format('YYYY-MM-DD');
			let slEndDate = moment(endDate).startOf('date').format('YYYY-MM-DD');

			if (slStartDate > currrentDate || slEndDate > currrentDate) return this.setState({ error: `La fecha no puede ser mayor a hoy.` });
			if (moment(endDate).startOf('date').diff(moment(startDate).startOf('date'), 'days') > 9) return this.setState({ error: `No puede solicitar mas de 9 días.` });


			let start = parseInt(startHour, 10), end = parseInt(endHour, 10);
			if (slStartDate > slEndDate) return this.setState({ error: `Las fecha de inicio no puede ser mayor a la fecha de fin.` });
			if (start > 23 || end > 23) return this.setState({ error: `Las horas ingresadas no son válidas. (00:00-23:00)` });
			if (start > end && slStartDate === slEndDate) return this.setState({ error: `Las hora de inicio no puede ser mayor a la hora de fin.` });
			if (end === start && slStartDate === slEndDate) return this.setState({ error: `Debe ingresar horas diferentes.` });
			end += 1;

			let dates = [];
			while (slStartDate <= slEndDate) {
				dates.push(slStartDate);
				slStartDate = moment(slStartDate).add(1, 'd').format('YYYY-MM-DD');
			}

			endHour = `${end < 10 ? `0${end}` : end}`;
			let stateNames = { loading: 'searchLoading', list: 'video_search' };
			this.props._searchFileVideos(dates, startHour, endHour, stateNames);
			estado = true
			this.props.moduleSearch(estado)
		} else {
			let startDateTime = `${startDate} ${startHour}:${startMinutes}`;
			let dateTimeEnd = `${endDate} ${endHour}:${endMinutes}`;
			const startTime = moment(startDateTime, ['YYYY-MM-DD HH:mm', 'YYYY-MM-DD H:mm']);
			const endTime = moment(dateTimeEnd, ['YYYY-MM-DD HH:mm', 'YYYY-MM-DD H:mm']);
			const totalMinutes = endTime.diff(startTime, 'minutes');
			const minutesAllowed = 30;
			let currrentDate = moment().format('YYYY-MM-DD HH:mm');
			let slStartDate = moment(startDateTime, ['YYYY-MM-DD HH:mm', 'YYYY-MM-DD H:mm']).format('YYYY-MM-DD HH:mm');
			let slEndDate = moment(dateTimeEnd, ['YYYY-MM-DD HH:mm', 'YYYY-MM-DD H:mm']).format('YYYY-MM-DD HH:mm');
			let start = parseInt(startHour, 10), end = parseInt(endHour, 10);
			if (start > 23 || end > 23) return this.setState({ error: `Las horas ingresadas no son válidas. (00-23)` });
			if (totalMinutes > minutesAllowed) return this.setState({ error: `Excede los 30 minutos permitidos de búsqueda.` });
			if (slStartDate > currrentDate || slEndDate > currrentDate) return this.setState({ error: `La fecha de busqueda no puede ser mayor a la fecha y hora actual.` });
			if (slStartDate > slEndDate) return this.setState({ error: `La fecha de inicio no puede ser mayor a la fecha fin.` });
			if (slStartDate === slEndDate) return this.setState({ error: `La fecha de inicio no puede ser igual a la fecha fin.` });
			const data = {
				startDateTime,
				dateTimeEnd,
				search_axxon: true,
				format
			}
			_searchFilesAxxon(data);
			const search = true
			moduleSearch(search)
		}
		this.setState({ showModal: false, endDate: '', startDate: '', startHour: '00', endHour: '23', error: '', endMinutes: '', startMinutes: '00', format: 'mkv' });
	};
}

export default AdvancedSearchNotqnap;
