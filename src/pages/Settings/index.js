import React, { useState } from 'react';
import { Tab } from 'semantic-ui-react'
import { textFilter } from 'react-bootstrap-table2-filter';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';
import './style.css'

import ModalRegisterUser from '../../components/ModalRegisterUser/newUser';
import ModalResetPassword from '../../components/ModalRegisterUser/resetPassword';
import ModalUpdateUser from '../../components/ModalRegisterUser/updateUser.js';
import ModalDeleteUser from '../../components/ModalRegisterUser/deleteUser';


import ModalRegisterCamera from '../../components/ModalRegisterCamera/newCamera';

import Soporte from '../Soporte'

import conections from '../../conections';
import { ToastsContainer, ToastsStore } from "react-toasts";
import constants from '../../constants/constants'
import { TOKEN_FIX } from '../../constants/token'
import { ALL_USERS, CAMERA_FILTER } from '../../graphql/queries'
import { useQuery } from '@apollo/client'

import Actions from './Actions';
import RenderCamaras from './RenderCamaras';
import RenderUsuarios from './RenderUsuarios';

import "./styleTables.css"
import ActionsCuadrantes from './ActionsCuadrantes';
import RenderCuadrantes from './RenderCuadrantes';
import ModalManagmentCuadrantes from '../../components/ModalManagmentCuadrantes';

const Settings = (props, { showMatches }) => {

  // const { userIdData } = props;
  const token = TOKEN_FIX;

  const panes = [
    {
      menuItem: 'Registro de usuarios',
      render: () => <Tab.Pane attached={false}><RenderUsuarios data={[setShowModalUser, users, setUsers, columnsUsers, clientId, token]} /></Tab.Pane>,
    },
    {
      menuItem: 'Registro de cámaras',
      render: () => <Tab.Pane attached={false}><RenderCamaras data={[setShowModalCamera, cameras, setCameras, columnsCameras, clientId, token]} /></Tab.Pane>,
    },
    {
      menuItem: 'Asignación de cuadrantes',
      render: () => <Tab.Pane attached={false}><RenderCuadrantes data={[cuadrantes, setCuadrantes, columnsCuadrantes, clientId, token]} /></Tab.Pane>,
    },
    {
      menuItem: 'Acciones sobre catálogos',
      render: () => <Tab.Pane attached={false}><Soporte /></Tab.Pane>,
    },
  ]

  const [cameras, setCameras] = useState("")
  const [users, setUsers] = useState("")
  const [cuadrantes, setCuadrantes] = useState("")

  const [clientId, setClientId] = useState("")

  const [showModalUser, setShowModalUser] = useState(false);
  const [showModalResetPassword, setShowModalResetPassword] = useState(false);
  const [showModalUserUpdate, setShowModalUserUpdate] = useState(false);
  const [showModalUserDelete, setShowModalUserDelete] = useState(false);
  const [showModalManagmentCuadrantes, setShowModalManagmentCuadrantes] = useState(false);
  const [currentData, setCurrentData] = useState("")

  const [showModalCamera, setShowModalCamera] = useState(false);
  const [showModalCameraInputs, setShowModalCameraInputs] = useState(false);

  const getClient = () => {
    conections.getClients().then(res => {
      if (clientId !== res.data.data.getClients.filter(el => el.name === constants.client)[0].id) {
        setClientId(res.data.data.getClients.filter(el => el.name === constants.client)[0].id)
      }
    })
  }

  if (clientId === "") {
    getClient();
  }

  const actions = (cell, row, rowIndex, formatExtraData) => {
    return (
      <Actions data={[row, setCurrentData, setShowModalResetPassword, setShowModalUserUpdate, setShowModalUserDelete]} />
    )
  }

  const actionsCuadrantes = (cell, row, rowIndex, formatExtraData) => {
    return (
      <ActionsCuadrantes data={[row, setCurrentData, setShowModalManagmentCuadrantes]} />
    )
  }

  const columnsUsers = [{
    dataField: "user_nicename",
    text: 'NOMBRE',
    filter: textFilter({
      placeholder: 'Buscar por nombre'
    })
  }, {
    dataField: "user_login",
    text: 'USER',
    filter: textFilter({
      placeholder: 'Buscar por user'
    })
  }, {
    dataField: "user_email",
    text: 'EMAIL',
    filter: textFilter({
      placeholder: 'Buscar por correo'
    })
  }, {
    dataField: "cellphone",
    text: 'TELÉFONO',
    filter: textFilter({
      placeholder: 'Buscar por teléfono'
    })
  }, {
    dataField: "actions",
    text: '',
    formatter: actions,
  }];

  const columnsCameras = [{
    dataField: "id",
    text: 'ID',
    filter: textFilter({
      placeholder: 'Buscar ID...'
    })
  }, {
    dataField: "num_cam",
    text: 'NÚMERO DE CÁMARA',
    filter: textFilter({
      placeholder: "Buscar por número..."
    })
  }, {
    dataField: "camera_ip",
    text: 'IP CÁMARA',
    filter: textFilter({
      placeholder: 'Buscar IP...'
    })
  }, {
    dataField: "street",
    text: 'CALLE',
    filter: textFilter({
      placeholder: 'Buscar calle...'
    })
  }, {
    dataField: "active",
    text: 'ACTIVA',
    filter: textFilter({
      placeholder: 'Buscar por activa...'
    })
  }, {
    dataField: "flag_streaming",
    text: 'FLAG STREAMING',
    filter: textFilter({
      placeholder: 'Buscar por flag...'
    })
  }, {
    dataField: "User.user_login",
    text: 'USER',
    filter: textFilter({
      placeholder: 'Buscar por user...'
    })
  }];

  const columnsCuadrantes = [{
    dataField: "id",
    text: 'ID',
    filter: textFilter({
      placeholder: 'Buscar por id'
    })
  }, {
    dataField: "name",
    text: 'NOMBRE DEL CUADRANTE',
    filter: textFilter({
      placeholder: 'Buscar por nombre'
    })
  }, {
    dataField: "actions",
    text: '',
    formatter: actionsCuadrantes,
  }];

  const columnsUsersCuadrante = [{
    dataField: "user_nicename",
    text: 'NOMBRE',
    filter: textFilter({
      placeholder: 'Buscar por nombre'
    })
  }, {
    dataField: "user_login",
    text: 'USER',
    filter: textFilter({
      placeholder: 'Buscar por user'
    })
  }, {
    dataField: "user_email",
    text: 'EMAIL',
    filter: textFilter({
      placeholder: 'Buscar por correo'
    })
  }];


  const hideModal = (type) => {
    switch (type) {
      case "Nuevo usuario":
        setShowModalUser(false)
        break;
      case "Restaurar contraseña":
        setShowModalResetPassword(false)
        break;
      case "Actualizar usuario":
        setShowModalUserUpdate(false)
        break;
      case "Bloquear usuario":
        setShowModalUserDelete(false)
        break;
      case "Nueva cámara":
        setShowModalCamera(false)
        break;
      case "Gestionar cuadrante":
        setShowModalManagmentCuadrantes(false)
        break;
      default:
        break;
    }
  }

  const hideModalCameraInputs = () => {
    setShowModalCameraInputs(false)
  }

  return (
    <div className={!showMatches ? "hide-matches" : "show-matches"}>
      <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
      <ToastsContainer store={ToastsStore} />
      {showModalUser ?
        <ModalRegisterUser modal={showModalUser} stateModal={setShowModalUser} clientId={clientId} hide={() => hideModal("Nuevo usuario")} ></ModalRegisterUser>
        :
        showModalResetPassword ?
          <ModalResetPassword modal={showModalResetPassword} clientId={clientId} stateModal={setShowModalResetPassword} hide={() => hideModal("Restaurar contraseña")} data={currentData}></ModalResetPassword>
          :
          showModalUserUpdate ?
            <ModalUpdateUser modal={showModalUserUpdate} clientId={clientId} stateModal={setShowModalUserUpdate} hide={() => hideModal("Actualizar usuario")} data={currentData}></ModalUpdateUser>
            :
            showModalUserDelete ?
              <ModalDeleteUser modal={showModalUserDelete} clientId={clientId} stateModal={setShowModalUserDelete} hide={() => hideModal("Bloquear usuario")} data={currentData}></ModalDeleteUser>
              :
              showModalCamera ?
                <ModalRegisterCamera modal={showModalCamera} clientId={clientId} stateModal={setShowModalCamera} hide={() => hideModal("Nueva cámara")} modalInputs={[showModalCameraInputs, setShowModalCameraInputs, hideModalCameraInputs]} ></ModalRegisterCamera>
                :
                showModalManagmentCuadrantes ?
                  <ModalManagmentCuadrantes modal={showModalManagmentCuadrantes} users={users} columnsUsers={columnsUsersCuadrante} actualQuadrant={currentData} stateModal={setShowModalManagmentCuadrantes} clientId={clientId} hide={() => hideModal("Gestionar cuadrante")} currentData={currentData}></ModalManagmentCuadrantes>
                  :
                  null
      }
    </div>
  );
}

export default Settings;