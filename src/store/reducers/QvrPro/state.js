import {
	GET_AUTH_LOGIN_REQUEST,	GET_AUTH_LOGIN_RESPONSE, GET_AUTH_LOGIN_FAILURE,
	GET_CAMERA_LIST_REQUEST, GET_CAMERA_LIST_RESPONSE, GET_CAMERA_LIST_FAILURE,
	GET_CAMERA_CAPABILITY_REQUEST, GET_CAMERA_CAPABILITY_RESPONSE, GET_CAMERA_CAPABILITY_FAILURE,
	GET_CHANNEL_LIST_REQUEST, GET_CHANNEL_LIST_RESPONSE, GET_CHANNEL_LIST_FAILURE,
	GET_LIVE_STREAMING_REQUEST, GET_LIVE_STREAMING_RESPONSE, GET_LIVE_STREAMING_FAILURE,
	GET_SNAPSHOT_REQUEST, GET_SNAPSHOT_RESPONSE, GET_SNAPSHOT_FAILURE,
	GET_VIDEO_REQUEST, GET_VIDEO_RESPONSE, GET_VIDEO_FAILURE,
	GET_ALARM_REQUEST, GET_ALARM_RESPONSE, GET_ALARM_FAILURE,
	GET_CAMERA_PTZ_REQUEST, GET_CAMERA_PTZ_RESPONSE, GET_CAMERA_PTZ_FAILURE
} from './actions';

const getQvrProAuthLoginInitialState = {
	QvrProAuth: {},
	isLoading: false,
	success: false,
	error: null
};
export const QvrProAuth = (state = getQvrProAuthLoginInitialState, action) => {
	switch (action.type) {
		case GET_AUTH_LOGIN_REQUEST:
			return {
				...state,
				isLoading: action.isLoading
			};
		case GET_AUTH_LOGIN_RESPONSE:
			return {
				...state,
				QvrProAuth: action.QvrProAuth,
				isLoading: action.isLoading,
				success: action.success,
				error: action.error
			};
		case GET_AUTH_LOGIN_FAILURE:
			return {
				...state,
				isLoading: action.isLoading,
				success: action.success,
				error: action.error
			};
		default:
			return state;
	}
};

const getQvrProCameraListInitialState = {
	QvrProCameraList: {},
	isLoading: false,
	success: false,
	error: null
};
export const QvrProCameraList = (state = getQvrProCameraListInitialState, action) => {
	switch (action.type) {
		case GET_CAMERA_LIST_REQUEST:
			return {
				...state,
				isLoading: action.isLoading
			};
		case GET_CAMERA_LIST_RESPONSE:
			return {
				...state,
				QvrProCameraList: action.QvrProCameraList,
				isLoading: action.isLoading,
				success: action.success,
				error: action.error
			};
		case GET_CAMERA_LIST_FAILURE:
			return {
				...state,
				isLoading: action.isLoading,
				success: action.success,
				error: action.error
			};
		default:
			return state;
	}
};

const getQvrProCameraCapabilityInitialState = {
	QvrProCameraCapability: {},
	isLoading: false,
	success: false,
	error: null
};
export const QvrProCameraCapability = (state = getQvrProCameraCapabilityInitialState, action) => {
	switch (action.type) {
		case GET_CAMERA_CAPABILITY_REQUEST:
			return {
				...state,
				isLoading: action.isLoading
			};
		case GET_CAMERA_CAPABILITY_RESPONSE:
			return {
				...state,
				QvrProCameraCapability: action.QvrProCameraCapability,
				isLoading: action.isLoading,
				success: action.success,
				error: action.error
			};
		case GET_CAMERA_CAPABILITY_FAILURE:
			return {
				...state,
				isLoading: action.isLoading,
				success: action.success,
				error: action.error
			};
		default:
			return state;
	}
};

const getQvrProChannelListInitialState = {
	QvrProChannelList: {},
	isLoading: false,
	success: false,
	error: null
};
export const QvrProChannelList = (state = getQvrProChannelListInitialState, action) => {
	switch (action.type) {
		case GET_CHANNEL_LIST_REQUEST:
			return {
				...state,
				isLoading: action.isLoading
			};
		case GET_CHANNEL_LIST_RESPONSE:
			return {
				...state,
				QvrProChannelList: action.QvrProChannelList,
				isLoading: action.isLoading,
				success: action.success,
				error: action.error
			};
		case GET_CHANNEL_LIST_FAILURE:
			return {
				...state,
				isLoading: action.isLoading,
				success: action.success,
				error: action.error
			};
		default:
			return state;
	}
};

const postQvrProLiveStreamingInitialState = {
	QvrProLiveStreaming: {},
	isLoading: false,
	success: false,
	error: null
};
export const QvrProLiveStreaming = (state = postQvrProLiveStreamingInitialState, action) => {
	switch (action.type) {
		case GET_LIVE_STREAMING_REQUEST:
			return {
				...state,
				isLoading: action.isLoading
			};
		case GET_LIVE_STREAMING_RESPONSE:
			return {
				...state,
				QvrProLiveStreaming: action.QvrProLiveStreaming,
				isLoading: action.isLoading,
				success: action.success,
				error: action.error
			};
		case GET_LIVE_STREAMING_FAILURE:
			return {
				...state,
				isLoading: action.isLoading,
				success: action.success,
				error: action.error
			};
		default:
			return state;
	}
};

const getQvrProSnapshotInitialState = {
	QvrProSnapshot: {},
	isLoading: false,
	success: false,
	error: null
};
export const QvrProSnapshot = (state = getQvrProSnapshotInitialState, action) => {
	switch (action.type) {
		case GET_SNAPSHOT_REQUEST:
			return {
				...state,
				isLoading: action.isLoading
			};
		case GET_SNAPSHOT_RESPONSE:
			return {
				...state,
				QvrProSnapshot: action.QvrProSnapshot,
				isLoading: action.isLoading,
				success: action.success,
				error: action.error
			};
		case GET_SNAPSHOT_FAILURE:
			return {
				...state,
				isLoading: action.isLoading,
				success: action.success,
				error: action.error
			};
		default:
			return state;
	}
};

const putQvrProVideoInitialState = {
	QvrProVideo: {},
	isLoading: false,
	success: false,
	error: null
};
export const QvrProVideo = (state = putQvrProVideoInitialState, action) => {
	switch (action.type) {
		case GET_VIDEO_REQUEST:
			return {
				...state,
				isLoading: action.isLoading
			};
		case GET_VIDEO_RESPONSE:
			return {
				...state,
				QvrProVideo: action.QvrProVideo,
				isLoading: action.isLoading,
				success: action.success,
				error: action.error
			};
		case GET_VIDEO_FAILURE:
			return {
				...state,
				isLoading: action.isLoading,
				success: action.success,
				error: action.error
			};
		default:
			return state;
	}
};

const putQvrProAlarmInitialState = {
	QvrProAlarm: {},
	isLoading: false,
	success: false,
	error: null
};
export const QvrProAlarm = (state = putQvrProAlarmInitialState, action) => {
	switch (action.type) {
		case GET_ALARM_REQUEST:
			return {
				...state,
				isLoading: action.isLoading
			};
		case GET_ALARM_RESPONSE:
			return {
				...state,
				QvrProAlarm: action.QvrProAlarm,
				isLoading: action.isLoading,
				success: action.success,
				error: action.error
			};
		case GET_ALARM_FAILURE:
			return {
				...state,
				isLoading: action.isLoading,
				success: action.success,
				error: action.error
			};
		default:
			return state;
	}
};

const putQvrProCameraPTZInitialState = {
	QvrProCameraPTZ: {},
	isLoading: false,
	success: false,
	error: null
};
export const QvrProCameraPTZ = (state = putQvrProCameraPTZInitialState, action) => {
	switch (action.type) {
		case GET_CAMERA_PTZ_REQUEST:
			return {
				...state,
				isLoading: action.isLoading
			};
		case GET_CAMERA_PTZ_RESPONSE:
			return {
				...state,
				QvrProCameraPTZ: action.QvrProCameraPTZ,
				isLoading: action.isLoading,
				success: action.success,
				error: action.error
			};
		case GET_CAMERA_PTZ_FAILURE:
			return {
				...state,
				isLoading: action.isLoading,
				success: action.success,
				error: action.error
			};
		default:
			return state;
	}
};
