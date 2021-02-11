import React from 'react';
import {
 XAxis, YAxis, CartesianGrid, Tooltip,ResponsiveContainer,Legend,ComposedChart,Bar
} from 'recharts';

const styles ={
  noData:{
     position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        justifyContent: 'center',
        alignItems: 'center', 
        display:"flex"
  }
}

const PeoplePerDay =(props) =>{
  const { data } = props;
    return (
      <ResponsiveContainer>
      {
        data.length > 0 ?
        <ComposedChart
        data={data}
        margin={{
          top: 5, right: 30, left: 20, bottom: 5,
        }}
        >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="fecha"/>
        <YAxis allowDecimals={false} type="number" name="Personas" />
        <Tooltip itemStyle={{color:"#666666"}} cursor={{ strokeDasharray: '3 3' }}/>
        <Legend />
        <Bar dataKey="total" fill='rgba(54, 162, 235, 0.8)' stroke='rgba(54, 162, 235, 2)'/>
        </ComposedChart>
        :
        <div style={styles.noData}>No hay datos dispononibles</div>

      }
      </ResponsiveContainer>
    );
}

export default PeoplePerDay;