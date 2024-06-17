import React from 'react';
import constants from '../../constants/constants';
import { MODE } from '../../constants/token';

const LoadingLogo = () => {
    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", position: 'absolute', width: '100%', height: "100%", background: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "var(--dark-mode-color)" : "white" }} align='center'>
            <img
                className="spinner"
                src={constants.urlPath}
                style={{ width: "12.5rem", height: "12.5rem", marginBottom: "12.5%" }}
                alt={constants.urlPath} />
        </div>
    )
};

export default LoadingLogo;
