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
			ContainerFormat: 'MPEG_TS', // FRAGMENTED_MP4 | MPEG_TS
			DiscontinuityMode: 'ALWAYS', // ALWAYS | NEVER | ON_DISCONTINUITY
			DisplayFragmentTimestamp: 'NEVER', // ALWAYS | NEVER
			Expires: 43200, // 300 - 43200
			// HLSFragmentSelector: {
			// 	FragmentSelectorType: 'SERVER_TIMESTAMP', // PRODUCER_TIMESTAMP | SERVER_TIMESTAMP
			// 	TimestampRange: { EndTimestamp: number, StartTimestamp: number }
			// },
			// MaxMediaPlaylistFragmentResults: null, // 1 - 5000
			PlaybackMode: 'LIVE', // LIVE | LIVE_REPLAY | ON_DEMAND
			StreamARN: CHANNEL_ARN,
			StreamName: null
		}).promise();
		return HLS_RESPONSE;
	} catch (e) {
		return {};
	}
};
