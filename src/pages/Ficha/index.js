import React, { Component } from 'react';
import '../../assets/styles/util.css';
import '../../assets/styles/main.css';
import '../../assets/fonts/iconic/css/material-design-iconic-font.min.css'
import './style.css'
import conections from '../../conections';
import {
  PieChart, 
  Pie, 
  Legend, 
  Tooltip, 
  Cell, 
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
  LabelList,  
  ComposedChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Text
} from 'recharts';
import ColorScheme from 'color-scheme'
import { ClassicSpinner } from "react-spinners-kit";
import Card from "../../components/Card/Card";
import CardHeader from "../../components/Card/CardHeader";
import CardBody from '../../components/Card/CardBody';
import neutralEmoji from '../../assets/images/emojis/neutral.png'
import sadEmoji from '../../assets/images/emojis/triste.png'
import happyEmoji from '../../assets/images/emojis/feliz.png'
import angryEmoji from '../../assets/images/emojis/enojado.png'
import surpriseEmoji from '../../assets/images/emojis/sorprendido.png'
import { Tab } from 'semantic-ui-react'
import socketIOClient from 'socket.io-client';
import sailsIOClient from 'sails.io.js';
import constants from '../../constants/constants';
import * as moment from 'moment'

const scm = new ColorScheme();
const COLORS =  scm.from_hue(235)
  .scheme('analogic')
  .distance(0.3)
  .add_complement(false)
  .variation('pastel')
  .web_safe(false).colors();


class Ficha extends Component {

    state = {    
      panes: [
        { menuItem: 'Ficha de incidencias', render: () => <Tab.Pane attached={false}>{this.renderFicha()}</Tab.Pane> },
      ]
    }


  renderFicha(){
    return(
      <>
        <div dangerouslySetInnerHTML={ {__html : '<iframe src="http://clientes.ubiqo.net/Publica/Inicio_Sesion.aspx?ReturnUrl=%2f" width="100%" height="800px"></iframe>'} } />
      </>
    )
  }


  render(){
    return(
      <div className={!this.props.showMatches ? "hide-matches" : "show-matches"}>
        <div className={this.props.showMatches ? "hide-matches" : "show-matches"}>

          <button className='btn clear pull-right' onClick={this.loadData}><i className={'fa fa-repeat'}></i>Actualizar</button>
        </div>
        <Tab menu={{ secondary: true, pointing: true }} panes={this.state.panes} />
      </div>
    )
  }

  componentWillUnmount(){    
    if (this.state.io) {
      if (this.state.io.socket.isConnected()) {
        this.state.io.socket.disconnect(); 
      }      
    }
  }




  componentDidMount() {    
              
  }


}



export default Ficha;
