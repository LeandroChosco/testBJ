import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';
import { Modal, Form, Alert, Row, Col } from 'react-bootstrap';
import moment from 'moment';
import _ from 'lodash';

import NumberFormat from 'react-number-format';

class AdvancedSearchNotqnap extends Component {
	state = {
		showModal: false,
		endDate: '', // moment().subtract(2, 'd').format()
		startDate: '', // moment().subtract(2, 'd').format()
		startHour: '00',
		endHour: '23',
		error: '',
		estado: false
	};

	render() {
		let { showModal, startHour, endHour, error } = this.state;
		let { loading } = this.props;
		return (
			<div>
				<Button variant="info" disabled={loading} onClick={() => this.setState({ showModal: true })} basic circular >
					<i className="fa fa-search-plus" /> 
				</Button>

				{/* Modal */}
				<Modal show={showModal} onHide={this._onHide}>
					<Form onSubmit={(e) => this._onSubmit(e)}>
						<Modal.Header closeButton>Busqueda Avanzada</Modal.Header>
						<Modal.Body>
							{!_.isEmpty(error) && <Alert variant="danger">{error}</Alert>}
							<Form.Group as={Row} controlId="startDate">
								<Form.Label column sm="3">Fecha Inicio:</Form.Label>
								<Col sm="9">
									<Form.Control 
										required
										autoFocus
										type="date"
										onChange={(e) => this._onChange(e)}
									/>
								</Col>
							</Form.Group>
							<Form.Group as={Row} controlId="startHour">
								<Form.Label column sm="3">Hora Inicio:</Form.Label>
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
							<Form.Group as={Row} controlId="endDate">
								<Form.Label column sm="3">Fecha Fin:</Form.Label>
								<Col sm="9">
									<Form.Control 
										required
										type="date"
										onChange={(e) => this._onChange(e)}
									/>
								</Col>
							</Form.Group>
							<Form.Group as={Row} controlId="endHour">
								<Form.Label column sm="3">Hora Fin:</Form.Label>
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
						</Modal.Body>
						<Modal.Footer>
							<Button type="submit">Buscar</Button>
						</Modal.Footer>
					</Form>
				</Modal>
			</div>
		);
	}

	_onChange = (event) => {
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
		let { endDate, startDate, startHour, endHour, estado } = this.state;
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
		this.setState({ showModal: false, endDate: '', startDate: '', startHour: '00', endHour: '23', error: '' });
	};
}

export default AdvancedSearchNotqnap;
