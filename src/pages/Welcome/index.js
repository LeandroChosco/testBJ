import React, { Component } from 'react';
import './style.css'

class Welcome extends Component {
    
  render() {
    return (
        <div  className="app-container" >   
            Hola, bienvenido a C5Virtual
        </div>
    
    );
  }

  componentDidMount(){
    const isAuth = JSON.parse(sessionStorage.getItem('isAuthenticated'))    
    if (isAuth) {
        if (isAuth.userInfo.modules) {
            if (isAuth.userInfo.modules[0]) {
                this.props.history.push(isAuth.userInfo.modules[0].id===1?'/map':isAuth.userInfo.modules[0].id===2?'/analisis':'/welcome')
            }
        }
    } else {
        this.props.history.push('/login')
    }
  }
    
  componentDidUpdate(){
    const isAuth = JSON.parse(sessionStorage.getItem('isAuthenticated'))    
    if (!isAuth) {
      this.props.history.push('/login')
    } else{
      if (!isAuth.logged) {
        if (window.location.pathname !== '/' && window.location.pathname !== '/login') {
          window.location.href = window.location.href.replace(window.location.pathname, '/login')
        }
      }
    }
  }

}

export default Welcome;