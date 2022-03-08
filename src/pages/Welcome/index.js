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
    
  

}

export default Welcome;