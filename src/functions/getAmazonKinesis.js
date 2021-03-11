import AWS from 'aws-sdk';
import KEYS from '../constants/amazonKeys';

export const GetHlsStream = async (props) => {
	// Get signaling channel ARN
	const CONF = {
		region: props.region ? props.region : KEYS.REGION,
		accessKeyId: KEYS.ACCESS_KEY_ID,
		secretAccessKey: KEYS.SECRET_ACCESS_KEY
	};
	const CHANNEL_ARN = props.channelARN;
	const KNS_VIDEO_CLIENT = new AWS.KinesisVideo({ ...CONF, endpoint: null });
	let KNS_VIDEO_CONTENT = new AWS.KinesisVideoArchivedMedia({ ...CONF, endpoint: null });

	const ENDPOINT_RESPONSE = await KNS_VIDEO_CLIENT.getDataEndpoint({
		APIName: 'GET_HLS_STREAMING_SESSION_URL',
		StreamARN: CHANNEL_ARN,
		StreamName: null
	}).promise();
	try {
		KNS_VIDEO_CONTENT.endpoint = new AWS.Endpoint(ENDPOINT_RESPONSE.DataEndpoint);
		const HLS_RESPONSE = await KNS_VIDEO_CONTENT.getHLSStreamingSessionURL({
			ContainerFormat: 'FRAGMENTED_MP4',
			DiscontinuityMode: 'ALWAYS',
			DisplayFragmentTimestamp: 'NEVER',
			Expires: 43200,
			HLSFragmentSelector: null,
			MaxMediaPlaylistFragmentResults: 1,
			PlaybackMode: 'LIVE',
			StreamARN: CHANNEL_ARN,
			StreamName: null
		}).promise();
		return HLS_RESPONSE;
	} catch (e) {
		return {};
	}
};
