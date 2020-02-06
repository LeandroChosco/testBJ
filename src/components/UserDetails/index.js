import React from "react";
import { Header, Button, Popup, Grid } from "semantic-ui-react";

const style = {
  container: {
    opacity: 1
  }
};

const ToolTipComponent = props => {
  const _gotoChats = () => {
    console.log(props);
    this.props.history.push('/chat?f=2&u='+this.props.user_id)
  };
  return (
      <Grid centered divided columns={2}>
        <Grid.Column textAlign="center">
          <Header as="h4">Informacion de Vecino</Header>
          <p>
            <b>Nombre: </b> {this.props.name}
          </p>
          <p>
            <b>Telefono: </b> {this.props.phone}
          </p>
          <p>
            <b>Celular: </b> {this.props.cellphone}
          </p>
        </Grid.Column>
        <Grid.Column textAlign="center">
          <Button onClick={_gotoChats}>Enviar Mensaje</Button>
        </Grid.Column>
      </Grid>
    
  );
};

export default ToolTipComponent;
