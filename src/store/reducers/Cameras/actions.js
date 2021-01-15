import conections from '../../../conections';

export const FETCH_ALL_CAMS = 'FETCH_ALL_CAMS';
export const GET_LIMITS_CAM_REQUEST = 'GET/LIMITS_CAM_REQUEST';
export const GET_LIMITS_CAM_RESPONSE = 'GET/LIMITS_CAM_RESPONSE';
export const GET_LIMITS_CAM_FAILURE = 'GET/LIMITS_CAM_FAILURE';

export function fetchPosts() {
	// Thunk middleware knows how to handle functions.
	// It passes the dispatch method as an argument to the function,
	// thus making it able to dispatch actions itself.

	return function(dispatch) {
		// First dispatch: the app state is updated to inform
		// that the API call is starting.

		// The function called by the thunk middleware can return a value,
		// that is passed on as the return value of the dispatch method.

		// In this case, we return a promise to wait for.
		// This is not required by thunk middleware, but it is convenient for us.

		return conections.getAllCams.then((data) =>
			// We can dispatch many times!
			// Here, we update the app state with the results of the API call.

			dispatch({ type: FETCH_ALL_CAMS, cams: data.data })
		);
	};
}

export function getLimitsCam(isLoading = true) {
	return (dispatch) => {
		dispatch({
			type: GET_LIMITS_CAM_REQUEST,
			isLoading
		});

		return conections
			.getLimitsCam()
			.then((response) => {
				if (response) {
					dispatch({
						type: GET_LIMITS_CAM_RESPONSE,
						payload: response.data.data,
						success: response.data.success
					});
				}
			})
			.catch(({ response }) => {
				if (response) {
					dispatch({
						type: GET_LIMITS_CAM_FAILURE,
						error: response.data.error
					});
				}
			});
	};
}
