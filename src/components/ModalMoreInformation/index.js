import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import conections from '../../conections';
import UserDetails from '../../components/UserDetails'

class ModalMoreInformation extends Component {
    state = { 
        dataUsuers: [],
        loading: true
     }
    render() { 
        return ( 
            <Modal size="lg"  show={this.props.modal} onHide={this.props.hide}>
                <Modal.Header closeButton>                      
                    <h3>{this.state.dataCam ? this.state.dataCam : 'Cargando..'}</h3>
                </Modal.Header>
                <Modal.Body className="pl-0 pr-0">
                    {this.state.dataUsuers.length !== 0?
                        this.state.dataUsuers.map(user =>(
                            <UserDetails key={user.u_user_id} dataUser={user}></UserDetails>
                        ))
                    :
                        this.state.loading 
                        ?
                            <p style={{textAlign: "center"}} >Obteniendo información..</p>
                        :
                            <p>No hay información que mostrar</p>
                    }
                    
                </Modal.Body>
            </Modal>
        );
    }

    componentDidMount(){
        //console.log('num_cam',this.props.num_cam)
        //console.log('dataname',this.props.data_cam)
        conections.getMoreInformationByCam(this.props.num_cam).then(res =>{
            //console.log('responde',res.data)
            if(res.status === 200){
                this.setState({dataUsuers: res.data, dataCam: this.props.data_cam})
            }

        })

    }
}
 
export default ModalMoreInformation;