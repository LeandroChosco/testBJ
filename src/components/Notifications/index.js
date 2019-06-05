import React, { Component } from 'react';
import { Accordion, Icon } from 'semantic-ui-react'

import SupportItem from '../SupportItem';
import SOSItem from '../SOSItem';

import '../../assets/styles/util.css';
import '../../assets/styles/main.css';
import '../../assets/fonts/iconic/css/material-design-iconic-font.min.css'
import '../../assets/fonts/font-awesome-4.7.0/css/font-awesome.min.css'
import 'semantic-ui-css/semantic.min.css'


class Notifications extends Component {   

    state = { 
        activeIndex: 0        
    }

    handleClick = (e, titleProps) => {
        const { index } = titleProps
        const { activeIndex } = this.state
        const newIndex = activeIndex === index ? -1 : index
    
        this.setState({ activeIndex: newIndex })
    }

    render() {
        const { activeIndex } = this.state
        return (
            <div ref='camInfoSideMenu' className="sidenav-right" style={{overflow:'hidden'}}>
                <button className="closebtn"  onClick={this._toggle}>&times;</button>   
                <Accordion styled>
                    <Accordion.Title active={activeIndex === 0} index={0} onClick={this.handleClick}>
                        <Icon name='dropdown' />
                        Emergencia
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === 0}>
                        <div align='center'>
                            {this.props.help.map((value, index)=><SOSItem key={index} info={value}/>)}
                            {this.props.help.length===0?'No hay emergencias reportadas':null}
                        </div>
                    </Accordion.Content>

                    <Accordion.Title active={activeIndex === 1} index={1} onClick={this.handleClick}>
                        <Icon name='dropdown' />
                        Soporte
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === 1}>
                        <div align='center'>
                            {this.props.support.map((value, index)=><SupportItem key={index} info={value}/>)}
                            {this.props.support.length===0?'No hay solicitudes de soporte reportadas':null}
                        </div>
                    </Accordion.Content>
                </Accordion>             
                {/* <div align = 'center'>
                    <Header>Emergencia</Header>
                </div>
                <div style={{height:'50%',overflowY:'scroll', position:'relative',overflowX:'hidden',paddingBottom: '50px',paddingTop: '15px'}}>                                        
                </div>
                <div align = 'center'>
                    <Header>Soporte</Header>
                </div>
                <div style={{height:'50%',overflowY:'scroll', position:'relative',overflowX:'hidden',paddingTop: '15px',paddingBottom: '50px'}}>                    
                    
                </div> */}
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
    }
}

export default Notifications;