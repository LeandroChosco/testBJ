import React, { useEffect, useState } from 'react';

import { TagCount } from '../../components/IncidentsGraphics/TagCount';
import { TagTopLikes } from '../../components/IncidentsGraphics/TagTopLikes';
import conections from '../../conections';

const GraphicIncidents = () => {

    const [dataLikes, setDataLikes] = useState([]);
    const [dataCount, setDataCount] = useState([]);

    useEffect(() => {
        conections.getTopLikes()
            .then(response => {
                if (response.data.success) {
                    setDataLikes(response.data.tags);
                };
            })
            .catch(err => console.error(err));

        conections.getDataTags()
            .then(response => {
                if (response.data.success) {
                    setDataCount(response.data.tags);
                };
            })
            .catch(err => console.error(err));

    }, []);

    return (
        <div className="row" style={{ marginTop: "5rem" }}>
            <div className="col-6">
                <TagTopLikes data={dataLikes} />
            </div>
            <div className="col-6">
                <TagCount data={dataCount} />
            </div>
        </div>
    )
}

export default GraphicIncidents;