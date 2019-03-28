import React, { Component } from 'react';
import { Header, Button, Image, Icon } from 'semantic-ui-react'

import './style.css'
class CameraControls extends Component {
    
    state = {
        markers : [],
        photos:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14],
        videos:[1,2,3,4,5,6,7,8],
        active:false
    }

  render() {
    return (
    <div className="bottomMenu">   
        {this.props.active?<div className="row p10 headerBottomMenu">
            <div className="col-3">
                <Header size="large">Camara {this.props.camera.id}</Header>
            </div>
            <div className="col-7">
                <Header size="small"> {this.props.camera.name}</Header>
            </div>
            <div className="col" align="right">
                <Button basic onClick={this._closeControl}>&times;</Button>
            </div>
        </div>  : null  } 
        <div className="row fullHeight p10">
            <div className="col snapshots">
                Fotos
                <div className="row">
                    {this.state.photos.map(value=><div key={value} className="col-6 p10">
                        <Image src="https://via.placeholder.com/150"/>
                    </div>)}
                </div>
            </div>
            <div className="col videos">
                Videos
                <div className="row">
                    {this.state.videos.map(value=><div key={value} className="col-6 p10">
                        <Image src="https://via.placeholder.com/150"/>
                    </div>)}
                </div>
            </div>
            <div className="col">
                Controles
                <div>
                    <Button>
                        <Icon name='record' />
                        Grabar
                    </Button>
                    <Button>
                        <Icon name='camera' />
                        Tomar foto
                    </Button>
                </div>
            </div>
        </div>       
    </div>
    );
  }

    _closeControl = () =>{
        const bottomMenu = document.getElementsByClassName('bottomMenu')[0]
        bottomMenu.classList.remove('active-bottom')
        document.getElementsByClassName('fullcontainer')[0].style.overflow = 'auto'
        document.getElementsByClassName('fullcontainer')[0].style.pointerEvents = 'auto'
        document.getElementsByClassName('fullcontainer')[0].style.opacity = 1     
        setTimeout(this.closeDefinitely,500)     
    }   

    closeDefinitely = () => {
        console.log('called')
        this.props.toggleControls()
    }
    componentDidMount(){               
        console.log(this.props)        
        /*var buttonBar = document.getElementsByClassName('btn-toolbar')[0].scrollHeight
        const navHeight = document.getElementsByTagName('nav')[0].scrollHeight
        if((document.getElementsByClassName('btn-toolbar')[0].getBoundingClientRect().y-navHeight) < 0        ){
            buttonBar = 0
        }
        const documentHeight = window.innerHeight                                    
        //bottomMenu.style.height = documentHeight - navHeight - buttonBar + 'px'
        //bottomMenu.style.marginTop =  navHeight + buttonBar + 'px'
        */
        const bottomMenu = document.getElementsByClassName('bottomMenu')[0]  
        document.getElementsByClassName('fullcontainer')[0].style.overflow = 'hidden'  
        document.getElementsByClassName('fullcontainer')[0].style.pointerEvents = 'none'  
        document.getElementsByClassName('fullcontainer')[0].style.opacity = 0.5   
        bottomMenu.style.opacity = 1         
        bottomMenu.scrollTop = 0
        bottomMenu.classList.add('active-bottom')        
    }

}

export default CameraControls;