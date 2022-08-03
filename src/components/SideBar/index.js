import React, { Component } from "react";
import Select from "react-select";
import CameraStream from "../../components/CameraStream";

import "../../assets/styles/util.css";
import "../../assets/styles/main.css";
import "../../assets/fonts/iconic/css/material-design-iconic-font.min.css";
import "../../assets/fonts/font-awesome-4.7.0/css/font-awesome.min.css";
import "./style.css";
import constants from "../../constants/constants";
import { urlHttpOrHttps } from '../../functions/urlHttpOrHttps';
import conections from "../../conections";

class SideBar extends Component {
  state = {
    selectedOption: [],
    places: [],
    options: [],
    webSocket: constants.webSocket
  };

  componentDidMount() {
    conections.getAllCams().then(data => {
      // console.log(data);
      const camaras = data.data;
      //console.log("camaras", camaras)
      if (data.status === 200) {
        // console.log("entro al if");
        let auxCamaras = [];
        let options = [];
        let index = 1;
        // console.log("camm", camaras);
        if (camaras === undefined) {
          return;
        }
        
        camaras.map(value => {
          if (value.active === 1 && value.flag_streaming === 1 && value.UrlStreamMediaServer) {

            var urlHistory = null
            var urlHistoryPort = null

            if ("urlhistory" in value){
                urlHistory = value.urlhistory
            }

            if ("urlhistoryport" in value){
                urlHistoryPort = value.urlhistoryport
            }

            // console.log("valusito", value)
            auxCamaras.push({
              id: value.id,
              num_cam: index,
              lat: parseFloat(value.google_cordenate.split(",")[0]),
              lng: parseFloat(value.google_cordenate.split(",")[1]),
              //webSocket:'ws://'+value.UrlStreamToCameras[0].Url.dns_ip+':'+value.port_output_streaming,
              name:
                value.street +
                " " +
                value.number +
                ", " +
                value.township +
                ", " +
                value.town +
                ", " +
                value.state +
                " #cam" +
                value.num_cam,
              isHls: value.tipo_camara === 3 ? false : true,
              url: urlHttpOrHttps(value.UrlStreamMediaServer.ip_url_ms, value.UrlStreamMediaServer.output_port, value.UrlStreamMediaServer.name, value.channel, value.UrlStreamMediaServer.protocol),
              dataCamValue: value,
              tipo_camara: value.tipo_camara,
              urlHistory: urlHistory,
              urlHistoryPort: urlHistoryPort
            });
            index++;
          }
          return true;
        });

        auxCamaras.map(value => {
          options.push({
            value: value.id,
            label: "Camara " + value.num_cam
          });
          return true;
        });
        this.setState({ places: auxCamaras, options: options });
      }
    });
  }

  handleChange = async selectedOption => {
    var cameras = [];
    selectedOption.map(value => {
      this.state.places.map(place => {
        if (place.id === value.value) {
          cameras.push({
            title: place.name,
            extraData: place
          });
        }
        return true;
      });
      return true;
    });
    await this.setState({ selectedOption: cameras });
  };

  render() {
    return (
      <div
        className={this.props.active ? "sidenav active-side" : "sidenav"}
        align="center"
      >
        <button className="closebtn" onClick={this.props.toggleSideMenu}>
          &times;
        </button>
        <label> Buscar cámara</label>
        <Select
          isMulti
          onChange={this.handleChange}
          options={this.state.options}
        />
        <div id="selection">
          {this.state.selectedOption.map(value => (
            <CameraStream
              key={value.extraData.id}
              marker={value}
              height={300}
              hideButton
              showButtons={false}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default SideBar;
