import { combineReducers } from 'redux'
import { camsReducer, limitZoneReducer } from './cameras.reducers';
export const rootReducer = combineReducers({
    cams: camsReducer,
    limit_zone: limitZoneReducer,
});