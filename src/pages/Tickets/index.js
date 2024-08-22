import React, { Component } from 'react';
import '../../assets/styles/util.css';
import '../../assets/styles/main.css';
import '../../assets/fonts/iconic/css/material-design-iconic-font.min.css'
import './style.css'
// import constants from '../../constants/constants';
import conections from '../../conections';


class Tickets extends Component {

    state = {        
        tickets:[],
        error:undefined
    }

  render() {
    const {error, tickets} = this.state
    return (
        <div className='ticketContainer'>
          <div className='row header'>
                <div className ='col'>ID</div>
                <div className ='col'>Problema</div>
                <div className ='col'>Solucion</div>
                <div className ='col'>Fecha creacion</div>
                <div className ='col'>Usuario creacion</div>
                <div className ='col'>Fecha atencion/cierre</div>
                <div className ='col'>Usuario atencion/cierre</div>
              </div>
            {error!==undefined?error:
            tickets.map((ticket,index)=>
              <div className={'row ticket ticket'+(index%2)} key={index}>
                <div className ='col'>{ticket.id}</div>
                <div className ='col'>{ticket.problem}</div>
                <div className ='col'>{ticket.solution}</div>
                <div className ='col'>{new Date(ticket.date_creation).toLocaleString()}</div>
                <div className ='col'>{ticket.UserCreation.user_nicename}</div>
                <div className ='col'>{ticket.date_update?new Date(ticket.date_update).toLocaleString():null}</div>
                <div className ='col'>{ticket.UserUpdate?ticket.UserUpdate.user_nicename:null}</div>
              </div>
            )}
        </div>
    );
  }

  componentDidMount(){
    const auth = this.props.canAccess(6)
    console.log(auth)
    this.loadTickets()
  }

  loadTickets = async () =>{
    const t = await conections.getTickets() 
    if (t.status===200) {
      const data = t.data
      if (data.success) {
        this.setState({tickets:data.data})
      } else{
        this.setState({error:data.msg})
      }
    } else {
      this.setState({error:'Error al cargar informacion'})
    }
  }
}

export default Tickets;
