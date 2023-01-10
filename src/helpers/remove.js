import {SAILS_ACCESS_TOKEN,ACCESS_TOKEN,IS_LPR} from '../constants/token'

export const remove =()=>{
    localStorage.removeItem(ACCESS_TOKEN)
    localStorage.removeItem(SAILS_ACCESS_TOKEN)
    localStorage.removeItem(IS_LPR)
    sessionStorage.removeItem('isAuthenticated')
    if (window.location.pathname !== '/' && window.location.pathname !== '/login' && window.location.pathname !== '/resetpassword' && window.location.pathname !== '/recoveryuser') {
      window.location.href = window.location.href.replace(window.location.pathname, '/login')
    }
  }