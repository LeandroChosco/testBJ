import React, { Component } from 'react';
import '../../assets/styles/util.css';
import '../../assets/styles/main.css';
import '../../assets/fonts/iconic/css/material-design-iconic-font.min.css'
import './style.css'
import ColorScheme from 'color-scheme'
import { Tab } from 'semantic-ui-react'

const scm = new ColorScheme();
const COLORS =  scm.from_hue(235)
  .scheme('analogic')
  .distance(0.3)
  .add_complement(false)
  .variation('pastel')
  .web_safe(false).colors();

class Alarma extends Component {

    state = {    
      panes: [
        { menuItem: 'Alarma', render: () => <Tab.Pane attached={false}>{this.renderAlarma()}</Tab.Pane> },
      ]
    }

    alarmas(){
        window.open('http://alarma.energetikadevelepment.com:8080/', 'Data','height=600,width=1200')
    }

  renderAlarma(){
    return(
      <>
        <div><a onClick={this.alarmas}>Abrir Alarm Panel</a></div>
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



export default Alarma;
