import React from 'react';
import { Card, Divider } from 'semantic-ui-react';
import moment from 'moment';

export default class ComplaimentItem extends React.Component {
	state = {
		description: ''
	};

	componentDidMount() {
		let { info } = this.props;
		let description = info.report_detail.qja_desc_queja;
		let reverseDescription = [ ...String(description) ].reverse().join('');
		let firstIndex = reverseDescription.indexOf('/');
		let getSecondblock = reverseDescription.substr(firstIndex + 1, reverseDescription.length - 1);
		let secondIndex = getSecondblock.indexOf('/');
		let printDescription = getSecondblock.substr(secondIndex + 1, reverseDescription.length - 1);
		let reinvestDescription = [ ...String(printDescription) ].reverse().join('');
		this.setState({ description: reinvestDescription });
	}

	render() {
		const { info } = this.props;
		let { description } = this.state;
		return (
			<Card style={{ marginTop: '10px', padding: 0, width: '100%' }} onClick={this._godetails}>
				<Card.Content style={{ paddingBottom: 0 }}>
					<Card.Description>
						<div className="row" style={{ fontSize: '.8rem', position: 'relative' }}>
							<div className="col-12" align="left">
								<div align="right">{moment(info.fecha_creacion).format('DD-MM-YYYY HH:mm')}</div>
								{info.es_anonimo ? null : (
									<div className="row">
										<div className="col-5">
											<b>Nombre:</b>
										</div>
										<div className="col-7">{`${info.user.firstname} ${info.user.lastname}`}</div>
									</div>
								)}
								<Divider />
								<div className="row">
									<div className="col-5">
										<b>Descripción:</b>
									</div>
									<div className="col-7">{description}</div>
								</div>
								<Divider />
								<div className="row">
									<div className="col-5">
										<b>Prefolio:</b>
									</div>
									<div className="col-7">{info.prefolio}</div>
								</div>
								<div align="right" style={{ fontSize: '1.2rem' }}>
									<span
										className={
											info.estado_queja === 'Pendiente' ? (
												'badge badge-warning'
											) : (
												'badge badge-success'
											)
										}
									>
										{info.estado_queja === 'Pendiente' ? 'No Antentido' : 'Atentido'}
									</span>
								</div>
							</div>
						</div>
					</Card.Description>
				</Card.Content>
			</Card>
		);
	}

	_godetails = () => {
		if (this.props.toggleControls) {
			this.props.toggleControls();
		}
		return (window.location.href = window.location.href
			.replace(window.location.search, '')
			.replace(window.location.hash, '')
			.replace(window.location.pathname, `/servicios/${this.props.info.id}`));
	};
}
