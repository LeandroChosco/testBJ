import React, { Component } from 'react';
import { Card, Icon, Image, Divider } from 'semantic-ui-react'


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
        this.setState({seeMore: !this.state.seeMore})
    }
    render() {        
        return (
            <Card>
                <div className =" imageContainer row">
                    <div className = 'col'><Image src={this.state.imageCamera} /></div>
                    <div className = 'col'><Image src={this.state.imageDB} /></div>
                </div>
                <Card.Content>
                <Card.Header>{this.state.name}</Card.Header>
                <Card.Meta>
                    <span className='date'>{this.state.match}% de coincidencia</span>
                </Card.Meta>
                <Card.Description>{this.state.description}</Card.Description>
                </Card.Content>
                <Card.Content extra>
                    {this.state.seeMore?
                        <div align ='justify'>                            
                            <div className='row'>
                                <div className='col-4'>
                                    <p>Name:</p>
                                </div>
                                <div className='col-8'>
                                    <p>John Doe</p>
                                </div>                
                            </div>

                            <div className='row'>
                                <div className='col-4'>
                                    <p>Aliases:</p>
                                </div>
                                <div className='col-8'>
                                    <p> "John Roe", "Richard Roe", "Jane Roe" and "Baby Doe", "Janie Doe" or "Johnny Doe"</p>
                                </div>                
                            </div>

                            <div className='row'>
                                <div className='col-4'>
                                    <p>Details:</p>
                                </div>
                                <div className='col-8'>
                                    <p>{this.state.extraData?this.state.extraData.description:''}</p>
                                </div>                
                            </div>

                            <div className='row'>
                                <div className='col-4'>
                                    <p>Place of birth:</p>
                                </div>
                                <div className='col-8'>
                                    <p>PASADENA, CALIFORNIA, United States</p>
                                </div>                
                            </div>

                            <div className='row'>
                                <div className='col-4'>
                                    <p>Date of birth:</p>
                                </div>
                                <div className='col-8'>
                                    <p>March 28, 1979</p>
                                </div>                
                            </div>

                            <div className='row'>
                                <div className='col-4'>
                                    <p>Nationality:</p>
                                </div>
                                <div className='col-8'>
                                <p>American</p>
                                </div>                
                            </div>                            
                            <div>
                                <p> Physical description</p>  
                            </div>
                            <Divider/>            

                            <div className='row'>
                                <div className='col-4'>
                                <p>Height:</p>
                                </div>
                                <div className='col-8'>
                                <p>1.85 metres</p>
                                </div>                
                            </div>

                            <div className='row'>
                                <div className='col-4'>
                                <p>Weight:</p>
                                </div>
                                <div className='col-8'>
                                <p>82 kilograms</p>
                                </div>                
                            </div>

                            <div className='row'>
                                <div className='col-4'>
                                <p>Colour of hair:</p>
                                </div>
                                <div className='col-8'>
                                <p>Grey</p>
                                </div>                
                            </div>

                            <div className='row'>
                                <div className='col-4'>
                                <p>Colour of eyes:</p>
                                </div>
                                <div className='col-8'>
                                <p>Brown</p>
                                </div>                
                            </div>

                            <div className='row'>
                                <div className='col-4'>
                                <p>Scars and Marks:</p>
                                </div>
                                <div className='col-8'>
                                <p>John Doe has a cleft chin and a surgical scar on his lower back.</p>
                                </div>                
                            </div>

                        </div>
                        :null}
                    <div onClick= {this._changeSeeMore}>{this.state.seeMore?'Leer menos':'Leer mas'}</div>                    
                
                </Card.Content>
            </Card>
        );
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

export default Match;