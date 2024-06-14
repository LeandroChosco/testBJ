import React from "react";
import {
    Card,
    Col
} from "react-bootstrap";

export default function TotalIncidents(props) {

    const { dataMap, tags } = props;
    const maxIncident = {
        tag: "",
        total: 0
    };
    tags.forEach((tag) => {
        if (tag.total > maxIncident.total) {
            maxIncident.tag = tag.tag;
            maxIncident.total = tag.total;
        };
        if(tag.total === maxIncident.total && tag.total !== 0){
            maxIncident.tag = `Many tags (${maxIncident.total} times)`
        }
    });

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
                            TOTAL INCIDENTS : {(dataMap && dataMap.length > 0)? dataMap.length : 0}
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
                            MOST REPORTED INCIDENT : {(maxIncident.total > 0 ? maxIncident.tag : 'No incidents').toUpperCase()}
                        </b>

                    </Card>
                </Col>
            </div>
            <div style={{ textAlign: "center" }}>
                <h2>
                    INCIDENTS FOR TAGS
                </h2>
            </div>
        </>
    )
}