import React, { Component } from 'react';
import { Card, Icon, Image } from 'semantic-ui-react'


class Match extends Component {   
    state = {
        seeMore: false
    }
    _changeSeeMore = () => {
        this.setState({seeMore: !this.state.seeMore})
    }
    render() {        
        return (
            <Card>
                <div className =" imageContainer row">
                    <div className = 'col'><Image src='https://react.semantic-ui.com/images/avatar/large/matthew.png' /></div>
                    <div className = 'col'><Image src='https://react.semantic-ui.com/images/avatar/large/matthew.png' /></div>
                </div>
                <Card.Content>
                <Card.Header>Jonh Doe</Card.Header>
                <Card.Meta>
                    <span className='date'>95% de coincidencia</span>
                </Card.Meta>
                <Card.Description>Matthew is a musician living in Nashville.</Card.Description>
                </Card.Content>
                <Card.Content extra>
                    {this.state.seeMore?
                        <div align ='justify'>Extra data</div>
                        :null}
                    <div onClick= {this._changeSeeMore}>{this.state.seeMore?'Leer menos':'Leer mas'}</div>                    
                
                </Card.Content>
            </Card>
        );
    }

       
}

export default Match;