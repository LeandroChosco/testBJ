import {
	GET_AUTH_LOGIN_REQUEST, GET_AUTH_LOGIN_RESPONSE, GET_AUTH_LOGIN_FAILURE,
	GET_FILE_LIST_REQUEST, GET_FILE_LIST_RESPONSE, GET_FILE_LIST_FAILURE,
	GET_SHARE_LINK_REQUEST, GET_SHARE_LINK_RESPONSE, GET_SHARE_LINK_FAILURE
} from './actions';

const getQvrFileStationAuthLoginInitialState = {
	QvrFileStationAuth: {},
	isLoading: false,
	success: false,
	error: null
};
export const QvrFileStationAuth = (state = getQvrFileStationAuthLoginInitialState, action) => {
	switch (action.type) {
		case GET_AUTH_LOGIN_REQUEST:
			return {
				...state,
				isLoading: action.isLoading
			};
		case GET_AUTH_LOGIN_RESPONSE:
			return {
				...state,
				QvrFileStationAuth: action.QvrFileStationAuth,
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

const getQvrFileStationFileListInitialState = {
	QvrFileStationFileList: {},
	isLoading: false,
	success: false,
	error: null
};
export const QvrFileStationFileList = (state = getQvrFileStationFileListInitialState, action) => {
	switch (action.type) {
		case GET_FILE_LIST_REQUEST:
			return {
				...state,
				isLoading: action.isLoading
			};
		case GET_FILE_LIST_RESPONSE:
			return {
				...state,
				QvrFileStationFileList: action.QvrFileStationFileList,
				isLoading: action.isLoading,
				success: action.success,
				error: action.error
			};
		case GET_FILE_LIST_FAILURE:
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

const getQvrFileStationShareLinkInitialState = {
	QvrFileStationShareLink: {},
	isLoading: false,
	success: false,
	error: null
};
export const QvrFileStationShareLink = (state = getQvrFileStationShareLinkInitialState, action) => {
	switch (action.type) {
		case GET_SHARE_LINK_REQUEST:
			return {
				...state,
				isLoading: action.isLoading
			};
		case GET_SHARE_LINK_RESPONSE:
			return {
				...state,
				QvrFileStationShareLink: action.QvrFileStationShareLink,
				isLoading: action.isLoading,
				success: action.success,
				error: action.error
			};
		case GET_SHARE_LINK_FAILURE:
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
