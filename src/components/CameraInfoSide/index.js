import React, { Component } from 'react';

import '../../assets/styles/util.css';
import '../../assets/styles/main.css';
import '../../assets/fonts/iconic/css/material-design-iconic-font.min.css'
import '../../assets/fonts/font-awesome-4.7.0/css/font-awesome.min.css'


class CameraInfoSide extends Component {   


    render() {
        return (
            <div ref='camInfoSideMenu' className={this.props.active?"sidenav-right active-side":"sidenav-right"} align="center">
                <button className="closebtn"  onClick={this.props.toggleSideMenu}>&times;</button>
                <label> Hola mundo</label>
                
            </div>
        );
    }

    componentDidMount() {
        //$('#mySidenavLeft').css('margin-top',navHeight-2);
        //$('#mySidenavLeft').css('height',$(document).height() - navHeight);
        const element  = this.refs.camInfoSideMenu
        const navHeight = document.getElementsByTagName('nav')[0].scrollHeight
        const documentHeight = window.innerHeight
        element.style.height  = documentHeight - navHeight + "px"   
        element.style.maxHeight  = documentHeight - navHeight + "px"      
        element.style.marginTop  = navHeight + "px"      
        console.log(element)
    }
}

export default CameraInfoSide;