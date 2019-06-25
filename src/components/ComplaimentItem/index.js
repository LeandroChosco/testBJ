import React from 'react'
import { Card } from 'semantic-ui-react';
export default class ComplaimentItem extends React.Component {
    
    render(){
        return(
            <div style={{padding:2}}>
            <Card className='cardmatchComtainer' onClick={this._godetails}>
            <Card.Content>      
                <Card.Description>
                    <div className =" imageContainer row">                        
                        <div className = 'col-12 limitlines' align='left'> 
                            <div align='right'>
                                {this.props.info?this.props.info.dateTime?this.props.info.dateTime.toDate().toLocaleString():'25-03-2019 14:35':'25-03-2019 14:35'}
                            </div>
                            <div className="textcontainerdescription">
                                <p>
                                    {'Nueva denuncia: '+this.props.info.msg}
                                </p>                                
                            </div>
                            <div align='right'>
                                <span className={this.props.info.status?"badge badge-success":this.props.info.status===undefined?"badge badge-success":"badge badge-danger"}>{this.props.info.status?'Abierto':this.props.info.status===undefined?'Abierto':'Cerrado'}</span>
                            </div>
                        </div>
                    </div>                     
                </Card.Description>
            </Card.Content>            
        </Card></div>)
    }

    componentDidMount(){
        console.log('proooops',this.props)

    }

    _godetails = () => {

    }
}