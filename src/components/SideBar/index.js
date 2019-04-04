import React, { Component } from 'react';
import Select from 'react-select';
import CameraStream from '../../components/CameraStream'

import '../../assets/styles/util.css';
import '../../assets/styles/main.css';
import '../../assets/fonts/iconic/css/material-design-iconic-font.min.css'
import '../../assets/fonts/font-awesome-4.7.0/css/font-awesome.min.css'
import './style.css'

class SideBar extends Component {   
    state = {
        selectedOption: [],
        places : [
            {
                name:'Carrilo Puerto , 413 ,Tacuba Miguel Hidalgo CDMX', 
                lat:19.452546, 
                lng:-99.187447,
                id:1,
                webSocket:'ws://18.222.106.238:1001'
            },
            {
                name:'Rio Napo, 46, Argentina Poniente Miguel Hidalgo CDMX', 
                lat:19.459430, 
                lng:-99.208588,
                id:2,
                webSocket:'ws://18.222.106.238:1002'
            },
            {
                name:'Río Juruá ,45, Argenttina Poniente Miguel Hidalgo CDMX', 
                lat:19.4600672, 
                lng:-99.2117091,
                id:3,
                webSocket:'ws://18.222.106.238:1003'
            },

            {
                name:'Mexico ,Tacuba, 1 ,Argenttina Poniente / Nueva Argentina Miguel Hidalgo CDMX', 
                lat:19.456858, 
                lng:-99.205938,
                id:4,
                webSocket:'ws://18.222.106.238:1004'
            },
            {
                name:'Calzada Santa Barbara Naucalapn ,210, Argenttina Poniente Miguel Hidalgo CDMX', 
                lat:19.4601350, 
                lng:-99.2082958,
                id:5,
                webSocket:'ws://18.222.106.238:1005'
            },
            {
                name:'Río Tlacotalpan ,89 ,Argenttina Poniente Miguel Hidalgo CDMX', 
                lat:19.457746, 
                lng:-99.208690,
                id:6,
                webSocket:'ws://18.222.106.238:1006'
            },

            {
                name:'Río Juruá  ,13, Argenttina Poniente Miguel Hidalgo CDMX', 
                lat:19.459800, 
                lng:-99.208318,
                id:7,
                webSocket:'ws://18.222.106.238:1007'
            },
            {
                name:'Rio Napo, 42 ,Argenttina Poniente Miguel Hidalgo CDMX', 
                lat:19.459396, 
                lng:-99.208482,
                id:8,
                webSocket:'ws://18.222.106.238:1008'
            }
        ],
        options:[]
    }

    componentDidMount(){
        const  places = this.state.places
        var options = []
        places.map((value)=>{
            options.push({
                value: value.id,
                label: 'Camara '+value.id,
            })
            return true
        })
        this.setState({options:options})
    }

    handleChange = (selectedOption) => {
        var cameras= []
        selectedOption.map((value)=>{
            this.state.places.map((place)=>{
                if (place.id === value.value) {
                    cameras.push({
                        title:place.name,
                        extraData:place
                    })
                }
                return true
            })
            return true
        })
        this.setState({ selectedOption:cameras });
    }

    render() {
        return (
            <div className={this.props.active?"sidenav active-side":"sidenav"} align="center">
                <button className="closebtn"  onClick={this.props.toggleSideMenu}>&times;</button>
                <label> Buscar cámara</label>
                <Select   
                    isMulti                              
                    onChange={this.handleChange}
                    options={this.state.options}
                />
                <div id="selection">
                {
                    this.state.selectedOption.map( value => <CameraStream key={value.extraData.id} marker={value} height={.6}/>) 
                }
                </div>
            </div>
        );
    }
}

export default SideBar;