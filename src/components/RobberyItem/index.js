import React from 'react'
import { Divider, Card } from 'semantic-ui-react';
import { withRouter } from "react-router-dom";
class RobberyItem extends React.Component {
   
    render(){
        return(
            <Card onClick={this._godetails} style={{marginTop:'10px',padding:0,width:'100%'}}>
            <Card.Content style={{paddingBottom:0}}>
                <Card.Description>
                    <div className ="row" style={{fontSize:'.8rem', position:'relative'}}>                        
                        <div className = 'col-12' align='left'> 
                            <div align='right'>
                                {this.props.info?this.props.info.dateTime?this.props.info.dateTime.toDate().toLocaleString():'25-03-2019 14:35':'25-03-2019 14:35'}
                            </div>
                            
                                <div className='row'>
                                    <div className='col-4'>
                                        <b>Nombre:</b>
                                    </div>
                                    {this.props.info.user_nicename?<div className='col-8'>
                                        {this.props.info.user_nicename}
                                    </div>:null}
                                </div>
                              <Divider/>                            
                                <div className='row'>
                                    <div className='col-4'>
                                        <b>Dirección:</b>
                                    </div>
                                    <div className='col-8'>
                                        {this.props.info.state} <b>{' Calle: '+this.props.info.street+ ' #'+this.props.info.number}</b> {' Col: '+this.props.info.town}
                                    </div>
                                </div>
                              <Divider/> 
                              <div className='row'>
                                    <div className='col-4'>
                                        <b>Fecha y hora:</b>
                                    </div>
                                    <div className='col-8'>
                                        {this.props.info.dateTime.toDate().toLocaleString()}
                                    </div>
                                </div>                                                       
                            <div align='right' style={{fontSize:'1.2rem'}}>
                                <span className={this.props.info.status===1?"badge badge-success":this.props.info.status===0||this.props.info.status===2?"badge badge-danger":"badge badge-warning"}>{this.props.info.status===1?"Abierto":this.props.info.status===2?"Cancelado":this.props.info.status===0?"Finalizado":"No finalizado"}</span>
                            </div>
                        </div>
                    </div>                    
                </Card.Description>
            </Card.Content>            
        </Card>)
    
    }

    componentDidMount(){
        console.log('proooops',this.props)

    }

    _godetails = () => {
        this.props.history.push('/chat?f=2&u='+this.props.info.user_id)
    }
}

export default withRouter(RobberyItem)