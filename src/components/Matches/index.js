import React, { Component } from 'react';
import Match from '../Match';
import responseJson from '../../assets/json/suspects.json'

import 'semantic-ui-css/semantic.min.css'
import '../../assets/styles/util.css';
import '../../assets/styles/main.css';
import '../../assets/fonts/iconic/css/material-design-iconic-font.min.css'
import '../../assets/fonts/font-awesome-4.7.0/css/font-awesome.min.css'


class Matches extends Component {   

    state = { 
        activeIndex: 0,    
        matchs:[],
        small:true
    }

    handleClick = (e, titleProps) => {
        const { index } = titleProps
        const { activeIndex } = this.state
        const newIndex = activeIndex === index ? -1 : index
    
        this.setState({ activeIndex: newIndex })
    }

    render() {
        return (
            <div ref='camInfoSideMenu' className={this.state.small?"sidenav-right matchesContainer":"sidenav-right active-side"}>                             
                <div align='center'>
                    {this.props.matchs.map((value, index)=><Match _toggleSmallBig={this._toggleSmallBig} key={index} isSmall={this.state.small} info={value}/>)}
                </div>
            </div>
        );
    }

    _toggle = () => {
        this.refs.camInfoSideMenu.classList.remove('active-side')        
        setTimeout(this.props.toggleSideMenu,1000)
    }

    _toggleSmallBig = () => {
        this.setState({small:!this.state.small})
    }

    componentDidMount() {
        const element  = this.refs.camInfoSideMenu
        //this.refs.camInfoSideMenu.classList.add('active-side') 
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
        document.addEventListener('mousedown',this._handleMouseClick,false)
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown',this._handleMouseClick,false)
    }

    _handleMouseClick = (e) => {
        if(this.refs.camInfoSideMenu.contains(e.target)){
            return;
        }

        this.setState({small:true})
    } 
}

export default Matches;