import React from 'react'
import { Divider, Card } from 'semantic-ui-react';

export default class SOSItem extends React.Component {
    render(){
        return(
            <Card className='cardmatchComtainer' onClick={this._godetails}>
            <Card.Content>      
                <Card.Description>
                    <div className =" imageContainer row">                        
                        <div className = 'col-12 limitlines' align='left'> 
                            <div align='right'>
                                {this.props.info?this.props.info.dateTime?this.props.info.dateTime:'25-03-2019 14:35':'25-03-2019 14:35'}
                            </div>
                            <div className="textcontainerdescription">
                                <div className='row'>
                                    <div className='col'>
                                        <b>Nombre:</b>
                                    </div>
                                    <div className='col'>
                                        {this.props.info.name}
                                    </div>
                                </div>
                              <Divider/>
                            </div>
                            <div align='right'>
                                <span className={this.props.info.status?"badge badge-success":this.props.info.status===undefined?"badge badge-success":"badge badge-danger"}>{this.props.info.status?'Abierto':this.props.info.status===undefined?'Abierto':'Cerrado'}</span>
                            </div>
                        </div>
                    </div>                    
                </Card.Description>
            </Card.Content>            
        </Card>)
    }

    _godetails = () => {

    }
}