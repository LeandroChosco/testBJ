import React from 'react';
import { ClassicSpinner } from "react-spinners-kit";


const Loading = () => {

  return (
    <div align='center' style={{marginTop:10}}>
      <ClassicSpinner
        loading={true}
        size={40}
        color="#686769"
      />
    </div>
  )
};

export default Loading;