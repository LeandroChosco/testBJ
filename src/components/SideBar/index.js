import React, { Component } from 'react';
import Select from 'react-select';
import CameraStream from '../../components/CameraStream'

import '../../assets/styles/util.css';
import '../../assets/styles/main.css';
import '../../assets/fonts/iconic/css/material-design-iconic-font.min.css'
import '../../assets/fonts/font-awesome-4.7.0/css/font-awesome.min.css'
import './style.css'
import constants from '../../constants/constants';
import conections from '../../conections';

class SideBar extends Component {
    state = {
        selectedOption: [],
        places : [
        ],
        options:[],
        webSocket:constants.webSocket
    }

    componentDidMount(){
        var getCams = conections.getAllCams()
        for (const promise in getCams) {
          getCams[promise].then((data) => {
                  const camaras = data.data
                  let auxCamaras = []
                  let options = []
                  camaras.map(value=>{
                      if (value.active === 1) {
                          auxCamaras.push({
                              id:value.id,
                              num_cam:value.num_cam,
                              lat:parseFloat(value.google_cordenate.split(',')[0]),
                              lng:parseFloat(value.google_cordenate.split(',')[1]),
                              webSocket:this.state.webSocket + ':' +constants.webSocketPort+(value.num_cam>=10?'':'0') + value.num_cam,
                              name: value.street +' '+ value.number + ', ' + value.township+ ', ' + value.town+ ', ' + value.state
                          })
                      }
                      return true;
                  })
                  auxCamaras.map((value)=>{
                      options.push({
                          value: value.id,
                          label: 'Camara '+value.num_cam,
                      })
                      return true
                  })
                  this.setState({places:auxCamaras,options:options})
              });
            }

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
                    this.state.selectedOption.map( value => <CameraStream key={value.extraData.id} marker={value} height={.6} showButtons/>)
                }
                </div>
            </div>
        );
    }
}

export default SideBar;
