import React from 'react';

import { TagCount } from '../../components/IncidentsGraphics/TagCount';
import { TagTopLikes } from '../../components/IncidentsGraphics/TagTopLikes';

const GraphicIncidents = () => {
    return (
        <div className="row" style={{marginTop: "5rem"}}>
            <div className="col-6">
                <TagTopLikes />
            </div>
            <div className="col-6">
                <TagCount />
            </div>
        </div>
    )
}

export default GraphicIncidents;