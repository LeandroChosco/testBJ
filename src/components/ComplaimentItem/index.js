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
                                    <b>Nueva denuncia: </b>{this.props.info.description}
                                    <br/>
                                    <b>Ubicación: </b>{this.props.info.position}
                                </p>                                
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
        if(this.props.toggleControls){
            this.props.toggleControls() 
        }
        
        window.open(window.location.href.replace(window.location.pathname,'/').replace(window.location.search,'').replace(window.location.hash,'') + 'detalles/denuncia/' + this.props.info.id,'_blank','toolbar=0,location=0,directories=0,status=1,menubar=0,titlebar=0,scrollbars=1,resizable=1,width=850,height=700')

    }
}