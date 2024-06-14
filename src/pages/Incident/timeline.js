import React, { useState, useEffect } from "react";
import {
    Card,
    Image,
    Row,
    Col
} from "react-bootstrap";
import profile from "../../assets/images/profile.jpg";
import imagenPost from "../../assets/images/imagenPost.jpg";
import * as moment from "moment";

export default function TimeLine(props) {

    let dataMap = props.data;
    return (
        (dataMap && dataMap.length > 0) ?
            dataMap.map((value, index) => {
                return (
                    <React.Fragment key={index}>
                        <Card.Body id="cardBody" style={{ backgroundColor: '#f5f5f5', marginTop: '8px', borderRadius: '5px', width: '620px' }}  >
                            <Row>
                                <Col lg={1} md={1}>
                                    <Image
                                        src={profile}
                                        width={30}
                                        height={30}
                                        roundedCircle
                                    />
                                </Col>
                                <Col
                                    lg={2}
                                    md={2}
                                    style={{
                                        textAlign: "left !important",
                                        padding: "0px",
                                        marginTop: "0px",
                                        marginLeft: "5px",
                                    }}
                                >
                                    <h6 style={{ textAlign: "left !important" }}>
                                        {" "}
                                        {value.firstname && value.lastname ?
                                            <b>
                                                {value.firstname} {value.lastname}
                                            </b>
                                            :
                                            <b>
                                                Unregistered user
                                            </b>
                                        }
                                    </h6>
                                </Col>
                            </Row>
                            <h3 style={{ textAlign: "left !important" }}>
                                {" "}
                                Description: {value.description} <br></br>{" "}
                                <p style={{ color: "blue" }}> #{value.tag} </p>{" "}
                                <p
                                    style={{
                                        textAlign: "right !important",
                                        fontSize: "10px",
                                    }}
                                >
                                    Date:{" "}
                                    {moment(value.creationDate.toDate()).format(
                                        "LLL"
                                    )}{" "}
                                </p>
                            </h3>

                            <Image
                                id="imagenTimeLine"
                                src={
                                    value.incidence_photo
                                        ? value.incidence_photo
                                        : imagenPost
                                }
                                width={500}
                                height={240}
                                rounded
                            />
                        </Card.Body>
                    </React.Fragment>
                )

            }
            )
            : <div>
                <br />
                <h2 className="noDataFound">
                    No data found
                </h2>
            </div>
    )
}