import {SAILS_ACCESS_TOKEN,ACCESS_TOKEN} from '../constants/token'

export const remove =()=>{
    localStorage.removeItem(ACCESS_TOKEN)
    localStorage.removeItem(SAILS_ACCESS_TOKEN)
    sessionStorage.removeItem('isAuthenticated')
    if (window.location.pathname !== '/' && window.location.pathname !== '/login') {
      window.location.href = window.location.href.replace(window.location.pathname, '/login')
    }
  }