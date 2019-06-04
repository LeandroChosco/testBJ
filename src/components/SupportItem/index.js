import React from 'react'
import { Card } from 'semantic-ui-react';
export default class SupportItem extends React.Component {
    state= {
        cat_problems:[
            "otro",
            "no puede dar de alta su cámara",
            "no visualiza su camara",
            "no puede tomar fotos",
            "no puede tomar videos"
        ]
    }
    render(){
        return(
            <div style={{padding:2}}>
            <Card className='cardmatchComtainer' onClick={this._godetails}>
            <Card.Content>      
                <Card.Description>
                    <div className =" imageContainer row">                        
                        <div className = 'col-12 limitlines' align='left'> 
                            <div align='right'>
                                {this.props.info?this.props.info.dateTime?this.props.info.dateTime:'25-03-2019 14:35':'25-03-2019 14:35'}
                            </div>
                            <div className="textcontainerdescription">
                                <p>
                                    El usuario <b>{this.props.info.user_name}</b> {this.props.info.id_problem!==0?this.state.cat_problems[this.props.info.id_problem]:'esta reportando el siguiente problema: '+this.props.info.msg}
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