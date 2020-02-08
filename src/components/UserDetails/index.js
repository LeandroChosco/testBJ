import React, {useEffect} from "react";
import { Header, Button, Popup, Grid } from "semantic-ui-react";
import './style.css'
import firebaseC5 from '../../constants/configC5';

const style = {
  container: {
    opacity: 1
  }
};


const UserDetailsComponent = props => {
  const {dataUser, dataCamValue} = props

  const _gotoChats = () => {
    let userFound = false;
    //console.log('dataUser',dataUser);
    props.propsIniciales.chats.forEach((chat)=>{
      if (chat.user_creation == dataUser.u_user_id) {
        userFound = true;
        props.propsIniciales.history.push('/chat?f=2&u='+dataUser.u_user_id);
      }
    }) 
    
    if(!userFound){

      //console.log('no encontrado, cree chat');
      //console.log(props.dataCamValue);
      firebaseC5.app('c5cuajimalpa').firestore().collection('messages').add({
        c5Unread: 0,
        lastModification: new Date(),
        from: 'Chat Soporte',
        from_id: 1,
        messages:[
          {
            from:'support',
            dateTime: new Date(),
            msg:'Hola, ¿En que podemos asistir?'
          }
        ],
        user_creation: dataUser.u_user_id,
        user_name: dataUser.display_name,
        user_cam: dataCamValue
      })

      setTimeout(() => {
        props.propsIniciales.history.push('/chat?f=2&u='+dataUser.u_user_id);
      }, 1000);

    }
    
  };
  
  useEffect(()=>{
    //console.log(props)
  },[])

  return (
      <Grid centered divided columns={2} className="container">
        <Grid.Column textAlign="center">
          <Header as="h4">Información del Vecino</Header>
          <p>
            <b>Nombre: </b> {dataUser.display_name}
          </p>
          <p>
            <b>Telefono: </b> {dataUser.phone}
          </p>
          <p>
            <b>Celular: </b> {dataUser.cellphone}
          </p>
        </Grid.Column>
        <Grid.Column textAlign="center">
          <Button onClick={_gotoChats}>Enviar Mensaje</Button>
        </Grid.Column>
      </Grid>
    
  );
};

export default UserDetailsComponent;
