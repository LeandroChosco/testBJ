import { SAILS_ACCESS_TOKEN, ACCESS_TOKEN, IS_LPR, RADAR_ID } from '../constants/token'

export const remove = () => {
  localStorage.removeItem(ACCESS_TOKEN)
  localStorage.removeItem(SAILS_ACCESS_TOKEN)
  localStorage.removeItem(IS_LPR)
  localStorage.removeItem(RADAR_ID);
  sessionStorage.removeItem('isAuthenticated')
  if (window.location.pathname !== '/' && window.location.pathname !== '/login' && window.location.pathname !== '/resetpassword' && window.location.pathname !== '/recoveryuser') {
    window.location.href = window.location.href.replace(window.location.pathname, '/login')
  }
}