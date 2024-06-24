import React, { useState } from "react";
import { useEffect } from "react";
import {
    Card,
    Col
} from "react-bootstrap";

export default function TotalIncidents(props) {

    const { dataMap, tags } = props;

    const [maxIncident, setMaxIncident] = useState({
        tag: "",
        total: 0
    })

    useEffect(() => {

        const sortTags = tags.sort((a, b) => a.total > b.total ? -1 : 1);

        if (sortTags[0].total === sortTags[1].total) {
            const newMaxIncident = {
                tag: `Many tags`,
                total: sortTags[0].total
            };
            setMaxIncident(newMaxIncident);
        } else {
            const newMaxIncident = {
                tag: sortTags[0].tag,
                total: sortTags[0].total,
            };
            setMaxIncident(newMaxIncident);
        }

        // tags.forEach((tag) => {
        //     console.log("LOS TAGS", tag)
        //     if (tag.total > maxIncident.total) {
        //         maxIncident.tag = tag.tag;
        //         maxIncident.total = tag.total;
        //     };
        //     if (tag.total === maxIncident.total && tag.total !== 0) {

        //     }
        // });
    }, [])

    return (
        <>
            <div className="search">
                <Col lg={4} md={4}>
                    <Card
                        bg={"secondary"}
                        text={"white"}
                        style={{
                            height: "100%",
                            textAlign: "center",
                            justifyContent: "center",
                            boxShadow: '5px 5px lightgrey',
                        }}
                        className="mb-2"
                    >
                        <b>
                            TOTAL INCIDENTS : {(dataMap && dataMap.length > 0) ? dataMap.length : 0}
                        </b>

                    </Card>
                </Col>
                <Col lg={8} md={8}>
                    <Card
                        bg={"secondary"}
                        text={"white"}
                        style={{
                            height: "100%",
                            textAlign: "center",
                            justifyContent: "center",
                            boxShadow: '5px 5px lightgrey',
                        }}
                        className="mb-2"
                    >
                        <b>
                            MOST REPORTED INCIDENT : {(maxIncident.total > 0 ? `${maxIncident.tag} (${maxIncident.total})` : 'No incidents').toUpperCase()}
                        </b>

                    </Card>
                </Col>
            </div>
        </>
    )
}