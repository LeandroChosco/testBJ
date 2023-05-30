import React, { useEffect } from 'react';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory from 'react-bootstrap-table2-filter';
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';
import { ALL_USERS } from '../../graphql/queries';
import { useQuery } from '@apollo/client';

export default function RenderUsuarios(props) {

  const [setShowModalUser, users, setUsers, columnsUsers, clientId, token] = props.data

  const getAllUsers = () => {
    let { data, loading } = useQuery(ALL_USERS, {
      variables: {
        userId: 1,
        clientId: parseInt(clientId),
      },
      context: {
        headers: {
          "Authorization": token ? token : "",
        }
      }
    })

    if (!loading && data) {
      if (users !== data.getAllListUsers.response) {
        setUsers(data.getAllListUsers.response)
      }
    }
  }
  getAllUsers();

  return (
    <div className="containerTable">
      <div className="row containerTitle">
        <div className="col">
          <div>
            <input type="button" className="btn btnAdd" value="Agregar usuario" style={{ marginRight: "50px" }} onClick={() => setShowModalUser(true)} />
          </div>
          <hr />
          <h3 className="pt-2">Lista de usuarios</h3>
        </div>
      </div>
      {users && users.length === 0 ?
        <div className="row">
          <div className="col">
            <p>No hay usuarios que mostrar</p>
          </div>
        </div>
        :
        <BootstrapTable className="styleTable" hover="true" keyField='id' data={users ? users : []} columns={columnsUsers} pagination={paginationFactory()} filter={filterFactory()} />
      }
    </div>
  )
}