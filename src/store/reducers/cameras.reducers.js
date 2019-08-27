import {
    FETCH_ALL_CAMS
  } from '../actions/cameras.actions'
  const initialState ={
      loadingCams: true,
      cams:[]
  }
  
  function camsReducer(state = initialState, action) {
    switch (action.type) {
      case FETCH_ALL_CAMS:
        return Object.assign({}, state, {
          cams: action.cams,
          loadingCams: false
        })     
      default:
        return state
    }
  }