import React, { Component } from 'react';
import { Header, Button, Image, Icon } from 'semantic-ui-react'
import Match from '../Match'
import responseJson from '../../assets/json/suspects.json'
import './style.css'
class CameraControls extends Component {
    
    state = {
        markers : [],
        photos:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14],
        videos:[1,2,3,4,5,6,7,8],
        active:false,
        isSlide:false
    }

  render() {
    return (
    <div className="bottomMenu">   
        {this.props.active?<div className="row p10 headerBottomMenu m-b-4">
            <div className="col-3">
                <Header size="large">Camara {this.props.camera.id}</Header>
                 {this.props.camera.name}
            </div>
            <div className="col-7">  
            <div>
                    <Button>
                        <Icon name='record' />
                        Grabar
                    </Button>
                    <Button>
                        <Icon name='camera' />
                        Tomar foto
                    </Button>
                    <Button>
                        <Icon name='pause' />
                        Pausa
                    </Button>
                    <Button>
                        <Icon name='stop' />
                        Parar
                    </Button>

                </div>              
            </div>
            <div className="col" align="right">
                {!this.state.isSlide?<Button basic onClick={this._closeControl}>&times;</Button>:null}
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
            <div className="col" align="center">
                Historial
                {this.state.markers.map((value, index)=><Match key={index} info={value} toggleControls={this._closeControl} />)}
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
        document.getElementsByClassName('gridCameraContainer')[0].style.overflowY = 'auto'  
        document.getElementsByClassName('gridCameraContainer')[0].style.pointerEvents = 'auto'             
        if(this.state.isSlide){
            const carouselContainer = document.getElementsByClassName('carouselContainer')[0]             
            const fullcontainer = document.getElementsByClassName('fullcontainer')[0] 
            fullcontainer.style.height = '100%'            
            carouselContainer.style.height = '100%'   
            bottomMenu.style.position = 'fixed'
            bottomMenu.style.height = 'auto'         
            
        } 
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
       const carouselContainer = document.getElementsByClassName('carouselContainer')[0] 
        if(carouselContainer){
            this.setState({isSlide:true})
            const fullcontainer = document.getElementsByClassName('fullcontainer')[0] 
            fullcontainer.style.height = 'auto'            
            carouselContainer.style.height = 'auto'  
            bottomMenu.style.position = 'relative'  
            bottomMenu.style.height = 'auto'            
        } else {
            document.getElementsByClassName('fullcontainer')[0].style.overflowY = 'hidden'  
            document.getElementsByClassName('fullcontainer')[0].style.pointerEvents = 'none'  
            document.getElementsByClassName('fullcontainer')[0].style.opacity = 0.5
            document.getElementsByClassName('gridCameraContainer')[0].style.overflowY = 'hidden'  
            document.getElementsByClassName('gridCameraContainer')[0].style.pointerEvents = 'none'              
            bottomMenu.style.position = 'fixed'            
            bottomMenu.scrollTop = 0
            bottomMenu.classList.add('active-bottom')      
              
        }  
        let cameras = []
          for(let item in responseJson.items){
            let suspect = responseJson.items[item]            
            //if(suspect.person_classification !== "Victim"){
              suspect.description = suspect.description.replace(/<p>/g,'').replace(/<\/p>/g,'')                            
              cameras.push(suspect)
            //}
          }       
        this.setState({markers:cameras})                                     
    }

}

export default CameraControls;