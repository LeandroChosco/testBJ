import React, { Component } from 'react';
import { Header } from 'semantic-ui-react'
import Match from '../Match';
import responseJson from '../../assets/json/suspects.json'

import 'semantic-ui-css/semantic.min.css'
import '../../assets/styles/util.css';
import '../../assets/styles/main.css';
import '../../assets/fonts/iconic/css/material-design-iconic-font.min.css'
import '../../assets/fonts/font-awesome-4.7.0/css/font-awesome.min.css'


class CameraInfoSide extends Component {   

    state = { 
        activeIndex: 0,
        places : [
            {
                name:'Carrilo Puerto , 413 ,Tacuba Miguel Hidalgo CDMX', 
                lat:19.452546, 
                lng:-99.187447,
                id:1,
                webSocket:'ws://18.222.106.238:1001',
                match:[]
            },
            {
                name:'Rio Napo, 46, Argentina Poniente Miguel Hidalgo CDMX', 
                lat:19.459430, 
                lng:-99.208588,
                id:2,
                webSocket:'ws://18.222.106.238:1002',
                match:[]
            },
            {
                name:'Río Juruá ,45, Argenttina Poniente Miguel Hidalgo CDMX', 
                lat:19.4600672, 
                lng:-99.2117091,
                id:3,
                webSocket:'ws://18.222.106.238:1003',
                match:[]
            },

            {
                name:'Mexico ,Tacuba, 1 ,Argenttina Poniente / Nueva Argentina Miguel Hidalgo CDMX', 
                lat:19.456858, 
                lng:-99.205938,
                id:4,
                webSocket:'ws://18.222.106.238:1004',
                match:[]
            },
            {
                name:'Calzada Santa Barbara Naucalapn ,210, Argenttina Poniente Miguel Hidalgo CDMX', 
                lat:19.4601350, 
                lng:-99.2082958,
                id:5,
                webSocket:'ws://18.222.106.238:1005',
                match:[]
            },
            {
                name:'Río Tlacotalpan ,89 ,Argenttina Poniente Miguel Hidalgo CDMX', 
                lat:19.457746, 
                lng:-99.208690,
                id:6,
                webSocket:'ws://18.222.106.238:1006',
                match:[]
            },

            {
                name:'Río Juruá  ,13, Argenttina Poniente Miguel Hidalgo CDMX', 
                lat:19.459800, 
                lng:-99.208318,
                id:7,
                webSocket:'ws://18.222.106.238:1007',
                match:[]
            },
            {
                name:'Rio Napo, 42 ,Argenttina Poniente Miguel Hidalgo CDMX', 
                lat:19.459396, 
                lng:-99.208482,
                id:8,
                webSocket:'ws://18.222.106.238:1008',
                match:[]
            }
        ],
        matchs:[]
    }

    handleClick = (e, titleProps) => {
        const { index } = titleProps
        const { activeIndex } = this.state
        const newIndex = activeIndex === index ? -1 : index
    
        this.setState({ activeIndex: newIndex })
    }

    render() {
        return (
            <div ref='camInfoSideMenu' className="sidenav-right">
                <button className="closebtn"  onClick={this._toggle}>&times;</button>                
                <div align = 'center'> 
                    <Header>Matches</Header>
                </div>
                <div align='center'>
                    {this.props.matchs.map((value, index)=><Match key={index} info={value}/>)}
                </div>
            </div>
        );
    }

    _toggle = () => {
        this.refs.camInfoSideMenu.classList.remove('active-side')        
        setTimeout(this.props.toggleSideMenu,1000)
    }

    componentDidMount() {
        const element  = this.refs.camInfoSideMenu
        this.refs.camInfoSideMenu.classList.add('active-side') 
        const navHeight = document.getElementsByTagName('nav')[0].scrollHeight
        //const toolbar = document.getElementsByClassName('btn-toolbar')[0].scrollHeight
        const documentHeight = window.innerHeight
        element.style.height  = documentHeight - navHeight + "px"   
        element.style.maxHeight  = documentHeight - navHeight + "px"      
        element.style.marginTop  =   navHeight  + "px"   
        this.setState({activeIndex:this.props.cameraID}) 
        let cameras = []
          for(let item in responseJson.items){
            let suspect = responseJson.items[item]            
            //if(suspect.person_classification !== "Victim"){
              suspect.description = suspect.description.replace(/<p>/g,'').replace(/<\/p>/g,'')                            
              cameras.push(suspect)
            //}
          }       
        this.setState({matchs:cameras})          
    }
}

export default CameraInfoSide;