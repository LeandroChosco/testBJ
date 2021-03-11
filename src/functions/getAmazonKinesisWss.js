import AWS from 'aws-sdk';
import KEYS from '../constants/amazonKeys';
import { SignalingClient } from 'amazon-kinesis-video-streams-webrtc';

export const GenerateIceServersForMaster = async (props, master) => {
	// Get signaling channel ARN
	const CONF = {
		region: props.region ? props.region : KEYS.REGION,
		accessKeyId: KEYS.ACCESS_KEY_ID,
		secretAccessKey: KEYS.SECRET_ACCESS_KEY
	};
	const CHANNEL_ARN = props.channelARN;
	const KNS_VIDEO_CLIENT = new AWS.KinesisVideo({ ...CONF, endpoint: null });

	// Get signaling channel endpoints
	const SIGN_CHANNEL_ENDPOINT_RESP = await KNS_VIDEO_CLIENT.getSignalingChannelEndpoint({
		ChannelARN: CHANNEL_ARN,
		SingleMasterChannelEndpointConfiguration: {
			Protocols: [ 'WSS', 'HTTPS' ],
			Role: 'MASTER'
		}
	}).promise();
	const ENDPOINTS_PTCL = SIGN_CHANNEL_ENDPOINT_RESP.ResourceEndpointList.reduce((endpoints, endpoint) => {
		endpoints[endpoint.Protocol] = endpoint.ResourceEndpoint;
		return endpoints;
	}, {});

	// Create Signaling Client
	master.signalingClient = new SignalingClient({
		channelARN: CHANNEL_ARN,
		channelEndpoint: ENDPOINTS_PTCL.WSS,
		role: 'MASTER',
		region: CONF.region,
		credentials: {
			accessKeyId: CONF.accessKeyId,
			secretAccessKey: CONF.secretAccessKey
		},
		systemClockOffset: KNS_VIDEO_CLIENT.config.systemClockOffset
	});

	// Get ICE server configuration
	const KNS_VD_SING_CHANNEL_CLIENT = new AWS.KinesisVideoSignalingChannels({
		...CONF,
		endpoint: ENDPOINTS_PTCL.HTTPS,
		correctClockSkew: true
	});
	const ICESERVER_RESP = await KNS_VD_SING_CHANNEL_CLIENT.getIceServerConfig({ ChannelARN: CHANNEL_ARN }).promise();
	const iceServers = [];
	// use either
	iceServers.push({ urls: `stun:stun.kinesisvideo.${CONF.region}.amazonaws.com:443` });
	// OR
	ICESERVER_RESP.IceServerList.forEach((iceServer) =>
		iceServers.push({
			urls: iceServer.Uris,
			username: iceServer.Username,
			credential: iceServer.Password
		})
	);
	return iceServers;
};

// stop master
export const StopMaster = (master) => {
	if (master.signalingClient) {
		master.signalingClient.close();
		master.signalingClient = null;
	}
	if (master.peerConnection) {
		master.peerConnection.close();
		master.peerConnection = null;
	}
	if (master.localStream) {
		master.localStream.getTracks().forEach((track) => track.stop());
		master.localStream = null;
	}
	if (master.remoteStream) {
		master.remoteStream.getTracks().forEach((track) => track.stop());
		master.remoteStream = null;
	}
	if (master.localView) {
		master.localView.srcObject = null;
	}
};

export const getRandomClientId = () => Math.random().toString(36).substring(2).toUpperCase();

export const GenerateIceServersForViewer = async (props, viewer) => {
	// Get signaling channel ARN
	const CONF = {
		region: props.region ? props.region : KEYS.REGION,
		accessKeyId: KEYS.ACCESS_KEY_ID,
		secretAccessKey: KEYS.SECRET_ACCESS_KEY
	};
	const CHANNEL_ARN = props.channelARN;
	const KNS_VIDEO_CLIENT = new AWS.KinesisVideo({ ...CONF, endpoint: null });

	// Get signaling channel endpoints
	const SIGN_CHANNEL_ENDPOINT_RESP = await KNS_VIDEO_CLIENT.getSignalingChannelEndpoint({
		ChannelARN: CHANNEL_ARN,
		SingleMasterChannelEndpointConfiguration: {
			Protocols: [ 'WSS', 'HTTPS' ],
			Role: 'VIEWER'
		}
	}).promise();
	const ENDPOINTS_PTCL = SIGN_CHANNEL_ENDPOINT_RESP.ResourceEndpointList.reduce((endpoints, endpoint) => {
		endpoints[endpoint.Protocol] = endpoint.ResourceEndpoint;
		return endpoints;
	}, {});

	const KNS_VD_SING_CHANNEL_CLIENT = new AWS.KinesisVideoSignalingChannels({
		...CONF,
		endpoint: ENDPOINTS_PTCL.HTTPS,
		correctClockSkew: true
	});

	// Get ICE server configuration
	const ICESERVER_RESP = await KNS_VD_SING_CHANNEL_CLIENT.getIceServerConfig({
		ChannelARN: CHANNEL_ARN
	}).promise();
	const iceServers = [];
	iceServers.push({ urls: `stun:stun.kinesisvideo.${CONF.region}.amazonaws.com:443` });
	ICESERVER_RESP.IceServerList.forEach((iceServer) =>
		iceServers.push({
			urls: iceServer.Uris,
			username: iceServer.Username,
			credential: iceServer.Password
		})
	);

	// Create Signaling Client
	viewer.signalingClient = new SignalingClient({
		channelARN: CHANNEL_ARN,
		channelEndpoint: ENDPOINTS_PTCL.WSS,
		clientId: getRandomClientId(),
		role: 'VIEWER',
		region: CONF.region,
		credentials: CONF,
		systemClockOffset: KNS_VIDEO_CLIENT.config.systemClockOffset
	});
	return iceServers;
};

// stop viewer
export const StopViewer = (viewer) => {
	if (viewer.signalingClient) {
		viewer.signalingClient.close();
		viewer.signalingClient = null;
	}
	if (viewer.peerConnection) {
		viewer.peerConnection.close();
		viewer.peerConnection = null;
	}
	if (viewer.localStream) {
		viewer.localStream.getTracks().forEach((track) => track.stop());
		viewer.localStream = null;
	}
	if (viewer.remoteStream) {
		viewer.remoteStream.getTracks().forEach((track) => track.stop());
		viewer.remoteStream = null;
	}
	if (viewer.localView) {
		viewer.localView.srcObject = null;
	}
};
