import axios from 'axios';
import API from '../../../Api/QvrFileStation';

export const GET_AUTH_LOGIN_REQUEST = 'GET_QVR_FILE_STATION/AUTH_LOGIN_REQUEST';
export const GET_AUTH_LOGIN_RESPONSE = 'GET_QVR_FILE_STATION/AUTH_LOGIN_RESPONSE';
export const GET_AUTH_LOGIN_FAILURE = 'GET_QVR_FILE_STATION/AUTH_LOGIN_FAILURE';
export function getQvrFileStationAuthLogin(params) {
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
					QvrFileStationAuth: response.data,
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
export function getQvrFileStationAuthLogout(params) {
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
					QvrFileStationAuth: {},
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

export const GET_FILE_LIST_REQUEST = 'GET_QVR_FILE_STATION/FILE_LIST_REQUEST';
export const GET_FILE_LIST_RESPONSE = 'GET_QVR_FILE_STATION/FILE_LIST_RESPONSE';
export const GET_FILE_LIST_FAILURE = 'GET_QVR_FILE_STATION/FILE_LIST_FAILURE';
export function getQvrFileStationFileList(params) {
	return (dispatch) => {
		dispatch({
			type: GET_FILE_LIST_REQUEST,
			isLoading: true
		});
		return axios({
			data: { params },
			method: 'post',
			url: API.getUrlForFileList()
		})
			.then((response) => {
				dispatch({
					type: GET_FILE_LIST_RESPONSE,
					QvrFileStationFileList: response.data,
					isLoading: false,
					success: true,
					error: null
				});
			})
			.catch((error) => {
				dispatch({
					type: GET_FILE_LIST_FAILURE,
					isLoading: false,
					success: false,
					error: error
				});
			});
	};
}

export const GET_SHARE_LINK_REQUEST = 'GET_QVR_FILE_STATION/SHARE_LINK_REQUEST';
export const GET_SHARE_LINK_RESPONSE = 'GET_QVR_FILE_STATION/SHARE_LINK_RESPONSE';
export const GET_SHARE_LINK_FAILURE = 'GET_QVR_FILE_STATION/SHARE_LINK_FAILURE';
export function getQvrFileStationShareLink(params) {
	return (dispatch) => {
		dispatch({
			type: GET_SHARE_LINK_REQUEST,
			isLoading: true
		});
		return axios({
			data: { params },
			method: 'post',
			url: API.getUrlForShareLink()
		})
			.then((response) => {
				dispatch({
					type: GET_SHARE_LINK_RESPONSE,
					QvrFileStationShareLink: response.data,
					isLoading: false,
					success: true,
					error: null
				});
			})
			.catch((error) => {
				dispatch({
					type: GET_SHARE_LINK_FAILURE,
					isLoading: false,
					success: false,
					error: error
				});
			});
	};
}
export function getQvrFileStationDeleteShareLink(params) {
	return (dispatch) => {
		dispatch({
			type: GET_SHARE_LINK_REQUEST,
			isLoading: true
		});
		return axios({
			data: { params },
			method: 'post',
			url: API.getUrlForDeleteShareLink()
		})
			.then((response) => {
				dispatch({
					type: GET_SHARE_LINK_RESPONSE,
					QvrFileStationShareLink: {},
					isLoading: false,
					success: true,
					error: null
				});
			})
			.catch((error) => {
				dispatch({
					type: GET_SHARE_LINK_FAILURE,
					isLoading: false,
					success: false,
					error: error
				});
			});
	};
}
