import { combineReducers } from 'redux';

// Reducers - State
import * as Cameras from './Cameras/state';
import * as QvrFileStation from './QvrFileStation/state';
import * as QvrPro from './QvrPro/state';

const rootReducer = combineReducers({
	...Cameras,
	...QvrFileStation,
  ...QvrPro,

});

const appReducer = (state, action) => {
	return rootReducer(state, action);
};

export default appReducer;
