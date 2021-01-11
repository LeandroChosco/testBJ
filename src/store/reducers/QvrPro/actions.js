import axios from 'axios';
import API from '../../../Api/QvrPro';
import { parse } from 'fast-xml-parser';

export const GET_AUTH_LOGIN_REQUEST = 'GET_QVR_PRO/AUTH_LOGIN_REQUEST';
export const GET_AUTH_LOGIN_RESPONSE = 'GET_QVR_PRO/AUTH_LOGIN_RESPONSE';
export const GET_AUTH_LOGIN_FAILURE = 'GET_QVR_PRO/AUTH_LOGIN_FAILURE';
export function getQvrProAuthLogin(params) {
	return (dispatch) => {
		dispatch({
			type: GET_AUTH_LOGIN_REQUEST,
			isLoading: true
		});
		return axios({
			data: { params },
			method: 'post',
			url: API.getUrlForAuthLogin()
		})
			.then((response) => {
				dispatch({
					type: GET_AUTH_LOGIN_RESPONSE,
					QvrProAuth: parse(response.data).QDocRoot,
					isLoading: false,
					success: true,
					error: null
				});
			})
			.catch((error) => {
				dispatch({
					type: GET_AUTH_LOGIN_FAILURE,
					isLoading: false,
					success: false,
					error: error
				});
			});
	};
}
export function getQvrProAuthLogout(params) {
	return (dispatch) => {
		dispatch({
			type: GET_AUTH_LOGIN_REQUEST,
			isLoading: true
		});
		return axios({
			data: { params },
			method: 'post',
			url: API.getUrlForAuthLogout()
		})
			.then((response) => {
				dispatch({
					type: GET_AUTH_LOGIN_RESPONSE,
					QvrProAuth: {},
					isLoading: false,
					success: true,
					error: null
				});
			})
			.catch((error) => {
				dispatch({
					type: GET_AUTH_LOGIN_FAILURE,
					isLoading: false,
					success: false,
					error: error
				});
			});
	};
}

export const GET_CAMERA_LIST_REQUEST = 'GET_QVR_PRO/CAMERA_LIST_REQUEST';
export const GET_CAMERA_LIST_RESPONSE = 'GET_QVR_PRO/CAMERA_LIST_RESPONSE';
export const GET_CAMERA_LIST_FAILURE = 'GET_QVR_PRO/CAMERA_LIST_FAILURE';
export function getQvrProCameraList(params) {
	return (dispatch) => {
		dispatch({
			type: GET_CAMERA_LIST_REQUEST,
			isLoading: true
		});
		return axios({
			data: { params },
			method: 'post',
			url: API.getUrlForCameraList()
		})
			.then((response) => {
				dispatch({
					type: GET_CAMERA_LIST_RESPONSE,
					QvrProCameraList: response.data,
					isLoading: false,
					success: true,
					error: null
				});
			})
			.catch((error) => {
				dispatch({
					type: GET_CAMERA_LIST_FAILURE,
					isLoading: false,
					success: false,
					error: error
				});
			});
	};
}

export const GET_CAMERA_CAPABILITY_REQUEST = 'GET_QVR_PRO/CAMERA_CAPABILITY_REQUEST';
export const GET_CAMERA_CAPABILITY_RESPONSE = 'GET_QVR_PRO/CAMERA_CAPABILITY_RESPONSE';
export const GET_CAMERA_CAPABILITY_FAILURE = 'GET_QVR_PRO/CAMERA_CAPABILITY_FAILURE';
export function getQvrProCameraCapability(params) {
	return (dispatch) => {
		dispatch({
			type: GET_CAMERA_CAPABILITY_REQUEST,
			isLoading: true
		});
		return axios({
			data: { params },
			method: 'post',
			url: API.getUrlForCameraCapability()
		})
			.then((response) => {
				dispatch({
					type: GET_CAMERA_CAPABILITY_RESPONSE,
					QvrProCameraCapability: response.data,
					isLoading: false,
					success: true,
					error: null
				});
			})
			.catch((error) => {
				dispatch({
					type: GET_CAMERA_CAPABILITY_FAILURE,
					isLoading: false,
					success: false,
					error: error
				});
			});
	};
}

export const GET_CHANNEL_LIST_REQUEST = 'GET_QVR_PRO/CHANNEL_LIST_REQUEST';
export const GET_CHANNEL_LIST_RESPONSE = 'GET_QVR_PRO/CHANNEL_LIST_RESPONSE';
export const GET_CHANNEL_LIST_FAILURE = 'GET_QVR_PRO/CHANNEL_LIST_FAILURE';
export function getQvrProChannelList(params) {
	return (dispatch) => {
		dispatch({
			type: GET_CHANNEL_LIST_REQUEST,
			isLoading: true
		});
		return axios({
			data: { params },
			method: 'post',
			url: API.getUrlForChannelList()
		})
			.then((response) => {
				dispatch({
					type: GET_CHANNEL_LIST_RESPONSE,
					QvrProChannelList: response.data,
					isLoading: false,
					success: true,
					error: null
				});
			})
			.catch((error) => {
				dispatch({
					type: GET_CHANNEL_LIST_FAILURE,
					isLoading: false,
					success: false,
					error: error
				});
			});
	};
}

export const GET_LIVE_STREAMING_REQUEST = 'GET_QVR_PRO/LIVE_STREAMING_REQUEST';
export const GET_LIVE_STREAMING_RESPONSE = 'GET_QVR_PRO/LIVE_STREAMING_RESPONSE';
export const GET_LIVE_STREAMING_FAILURE = 'GET_QVR_PRO/LIVE_STREAMING_FAILURE';
export function getQvrProLiveStreaming(params) {
	return (dispatch) => {
		dispatch({
			type: GET_LIVE_STREAMING_REQUEST,
			isLoading: true
		});
		return axios({
			data: { params },
			method: 'post',
			url: API.getUrlForLiveStreaming()
		})
			.then((response) => {
				dispatch({
					type: GET_LIVE_STREAMING_RESPONSE,
					QvrProLiveStreaming: response.data,
					isLoading: false,
					success: true,
					error: null
				});
			})
			.catch((error) => {
				dispatch({
					type: GET_LIVE_STREAMING_FAILURE,
					isLoading: false,
					success: false,
					error: error
				});
			});
	};
}
export function delQvrProLiveStreaming(params) {
	return (dispatch) => {
		dispatch({
			type: GET_LIVE_STREAMING_REQUEST,
			isLoading: true
		});
		return axios({
			data: { params },
			method: 'post',
			url: API.getUrlForLiveStreaming()
		})
			.then((response) => {
				dispatch({
					type: GET_LIVE_STREAMING_RESPONSE,
					QvrProLiveStreaming: {},
					isLoading: false,
					success: true,
					error: null
				});
			})
			.catch((error) => {
				dispatch({
					type: GET_LIVE_STREAMING_FAILURE,
					isLoading: false,
					success: false,
					error: error
				});
			});
	};
}

export const GET_SNAPSHOT_REQUEST = 'GET_QVR_PRO/SNAPSHOT_REQUEST';
export const GET_SNAPSHOT_RESPONSE = 'GET_QVR_PRO/SNAPSHOT_RESPONSE';
export const GET_SNAPSHOT_FAILURE = 'GET_QVR_PRO/SNAPSHOT_FAILURE';
export function getQvrProSnapshot(params) {
	return (dispatch) => {
		dispatch({
			type: GET_SNAPSHOT_REQUEST,
			isLoading: true
		});
		return axios({
			data: { params },
			method: 'post',
			url: API.getUrlForSnapshot()
		})
			.then((response) => {
				dispatch({
					type: GET_SNAPSHOT_RESPONSE,
					QvrProSnapshot: response.data,
					isLoading: false,
					success: true,
					error: null
				});
			})
			.catch((error) => {
				dispatch({
					type: GET_SNAPSHOT_FAILURE,
					isLoading: false,
					success: false,
					error: error
				});
			});
	};
}

export const GET_VIDEO_REQUEST = 'GET_QVR_PRO/VIDEO_REQUEST';
export const GET_VIDEO_RESPONSE = 'GET_QVR_PRO/VIDEO_RESPONSE';
export const GET_VIDEO_FAILURE = 'GET_QVR_PRO/VIDEO_FAILURE';
export function getQvrProVideo(params) {
	return (dispatch) => {
		dispatch({
			type: GET_VIDEO_REQUEST,
			isLoading: true
		});
		return axios({
			data: { params },
			method: 'post',
			url: API.getUrlForVideo()
		})
			.then((response) => {
				dispatch({
					type: GET_VIDEO_RESPONSE,
					QvrProVideo: response.data,
					isLoading: false,
					success: true,
					error: null
				});
			})
			.catch((error) => {
				dispatch({
					type: GET_VIDEO_FAILURE,
					isLoading: false,
					success: false,
					error: error
				});
			});
	};
}

export const GET_ALARM_REQUEST = 'GET_QVR_PRO/ALARM_REQUEST';
export const GET_ALARM_RESPONSE = 'GET_QVR_PRO/ALARM_RESPONSE';
export const GET_ALARM_FAILURE = 'GET_QVR_PRO/ALARM_FAILURE';
export function getQvrProAlarm(params) {
	return (dispatch) => {
		dispatch({
			type: GET_ALARM_REQUEST,
			isLoading: true
		});
		return axios({
			data: { params },
			method: 'post',
			url: API.getUrlForAlarm()
		})
			.then((response) => {
				dispatch({
					type: GET_ALARM_RESPONSE,
					QvrProAlarm: response.data,
					isLoading: false,
					success: true,
					error: null
				});
			})
			.catch((error) => {
				dispatch({
					type: GET_ALARM_FAILURE,
					isLoading: false,
					success: false,
					error: error
				});
			});
	};
}

export const GET_CAMERA_PTZ_REQUEST = 'GET_QVR_PRO/CAMERA_PTZ_REQUEST';
export const GET_CAMERA_PTZ_RESPONSE = 'GET_QVR_PRO/CAMERA_PTZ_RESPONSE';
export const GET_CAMERA_PTZ_FAILURE = 'GET_QVR_PRO/CAMERA_PTZ_FAILURE';
export function getQvrProCameraPTZ(params) {
	return (dispatch) => {
		dispatch({
			type: GET_CAMERA_PTZ_REQUEST,
			isLoading: true
		});
		return axios({
			data: { params },
			method: 'post',
			url: API.getUrlForCameraPTZ()
		})
			.then((response) => {
				dispatch({
					type: GET_CAMERA_PTZ_RESPONSE,
					QvrProCameraPTZ: response.data,
					isLoading: false,
					success: true,
					error: null
				});
			})
			.catch((error) => {
				dispatch({
					type: GET_CAMERA_PTZ_FAILURE,
					isLoading: false,
					success: false,
					error: error
				});
			});
	};
}
