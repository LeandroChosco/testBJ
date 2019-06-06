import React from 'react'
import { Divider, Card } from 'semantic-ui-react';

export default class SOSItem extends React.Component {
    render(){
        return(
            <Card onClick={this._godetails} style={{marginTop:'10px',padding:0,width:'100%'}}>
            <Card.Content style={{paddingBottom:0}}>
                <Card.Description>
                    <div className ="row" style={{fontSize:'.8rem', position:'relative'}}>                        
                        <div className = 'col-12' align='left'> 
                            <div align='right'>
                                {this.props.info?this.props.info.dateTime?this.props.info.dateTime:'25-03-2019 14:35':'25-03-2019 14:35'}
                            </div>
                            
                                <div className='row'>
                                    <div className='col-5'>
                                        <b>Nombre:</b>
                                    </div>
                                    {this.props.info.userInfo.Person?<div className='col-7'>
                                        {this.props.info.userInfo.Person.name} {this.props.info.userInfo.Person.surname} {this.props.info.userInfo.Person.lastname}
                                    </div>:null}
                                </div>
                              <Divider/>                            
                                <div className='row'>
                                    <div className='col-5'>
                                        <b>Tipo de emergencia:</b>
                                    </div>
                                    <div className='col-7'>
                                        {this.props.info.title}
                                    </div>
                                </div>
                              <Divider/> 
                              <div className='row'>
                                    <div className='col-5'>
                                        <b>Fecha y hora:</b>
                                    </div>
                                    <div className='col-7'>
                                        {this.props.info.dateTime}
                                    </div>
                                </div>                                                       
                            <div align='right' style={{fontSize:'1.2rem'}}>
                                <span className={this.props.info.status===0?"badge badge-success":this.props.info.status===3||this.props.info.status===1?"badge badge-danger":"badge badge-warning"}>{this.props.info.status===0?"En proceso":this.props.info.status===3?"Cancelado":this.props.info.status===1?"Finalizado":"No finalizado"}</span>
                            </div>
                        </div>
                    </div>                    
                </Card.Description>
            </Card.Content>            
        </Card>)
    }

    _godetails = () => {
        if(this.props.toggleControls){
            this.props.toggleControls() 
        }
        
        window.open(window.location.href.replace(window.location.pathname,'/') + 'detalles/emergency/' + this.props.info.id,'_blank','toolbar=0,location=0,directories=0,status=1,menubar=0,titlebar=0,scrollbars=1,resizable=1,width=650,height=500')
    }
}