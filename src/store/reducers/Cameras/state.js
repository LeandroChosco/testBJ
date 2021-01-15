import {
	FETCH_ALL_CAMS,
	GET_LIMITS_CAM_REQUEST,
	GET_LIMITS_CAM_RESPONSE,
	GET_LIMITS_CAM_FAILURE
} from './actions';

const initialState = {
	loadingCams: true,
	cams: []
};

export function camsReducer(state = initialState, action) {
	switch (action.type) {
		case FETCH_ALL_CAMS:
			return Object.assign({}, state, {
				cams: action.cams,
				loadingCams: false
			});
		default:
			return state;
	}
}

const camLimitZoneInitialState = {
	isLoading: false,
	error: null,
	data: {},
	success: false
};

export const limits = (state = camLimitZoneInitialState, action) => {
	switch (action.type) {
		case GET_LIMITS_CAM_REQUEST:
			return {
				...state,
				isLoading: action.isLoading,
				error: null
			};

		case GET_LIMITS_CAM_RESPONSE:
			const aux_limit =
				action.payload instanceof Array && action.payload.length > 0 ? action.payload[0] : action.payload;
			return {
				...state,
				isLoading: false,
				error: null,
				data: aux_limit,
				success: action.success
			};

		case GET_LIMITS_CAM_FAILURE:
			return {
				...state,
				isLoading: false,
				error: action.error
			};

		default:
			return state;
	}
};
