import React, { Component } from 'react';
import { Card, Button } from 'semantic-ui-react';
import { Modal } from 'react-bootstrap';

import Spinner from 'react-bootstrap/Spinner';
import ReactPlayer from 'react-player';
import axios from 'axios';

import constants from '../../constants/constants';

class MediaContainer extends Component {
	state = { modal: false, loading: false };

	render() {
		let { modal, loading } = this.state;
		let { isQnap, dns_ip, src, exists_image, exists_video, real_hour, covid, value, servidorMultimedia } = this.props;

		return (
			<div className={!covid ? 'mediaContainer col-6 p10' : 'col-3 p-3'}>
				<Card onClick={src !== '/images/no_video.jpg' ? () => this.setState({ modal: true }) : null}>
					{exists_video && (
						<div style={{ backgroundColor:'#000', width:'100%', height:120, display:'flex', justifyContent:'center', alignItems:'center' }}>
							<i style={{ color:'#fff' }} class="fa fa-play fa-3x" />
						</div>
					)}
					{exists_image && (
						<img
							src={
								covid ? (`${constants.sails_url}:${constants.sails_port}/${value.path}/${value.name}`)
									: (`${servidorMultimedia}:${constants.apiPort}/${src}`)
							}
							style={{ width: '100%' }}
							alt="img"
						/>
					)}
					{real_hour ? real_hour : null}
				</Card>

				{/* Modal */}
				{modal && (
					<Modal show={modal} onHide={() => this.setState({ modal: false })}>
						<Modal.Header closeButton>{
							loading ? (
								<div>
									<Button variant="primary" disabled>
										<Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" />
										Descargando...
									</Button>
								</div>
							) : (
								<div>
									<Button basic onClick={this._saveFile}><i className="fa fa-download" /> Descargar</Button>
									{!covid && !dns_ip && !isQnap && (
										<Button basic negative onClick={this._deleteFile}><i className="fa fa-trash" /> Eliminar</Button>
									)}
								</div>
							)
						}</Modal.Header>
						<Modal.Body>
							{exists_video && (
								<ReactPlayer
									url={
										isQnap ? (`${src}&open=normal`)
											: dns_ip ? (`${dns_ip}:${constants.apiPort}/${src}`)
												: (`${servidorMultimedia}:${constants.apiPort}/${src}`)
									}
									playing={true}
									controls={true}
									style={{ backgroundColor: '#000' }}
									config={{ file: { attributes: { controlsList: 'nodownload' } } }}
									width="100%"
								/>
							)}
							{exists_image ? (
								<img
									id="imagecontainerfrommedia"
									src={
										covid ? (`${constants.sails_url}:${constants.sails_port}/${value.path}/${value.name}`)
											: (`${servidorMultimedia}:${constants.apiPort}/${src}`)
									}
									style={{ width: '100%' }}
									crossOrigin={!isQnap}
									alt="img"
								/>
							) : null}
						</Modal.Body>
					</Modal>
				)}
			</div>
		);
	}

	_saveFile = async () => {
		this.setState({ loading: true });
		let { isQnap, dns_ip, src, exists_image, exists_video, covid, value, servidorMultimedia } = this.props;

		let response = {};
		response.file = (
			isQnap && !covid ? `${src}${exists_video ? '&open=forcedownload' : ''}`
				: covid ? `${constants.sails_url}:${constants.sails_port}/${value.relative_path}/${value.name}`
					: dns_ip ? `${dns_ip}:${constants.apiPort}/${src}` 
						: `${servidorMultimedia}:${constants.apiPort}/${src}`
		);

		if (isQnap && !covid && exists_video) {
			window.open(response.file);
		} else {
			const statusResponse = await fetch(response.file);
			if (statusResponse.status === 200) {
				window.saveAs(response.file, exists_video ? 'video.mp4' : exists_image ? 'image.jpg' : 'file');
			}
		}
		setTimeout(() => this.setState({ loading: false }), 300);
	};
	
	_deleteFile = async () => {
		let { cam, value, exists_video, exists_image } = this.props;
		let response = await axios.delete(`${constants.sails_url}:${constants.sailsPort}/cams/${cam.id}/${value.id}/1/V2`);
		if (response.data && response.data.success) {
			this.setState({ modal: false, display: 'none' });
			this.props.reloadData(cam, false, exists_video, false, exists_image);
		} else {
			alert(`Error al eliminar ${exists_image ? `imagen` : `video`}`);
		}
	};	
}

export default MediaContainer;
