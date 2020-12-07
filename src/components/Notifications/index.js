import React, { Component } from "react";
import { Accordion, Icon } from "semantic-ui-react";

import SupportItem from "../SupportItem";
import SOSItem from "../SOSItem";
import ComplaimentItem from "../ComplaimentItem";
import RobberyItem from "../RobberyItem";
import CovidItem from "../CovidItem";

import "../../assets/styles/util.css";
import "../../assets/styles/main.css";
import "../../assets/fonts/iconic/css/material-design-iconic-font.min.css";
import "../../assets/fonts/font-awesome-4.7.0/css/font-awesome.min.css";
import "semantic-ui-css/semantic.min.css";

class Notifications extends Component {
  state = {
    activeIndex: 0
  };

  handleClick = (e, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;

    this.setState({ activeIndex: newIndex });
  };

  render() {
    const { activeIndex } = this.state;
    return (
      <div
        ref="camInfoSideMenu"
        className="sidenav-right"
        style={{ overflow: "hidden" }}
      >
        <button className="closebtn" onClick={this._toggle}>
          &times;
        </button>
        <Accordion styled style={{ height: "100%", paddingBottom: "100px" }}>
          <Accordion.Title
            active={activeIndex === 0}
            index={0}
            onClick={this.handleClick}
          >
            <Icon name="dropdown" />
            Emergencia
          </Accordion.Title>
          <Accordion.Content
            active={activeIndex === 0}
            style={{ overflowY: "auto", overflowX: "hidden", height: "100%" }}
          >
            <div align="center">
              {this.props.help.map((value, index) => (
                <SOSItem key={index} info={value} />
              ))}
              {this.props.help.length === 0
                ? "No hay emergencias reportadas"
                : null}
            </div>
          </Accordion.Content>

          <Accordion.Title
            active={activeIndex === 1}
            index={1}
            onClick={this.handleClick}
          >
            <Icon name="dropdown" />
            Soporte
          </Accordion.Title>
          <Accordion.Content
            active={activeIndex === 1}
            style={{ overflowY: "auto", overflowX: "hidden", height: "100%" }}
          >
            <div align="center">
              {this.props.support.map((value, index) => (
                <SupportItem key={index} info={value} />
              ))}
              {this.props.support.length === 0
                ? "No hay solicitudes de soporte reportadas"
                : null}
            </div>
          </Accordion.Content>

          <Accordion.Title
            active={activeIndex === 2}
            index={2}
            onClick={this.handleClick}
          >
            <Icon name="dropdown" />
            Solicitud de servicios
          </Accordion.Title>
          <Accordion.Content
            active={activeIndex === 2}
            style={{ overflowY: "auto", overflowX: "hidden", height: "100%" }}
          >
            <div align="center">
              {this.props.complaints.map((value, index) => (
                <ComplaimentItem key={index} info={value} />
              ))}
              {this.props.complaints.length === 0 ? "No hay solicitudes de servicios" : null}
            </div>
          </Accordion.Content>

          <Accordion.Title
            active={activeIndex === 3}
            index={3}
            onClick={this.handleClick}
          >
            <Icon name="dropdown" />
            Robo a casa habitación
          </Accordion.Title>
          <Accordion.Content
            active={activeIndex === 3}
            style={{ overflowY: "auto", overflowX: "hidden", height: "100%" }}
          >
            <div align="center">
              {this.props.calls.map((value, index) => (
                <RobberyItem
                  propsIniciales={this.props.propsIniciales}
                  key={index}
                  info={value}
                />
              ))}
              {this.props.calls.length === 0
                ? "No hay reportes de robos"
                : null}
            </div>
          </Accordion.Content>
          <Accordion.Title
            active={activeIndex === 4}
            index={4}
            onClick={this.handleClick}
          >
            <Icon name="dropdown" />
            Alerta Covid
          </Accordion.Title>
          <Accordion.Content
            active={activeIndex === 4}
            style={{ overflowY: "auto", overflowX: "hidden", height: "100%" }}
          >
            <div align="center">
              {this.props.alertaCovid.map((value, index) => (
                <CovidItem info={value} key={index} />
              ))}
              {this.props.alertaCovid.length === 0 && "No hay alertas de covid"}
            </div>
          </Accordion.Content>
        </Accordion>
      </div>
    );
  }

  _toggle = () => {
    this.refs.camInfoSideMenu.classList.remove("active-side");
    setTimeout(this.props.toggleSideMenu, 1000);
  };

  componentDidMount() {
    console.log(this.props);

    const element = this.refs.camInfoSideMenu;
    this.refs.camInfoSideMenu.classList.add("active-side");
    const navHeight = document.getElementsByTagName("nav")[0].scrollHeight;
    //const toolbar = document.getElementsByClassName('btn-toolbar')[0].scrollHeight
    const documentHeight = window.innerHeight;
    element.style.height = documentHeight - navHeight + "px";
    element.style.maxHeight = documentHeight - navHeight + "px";
    element.style.marginTop = navHeight + "px";
  }
}

export default Notifications;
