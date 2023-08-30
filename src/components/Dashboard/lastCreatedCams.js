import React from 'react';
import moment from 'moment';

const LastCreadedCams = (props) => {
  const { lastCreatedCams } = props;
  return (
    <div>
      <table className="table table-striped stiky">
        <thead>
          <tr>
            <th>Estado</th>
            <th>Número de cámara</th>
            <th>Dirección</th>
            <th>Fecha de instalación</th>
          </tr>
        </thead>
        <tbody>
          {lastCreatedCams.map && lastCreatedCams.length > 0 ? lastCreatedCams.map((value, index) => {
            const date = moment(value.date_creation).isValid() ? new Date(value.date_creation).toLocaleString() : 'Sin Fecha';
            const colorDot = value.active === 0 ? 'state0' : value.flag_streaming === 0 ? 'state1' : 'state2'
            return (
              <tr key={index} >
                <td><div className={colorDot}>&nbsp;</div></td>
                <td >{value.num_cam}</td>
                <td >{value.street} {value.number}, {value.town}, {value.township}, {value.state}</td>
                <td >{date}</td>
              </tr>
            )
          }) : <tr><td colSpan='4' align='center'>Sin datos que mostrar</td></tr>}
        </tbody>
      </table>
    </div>
  )
}

export default LastCreadedCams;