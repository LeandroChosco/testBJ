import React, { Component } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import * as KNSFunctions from '../../functions/getAmazonKinesisWss';

class WssPlayer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			error: '',
			viewer: {},
			showVideo: false
		};
	}

	componentDidMount() {
		let { num_cam } = this.props;
		this._fetchData(document.getElementsByClassName(`wssPlayer${num_cam}`)[0]);
	}

	componentWillUnmount() {
		let { viewer } = this.state;
		KNSFunctions.StopViewer(viewer);
	}

	render() {
		let { error, showVideo } = this.state;
		let { num_cam, height: hProps, width: wProps } = this.props;
		return (
			<div>
				<div className={showVideo && error === '' ? '' : 'd-none'}>
					<video
						controls
						id={`wssPlayer${num_cam}`}
						className={`wssPlayer${num_cam} dnone`}
						style={{ width: wProps ? wProps : '100%', height: hProps ? hProps : '100%', backgroundColor: 'black' }}
					/>
				</div>
				{!showVideo &&
				error === '' && (
					<Spinner animation="border" variant="info" role="status" size="xl">
						<span className="sr-only">Loading...</span>
					</Spinner>
				)}
				{error !== '' && error}
			</div>
		);
	}

	_fetchData = async (localView) => {
		let { viewer } = this.state;
		let { num_cam } = this.props;
		viewer.localView = localView;
		let iceServers = await KNSFunctions.GenerateIceServersForViewer(this.props, viewer);
		const CONF = { iceServers };
		viewer.peerConnection = new RTCPeerConnection(CONF);

		// Poll for connection stats
		// viewer.peerConnectionStatsInterval = setInterval(() => viewer.peerConnection.getStats(), 1000);
		viewer.signalingClient.on('open', async () => {
			// Create an SDP offer to send to the master
			await viewer.peerConnection.setLocalDescription(
				await viewer.peerConnection.createOffer({
					offerToReceiveAudio: true,
					offerToReceiveVideo: true
				})
			);
		});
		viewer.signalingClient.on('sdpAnswer', async (answer) => {
			// Add the SDP answer to the peer connection
			await viewer.peerConnection.setRemoteDescription(answer);
		});
		viewer.signalingClient.on('iceCandidate', (candidate) => {
			// Add the ICE candidate received from the MASTER to the peer connection
			viewer.peerConnection.addIceCandidate(candidate);
		});
		viewer.signalingClient.on('close', () => {
			// Disconnected from signaling channel
			this.setState({ error: 'Error: No se ha podido conectar con el stream.' });
			KNSFunctions.StopViewer(viewer);
		});
		viewer.signalingClient.on('error', (error) => {
			// Signaling client error
			this.setState({ error: 'Error: No se ha podido conectar con el stream.' });
			KNSFunctions.StopViewer(viewer);
		});

		// Listeners
		viewer.peerConnection.addEventListener('icecandidate', ({ candidate }) => {
			// Send any ICE candidates to the other peer
			if (!candidate) viewer.signalingClient.sendSdpOffer(viewer.peerConnection.localDescription);
		});
		viewer.peerConnection.addEventListener('track', (event) => {
			// As remote tracks are received, add them to the remote view
			if (localView && localView.srcObject) return;
			viewer.remoteStream = event.streams[0];
			localView.srcObject = viewer.remoteStream;
			this.setState({ showVideo: true });
			document.getElementById(`wssPlayer${num_cam}`).autoplay = true;
		});

		viewer.signalingClient.open();

		setTimeout(() => {
			if (!this.state.showVideo) {
				this.setState({ error: 'Error: No se ha podido conectar con el stream.' });
				KNSFunctions.StopViewer(viewer);
			}
		}, 5000);
	};
}

export default WssPlayer;
