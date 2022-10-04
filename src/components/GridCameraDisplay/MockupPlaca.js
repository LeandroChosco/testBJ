import React from 'react';

import './styleMockup.css';

function MockupPlaca(props) {

    const { plate, idx } = props

    return (
        <div className= {idx === 0 ? "newResult" : "result"}>
            <div className="listDeco">
                <div className="decoTop" />
                <div className="decoTop" />
            </div>
            <div className="number">
                {plate}
            </div>
            <div className="listDeco">
                <div className="decoBottom" />
                <div className="decoBottom" />
            </div>
        </div>
    )
}

export default MockupPlaca;