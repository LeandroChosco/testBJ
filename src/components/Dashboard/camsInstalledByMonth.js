import React from 'react';
import ColorScheme from 'color-scheme';
import {
  Legend,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
  ComposedChart,
} from 'recharts';

const scm = new ColorScheme();
const COLORS = scm.from_hue(235)
  .scheme('analogic')
  .distance(0.3)
  .add_complement(false)
  .variation('pastel')
  .web_safe(false).colors();


const CamsInstalledByMonth = (props) => {
  const { installed_by_moth } = props;
  return (
    <ResponsiveContainer>
      <ComposedChart
        data={installed_by_moth}
        margin={{
          top: 5, right: 30, left: 20, bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="fecha" />
        <YAxis allowDecimals={false} />
        <Tooltip itemStyle={{ color: "#666666" }} />
        <Legend />
        <Bar dataKey="total" fill={'#' + COLORS[2]} />
      </ComposedChart>
    </ResponsiveContainer>
  )
}

export default CamsInstalledByMonth;