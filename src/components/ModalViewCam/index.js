import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import HlsPlayer from '../HlsPlayer';
import WssPlayer from '../WssPlayer';
import './style.css';

class ModalViewCam extends Component {
	state = {};
	render() {
		let { modal, hide, dataCam } = this.props;
		return (
			<Modal show={modal} onHide={hide}>
				<Modal.Header closeButton>
					<p>Camara {dataCam.num_cam}</p>
				</Modal.Header>
				<Modal.Body style={{ height: '400px' }}>
					{dataCam.amazon_arn_channel ? (
						<WssPlayer
							channelARN={dataCam.amazon_arn_channel}
							num_cam={dataCam.num_cam}
						/>
					) : (
						<HlsPlayer
							reload={false}
							src={`http://${dataCam.UrlStreamMediaServer.ip_url_ms}:${dataCam.UrlStreamMediaServer
								.output_port}${dataCam.UrlStreamMediaServer.name}${dataCam.channel}`}
							num_cam={dataCam.num_cam}
						/>
					)}
				</Modal.Body>
			</Modal>
		);
	}
}

export default ModalViewCam;
