import React from 'react';
import {
  ScatterChart,
   Scatter,
  XAxis, YAxis, CartesianGrid,
  Tooltip,
  Cell, ResponsiveContainer
} from 'recharts';

const styles = {
  noData: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
    display: "flex"
  }
}

const CameraPerPerson = (props) => {
  const { data } = props;

  return (
    <ResponsiveContainer>
      {
        data.length > 0 ?
          <ScatterChart
            margin={{
              top: 20, right: 20, bottom: 20, left: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3"/>
            <XAxis type="category" dataKey="x" name="Cámara" />
            <YAxis type="number" dataKey="y" name="Personas" />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Scatter name="camaras" data={data} fill= '#1ab7ea'>
            </Scatter>
          </ScatterChart>
          :
          <div style={styles.noData}>No hay datos dispononibles</div>
      }
    </ResponsiveContainer>
  );
}

export default CameraPerPerson;






