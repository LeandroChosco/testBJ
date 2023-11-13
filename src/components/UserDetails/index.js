import React, { useEffect } from "react";
import { Header, Button, Grid } from "semantic-ui-react";

import firebaseC5cuajimalpa from "../../constants/configC5CJ";
const handleComplaintsRedirect = (userId, chatId) => {
  return window.location.href = window.location.href.replace(window.location.search, '').replace(window.location.hash, '').replace(window.location.pathname, `/chat/${userId}/${chatId}`)
}

const UserDetailsComponent = props => {
  const { dataUser, dataCamValue } = props;

  const _gotoChats = () => {
    let userFound = false;
    //console.log('dataUser',dataUser);
    props.propsIniciales.chats.forEach(chat => {
      if (chat.user_creation === dataUser.u_user_id) {
        userFound = true;
        // props.propsIniciales.history.push("/chat?f=2&u=" + dataUser.u_user_id);
        handleComplaintsRedirect(chat.c5Unread, chat.id)
      }
    });

    if (!userFound) {

      function formatDate(date) {

        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      }

      let dateToUpdate = new Date();
      //console.log('no encontrado, cree chat');
      //console.log(props.dataCamValue);
      firebaseC5cuajimalpa
        .app("c5benito")
        .firestore()
        .collection("messages")
        .add({
          updateDate: formatDate(dateToUpdate),
          c5Unread: 0,
          lastModification: new Date(),
          from: "Chat Soporte",
          from_id: 1,
          messages: [
            {
              from: "support",
              dateTime: new Date(),
              msg: "Hola, ¿En que podemos asistir?"
            }
          ],
          user_creation: dataUser.u_user_id,
          user_name: dataUser.display_name,
          user_cam: dataCamValue
        })
        .then((data) => {
          setTimeout(() => {
            handleComplaintsRedirect(0, data.id)
          }, 1000);
        })

        ;


    }
  };

  useEffect(() => {
    //console.log(props)
  }, []);

  return (
    <React.Fragment>
      <Grid centered divided columns={2} className="containerInfo">
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
    </React.Fragment>
  );
};

export default UserDetailsComponent;
