import React, { Component } from 'react';
import { Card, Image } from 'semantic-ui-react'
import { withRouter } from "react-router-dom";
import './style.css'

class Match extends Component {   
    state = {
        seeMore: false,
        imageCamera:'https://react.semantic-ui.com/images/avatar/large/matthew.png',
        imageDB:'https://react.semantic-ui.com/images/avatar/large/matthew.png',
        name: 'Jonh Doe',
        match:parseFloat(Math.random()*100).toFixed(2),
        description:'Matthew is a musician living in Nashville.',
        extraData:{

        }
    }
    _changeSeeMore = () => {
        //this.setState({seeMore: !this.state.seeMore})
    }
    render() {  
        if (this.props.isSmall) {
            return (
                <div style={{height:'65px',width:'65px', padding:5, position:'relative'}} onClick={this.props._toggleSmallBig}>
                    {this.props.info.status!==0?<div className='notificationDot'></div>:null}
                    {this.props.info.faceImage?
                        <Image style={{height:'100%',width:'100%', borderRadius:30}} src={'data:image/png;base64,'+this.props.info.faceImage} />:
                        <Image style={{height:'100%',width:'100%', borderRadius:30}} src={this.props.info.name?'http://95.216.37.253:3000/images/'+this.props.info.name.replace(/ /g,'')+'/'+this.props.info.messageId+'-face.jpeg':this.state.imageCamera} />
                    }
                    
                </div>
            )
        }      
        return (
            <Card className='cardmatchComtainer' onClick={this._godetails}>
                <Card.Content>                
                    {/* <Card.Meta>
                        <span className='date'>{this.state.match}% de coincidencia</span>
                    </Card.Meta> */}
                    <Card.Description>
                        <div className =" imageContainer row">
                            <div className = 'col-4 suspectPhoto' align="center">
                                {this.props.info.faceImage?
                                    <Image src={'data:image/png;base64,'+this.props.info.faceImage} />:
                                    <Image src={this.props.info.name?'http://95.216.37.253:3000/images/'+this.props.info.name.replace(/ /g,'')+'/'+this.props.info.messageId+'-face.jpeg':this.state.imageCamera} />
                                }
                            </div>
                            <div className = 'col-8 limitlines' align='left'> 
                                <div align='right'>
                                    {this.props.info?this.props.info.dateTime?this.props.info.dateTime:new Date(this.props.info.DwellTime).toLocaleString():'25-03-2019 14:35'}
                                </div>
                                <div className="textcontainerdescription">
                                    <p>
                                        <b>{this.props.info?this.props.info.name?this.props.info.name:this.props.info.IdentityName:this.state.name}</b>, 
                                        {this.props.info.location}
                                    </p>
                                </div>
                                <div align='right'>
                                    <span className={this.props.info.status?"badge badge-success":this.props.info.status===undefined?"badge badge-success":"badge badge-danger"}>{this.props.info.status?'Abierto':this.props.info.status===undefined?'Abierto':'Cerrado'}</span>
                                </div>
                            </div>
                        </div>                    
                    </Card.Description>
                </Card.Content>
                {/*<Card.Content extra onClick={this._godetails}>
                    Ver Detalles
                </Card.Content>*/}
            </Card>
        );
    }


    _godetails = () => {
        if(this.props.toggleControls){
            this.props.toggleControls() 
        }
        
        window.open(window.location.href.replace(window.location.pathname,'/').replace(window.location.search,'').replace(window.location.hash,'') + 'detalles/' + (this.props.info.messageId?this.props.info.messageId:this.props.info.id),'_blank','toolbar=0,location=0,directories=0,status=1,menubar=0,titlebar=0,scrollbars=1,resizable=1,width=650,height=500')
        //this.props.history.push('/detalles/'+this.state.extraData.id)
    }
    componentDidMount(){
        if(this.props.info){
            /*this.setState({
                name: this.props.info.title,
                imageCamera:this.props.info.images[0].original,
                imageDB:this.props.info.images[1]?this.props.info.images[1].original:this.props.info.images[0].original,
                description: this.props.info.description,
                extraData:this.props.info
            })*/
        }
    }
       
}

export default withRouter(Match);