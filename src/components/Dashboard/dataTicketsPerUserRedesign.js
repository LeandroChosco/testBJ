import React from 'react';
import { MODE } from '../../constants/token';

const DataTicketsPerUserRedesign = (props) => {
  const { dataTicketsPerUser } = props;

  const dataToTable = dataTicketsPerUser.created

  return (
    <div>
      <table className="table table-striped stiky">
        <thead>
          <tr>
            <th>Número</th>
            <th>Nombre</th>
            <th>Total de Tickets</th>
          </tr>
        </thead>
        <tbody style={{color: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "white" : "#666666"}}>
          {dataToTable.map ? dataToTable.map((value, index) =>
            <tr key={index} >
              <td >{index + 1}</td>
              <td >{value.name ? value.name : "--NOMBRE NO DISPONIBLE--"}</td>
              <td >{value.total}</td>
            </tr>
          ) : <tr><td colSpan='4' align='center'>Sin datos que mostrar</td></tr>}
        </tbody>
      </table>
    </div>
  )
}

export default DataTicketsPerUserRedesign;