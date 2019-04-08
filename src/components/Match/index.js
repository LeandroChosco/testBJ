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
        return (
            <Card className='cardmatchComtainer' onClick={this._godetails}>
                <Card.Content>                
                    {/* <Card.Meta>
                        <span className='date'>{this.state.match}% de coincidencia</span>
                    </Card.Meta> */}
                    <Card.Description>
                        <div className =" imageContainer row">
                            <div className = 'col-4 suspectPhoto' align="center"><Image src={this.state.imageCamera} /></div>
                            <div className = 'col-8 limitlines' align='left'> 
                                <div align='right'>
                                    25-03-2019 14:35
                                </div>
                                <div className="textcontainerdescription">
                                    <p>
                                        <b>{this.state.name}</b>, 
                                        {this.state.description}
                                    </p>
                                </div>
                                <div align='right'>
                                    <span className="badge badge-danger">Cerrado</span>
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
        
        window.open(window.location.href.replace(window.location.pathname,'/') + 'detalles/' + this.state.extraData.id,'_blank','toolbar=0,location=0,directories=0,status=1,menubar=0,titlebar=0,scrollbars=1,resizable=1,width=650,height=500')
        //this.props.history.push('/detalles/'+this.state.extraData.id)
    }
    componentDidMount(){
        if(this.props.info){
            this.setState({
                name: this.props.info.title,
                imageCamera:this.props.info.images[0].original,
                imageDB:this.props.info.images[1]?this.props.info.images[1].original:this.props.info.images[0].original,
                description: this.props.info.description,
                extraData:this.props.info
            })
        }
    }
       
}

export default withRouter(Match);