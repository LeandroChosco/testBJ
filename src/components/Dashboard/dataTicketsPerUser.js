import React from 'react';
import ColorScheme from 'color-scheme';
import { 
  Tooltip, 
  Cell, 
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
  LabelList,  
  ComposedChart,
} from 'recharts';

const scm = new ColorScheme();
const COLORS = scm.from_hue(235)
  .scheme('analogic')
  .distance(0.3)
  .add_complement(false)
  .variation('pastel')
  .web_safe(false).colors();


const DataTicketsPerUser = (props) => {
  const { dataTicketsPerUser, customLabel } = props;
  return (
    <ResponsiveContainer>
      <ComposedChart
        data={dataTicketsPerUser.created}
        layout='vertical'
        margin={{
          top: 5, right: 30, left: 20, bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis
          dataKey="name"
          type="category"
          hide={true}
        />
        <Tooltip />
        <Bar barSize={30} dataKey="total" fill="#8884d8" >
          <LabelList
            dataKey="name"
            position="right"
            fill='#000'

            content={customLabel}
          />
          {
            dataTicketsPerUser.created.map((entry, index) => <Cell key={`cell-${index}`} fill={'#' + COLORS[index % COLORS.length]} />)
          }
        </Bar>
      </ComposedChart>
    </ResponsiveContainer>
  )
}

export default DataTicketsPerUser;