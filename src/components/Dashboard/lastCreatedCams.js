import React from 'react';

const LastCreadedCams = (props) => {
  const { lastCreatedCams } = props;

  return (
    <div>
      <table className="table table-striped stiky">
        <thead>
          <tr>
            <th>Estatus</th>
            <th>Numero de camara</th>
            <th>Dirección</th>
            <th>Fecha Instalación</th>
          </tr>
        </thead>
        <tbody>
          {lastCreatedCams.map ? lastCreatedCams.map((value, index) =>
            <tr key={index} >
              <td><div className={'state' + value.flag_streaming}>&nbsp;</div></td>
              <td >{value.num_cam}</td>
              <td >{value.street} {value.number}, {value.town}, {value.township}, {value.state}</td>
              <td >{new Date(value.date_creation).toLocaleString()}</td>
            </tr>
          ) : <tr><td colSpan='4' align='center'>Sin datos que mostrar</td></tr>}
        </tbody>
      </table>
    </div>
  )
}

export default LastCreadedCams;