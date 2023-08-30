import React from 'react';
import constants from '../../constants/constants';

const LoadingLogo = () => {
    return (
        <div style={{ position: 'absolute', top: '30%', background: 'transparent', width: '100%' }} align='center'>
            <img
                className="spinner"
                src={constants.urlPath}
                style={{ width: "10%", borderRadius: "40%" }}
                alt={constants.urlPath} />
        </div>
    )
};

export default LoadingLogo;
