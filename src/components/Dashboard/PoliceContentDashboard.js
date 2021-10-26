import React from 'react';
import '../../pages/Policia/style.css'
import Incidencia from './Incidencia';
import Police from './Police';
import PoliceDashboard from './PoliceDashboard';
import TotalMonth from './TotalMonth';


const PoliceContentDashboard = (props) => {
  const { data } = props;

    return (
      <div className='dash'>
        <div className='dash-containt'>
          <h2>Casos Registrados: {data && data.length}</h2>
          <TotalMonth data={data} />
        </div>
        <div className='dash-containt'>
          <h2>Sector</h2>
          <PoliceDashboard data={data} />
        </div>
        <div className='dash-containt'>
          <h2>Incidencias</h2>
          <Incidencia data={data} />
        </div>
        <div className='dash-containt'>
          <h2>Funcionarios</h2>
          <Police data={data} />
        </div>
      </div>
    );
}

export default PoliceContentDashboard;