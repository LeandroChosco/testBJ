import { combineReducers } from 'redux';

// Reducers - State
import * as Cameras from './Cameras/state';
import * as QvrFileStation from './QvrFileStation/state';

const rootReducer = combineReducers({
	...Cameras,
	...QvrFileStation,

});

const appReducer = (state, action) => {
	return rootReducer(state, action);
};

export default appReducer;
