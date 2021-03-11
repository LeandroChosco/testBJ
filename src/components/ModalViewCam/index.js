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
					{!dataCam.is_amazon_stream && dataCam.amazon_arn_channel ? (
						<WssPlayer
							channelARN={dataCam.amazon_arn_channel}
							region={dataCam.amazon_region}
							num_cam={dataCam.num_cam}
						/>
					) : (
						<HlsPlayer
							channelARN={dataCam.amazon_arn_channel}
							region={dataCam.amazon_region}
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
